#!/usr/bin/env bash

set -Eeuo pipefail

# Single image for all stages: write runtime env into public config files.
# Prefixes:
# - REACT_APP_TENANTS_* -> env-config-tenants.js (grouped by tenant)
# - REACT_APP_* (non-tenant) -> env-config-base.js (shared)

readonly PUBLIC_DIR="/workspace/public"

readonly ENV_CONFIG_JS="${PUBLIC_DIR}/env-config.js"
readonly BASE_CONF="${PUBLIC_DIR}/env-config-base.js"
readonly TENANTS_CONF="${PUBLIC_DIR}/env-config-tenants.js"

readonly INDEX_HTML="${PUBLIC_DIR}/index.html"
readonly TENANT_INDEX_TEMPLATE="${PUBLIC_DIR}/index_tenant_template.html"

readonly NGINX_CONF="/workspace/nginx.conf"

log() { printf '%s\n' "$*" >&2; }

# Escape a string for safe insertion into a single-quoted JS string literal.
js_escape() {
  # Escape backslashes first, then single quotes
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e "s/'/\\'/g"
}

# Portable in-place sed (GNU/BSD)
sed_inplace() {
  # shellcheck disable=SC2016
  sed -i'' "$@"
}

log "=== Generating base configuration ==="
{
  echo '// Base configuration shared across all tenants'
  echo 'window.nexyBaseConfig = {'
  # Read env lines safely; filter here to avoid word-splitting issues
  while IFS= read -r line; do
    # Skip empty lines just in case
    [ -z "${line}" ] && continue || true
    case "${line}" in
      REACT_APP_TENANTS_*) continue ;;
      REACT_APP_*)
        var_name=${line%%=*}
        var_value=${line#*=}
        printf "  %s: '%s',\n" "${var_name}" "$(js_escape "${var_value}")"
        ;;
      *) : ;;
    esac
  done < <(env | LC_ALL=C grep -E '^REACT_APP_')
  echo '};'
} > "${BASE_CONF}"

log "Base configuration generated:"
cat "${BASE_CONF}" || true
echo

log "=== Generating tenant-specific configuration ==="
declare -A tenants=()
declare -A tenant_names=()

# Collect tenant vars safely
while IFS= read -r line; do
  [ -z "${line}" ] && continue || true
  var_name=${line%%=*}
  var_value=${line#*=}

  # Strip prefix and split into tenant + key
  temp=${var_name#REACT_APP_TENANTS_}
  tenantname=$(printf '%s' "${temp}" | cut -d'_' -f1 | tr '[:upper:]' '[:lower:]')
  # Everything after first '_' becomes REACT_APP_<...>
  remainder=${temp#*_}
  config_key="REACT_APP_${remainder}"

  tenants["${tenantname}:${config_key}"]="${var_value}"
  tenant_names["${tenantname}"]=1
  log "Parsed: ${var_name} -> tenant='${tenantname}', key='${config_key}'"
done < <(env | LC_ALL=C grep -E '^REACT_APP_TENANTS_')

log "=== Writing tenant configurations ==="
{
  echo '// Tenant-specific configurations'
  echo 'window.nexyTenantConfigs = {'

  current_tenant=""
  # Sort by tenant:key for deterministic output
  while IFS= read -r key; do
    IFS=':' read -r tenantname config_key <<< "${key}"
    config_value=${tenants["${key}"]}

    if [[ "${tenantname}" != "${current_tenant}" ]]; then
      if [[ -n "${current_tenant}" ]]; then
        echo "  },"
      fi
      printf "  '%s': {\n" "${tenantname}"
      current_tenant="${tenantname}"
      log "Starting tenant block: ${tenantname}"
    fi

    printf "    %s: '%s',\n" "${config_key}" "$(js_escape "${config_value}")"
    log "  Added: ${config_key} = ${config_value}"
  done < <(printf '%s\n' "${!tenants[@]}" | sort)

  if [[ -n "${current_tenant}" ]]; then
    echo "  },"
  fi
  echo '};'
} > "${TENANTS_CONF}"

# Version injection (prefer REACT_APP_BASE_VERSION, fallback REACT_APP_VERSION)
version=""
if version_line=$(env | LC_ALL=C grep -m1 -E '^REACT_APP_BASE_VERSION='); then
  version=${version_line#*=}
elif version_line=$(env | LC_ALL=C grep -m1 -E '^REACT_APP_VERSION='); then
  version=${version_line#*=}
fi

if [[ -n "${version}" ]]; then
  log "Injecting version '${version}' into index files"
  for f in "${INDEX_HTML}" "${ENV_CONFIG_JS}"; do
    if [[ -f "$f" ]]; then
      sed_inplace "s/version=SETME/version=${version//\//\/}/g" "$f" || true
    fi
  done
fi

# Build dedicated index_<tenant>.html from template
log "=== Generating per-tenant index files ==="
if [[ -f "${TENANT_INDEX_TEMPLATE}" ]]; then
  for tenant_name in "${!tenant_names[@]}"; do
    out_file="${PUBLIC_DIR}/index_${tenant_name}.html"
    cp -f "${TENANT_INDEX_TEMPLATE}" "${out_file}"
    log "  Created ${out_file}"

    [[ -n "${version}" ]] && sed_inplace "s/version=SETME/version=${version//\//\/}/g" "${out_file}" || true

    index_title=${tenants["${tenant_name}:REACT_APP_INDEX_TITLE"]:-}
    index_domain=${tenants["${tenant_name}:REACT_APP_INDEX_DOMAIN"]:-}
    index_login_domain=${tenants["${tenant_name}:REACT_APP_INDEX_LOGIN_DOMAIN"]:-}
    index_icon_url=${tenants["${tenant_name}:REACT_APP_INDEX_ICON_URL"]:-}

    if [[ -n "${index_title}" ]]; then
      esc=$(printf '%s' "${index_title}" | sed -e 's/[\\\/&]/\\&/g')
      sed_inplace "s|__TENANT_INDEX_TITLE__|${esc}|g" "${out_file}"
    else
      log "  Note: APP_TITLE not set for tenant '${tenant_name}', leaving __TENANT_INDEX_TITLE__"
    fi
    if [[ -n "${index_domain}" ]]; then
      esc=$(printf '%s' "${index_domain}" | sed -e 's/[\\\/&]/\\&/g')
      sed_inplace "s|__TENANT_INDEX_DOMAIN__|${esc}|g" "${out_file}"
    else
      log "  Note: APP_DOMAIN not set for tenant '${tenant_name}', leaving __TENANT_INDEX_DOMAIN__"
    fi
    if [[ -n "${index_login_domain}" ]]; then
      esc=$(printf '%s' "${index_login_domain}" | sed -e 's/[\\\/&]/\\&/g')
      sed_inplace "s|__TENANT_INDEX_LOGIN_DOMAIN__|${esc}|g" "${out_file}"
    else
      log "  Note: APP_LOGIN_DOMAIN not set for tenant '${tenant_name}', leaving __TENANT_INDEX_LOGIN_DOMAIN__"
    fi
    if [[ -n "${index_icon_url}" ]]; then
      esc=$(printf '%s' "${index_icon_url}" | sed -e 's/[\\\/&]/\\&/g')
      sed_inplace "s|__TENANT_ICON_URL__|${esc}|g" "${out_file}"
    else
      log "  Note: APP_ICON_URL not set for tenant '${tenant_name}', leaving __TENANT_ICON_URL__"
    fi
  done
else
  log "Tenant index template not found at ${TENANT_INDEX_TEMPLATE}; skipping per-tenant index generation"
fi

# Inject tenant-specific Nginx map entries at the anchor
log "=== Updating Nginx config with tenant-specific SPA index mapping ==="
if [[ -f "${NGINX_CONF}" ]]; then
  nginx_map_lines=""
  for tenant_name in "${!tenant_names[@]}"; do
    host_domain=${tenants["${tenant_name}:REACT_APP_INDEX_DOMAIN"]:-}
    if [[ -n "${host_domain}" ]]; then
      nginx_map_lines+=$(printf '~*(^|\\.)%s$  /index_%s.html;\n' "${host_domain}" "${tenant_name}")
      log "  Map: host '~*(^|.)${host_domain}$' -> '/index_${tenant_name}.html'"
    else
      log "  Note: APP_DOMAIN not set for tenant '${tenant_name}', skipping nginx mapping"
    fi
  done

  if [[ -n "${nginx_map_lines}" ]]; then
    tmpfile=$(mktemp)
    awk -v repl="${nginx_map_lines}" '{ gsub(/##ANCHOR_ADD_TENANT_SPECIFIC_INDEX##/, repl); print }' "${NGINX_CONF}" > "${tmpfile}"
    if [[ -s "${tmpfile}" ]]; then
      mv "${tmpfile}" "${NGINX_CONF}"
      log "  Injected tenant mappings into nginx.conf"
    else
      rm -f "${tmpfile}"
      log "  Failed to update nginx.conf; leaving original"
    fi
  else
    log "  No tenant mappings generated; nginx.conf unchanged"
  fi
else
  log "  nginx.conf not found at ${NGINX_CONF}; skipping"
fi

exec /cnb/process/web