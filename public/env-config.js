(async function () {
  const fullHostname = window.location.hostname;

  // Extract hostname without TLD for config matching
  // e.g., "app.nexoya.io" -> "nexoya", "philippmeier.ch" -> "philippmeier", "staging.company.com" -> "company"
  function extractHostname(fullHostname) {
    // Split by dots and find the main domain part (ignoring subdomains and TLD)
    const parts = fullHostname.split('.');

    // For single-part hostnames (localhost, etc.)
    if (parts.length === 1) {
      return parts[0];
    }

    // For multi-part hostnames, always use the second-to-last part (the domain name)
    // Examples:
    // - "nexoya.io" -> parts[0] = "nexoya"
    // - "app.nexoya.io" -> parts[1] = "nexoya"
    // - "philippmeier.ch" -> parts[0] = "philippmeier"
    // - "staging.company.com" -> parts[1] = "company"

    if (parts.length >= 2) {
      // If it's domain.tld (2 parts), use the first part
      if (parts.length === 2) {
        return parts[0];
      }

      // If it's subdomain.domain.tld (3+ parts), use the second-to-last part (domain)
      return parts[parts.length - 2];
    }

    return fullHostname; // Fallback to full hostname
  }

  // Load base configuration from external file
  const baseConfig = window.nexyBaseConfig || {};

  // Load host-specific configurations from external file
  const hostConfigs = window.nexyTenantConfigs || {};

  const hostname = extractHostname(fullHostname);
  // Function to find matching host config dynamically
  function findHostConfig(hostname, hostConfigs) {
    // Exact match first
    if (hostConfigs[hostname]) {
      return hostConfigs[hostname];
    }

    // Check for partial matches (subdomains or domain variations)
    for (const configHost in hostConfigs) {
      if (hostname.includes(configHost) || configHost.includes(hostname)) {
        return hostConfigs[configHost];
      }
    }

    return null; // No match found
  }

  // Determine which configuration to use based on hostname
  let hostConfig = findHostConfig(hostname, hostConfigs);

  if (!hostConfig) {
    // Use 'nexoya' configuration as default, fallback to 'nexoya.io' if no host match found
    hostConfig = hostConfigs['nexoya'] || {};
  }

  // Merge base config with host-specific config
  window.nexyConfig = { ...baseConfig, ...hostConfig };
})();
