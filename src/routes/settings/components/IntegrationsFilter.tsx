import { ListRestart } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { orderBy, sortBy } from 'lodash';

import { NexoyaIntegration, NexoyaProvider } from '../../../types';

import { categorizeProviders, Category, getCustomCategories } from '../../../utils/integration';
import translate from '../../../utils/translate';

import MenuList from '../../../components/ArrayMenuList/ArrayMenuList';
import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import { useMenu } from '../../../components/Menu';
import MenuItem from '../../../components/MenuItem';
import Panel from '../../../components/Panel';
import TextField from '../../../components/TextField';
import Tooltip from '../../../components/Tooltip';
import Typography from '../../../components/Typography';
import SvgCaretDown from '../../../components/icons/CaretDown';

import { nexyColors } from '../../../theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import { useTeamQuery } from '../../../graphql/team/queryTeam';
import useTranslationStore from '../../../store/translations';
import useUserStore from '../../../store/user';

export const IntegrationsFilter = ({ integrations, setIntegrations, refetching }) => {
  const { translations } = useTranslationStore();

  const { data: teamData } = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });
  const { isSupportUser } = useUserStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>();

  const integrationProviders: NexoyaProvider[] = integrations.map((integration) => integration.provider);
  const integrationCategories = sortBy(categorizeProviders(integrationProviders), 'title');

  const externalCategories = getCustomCategories(integrations);
  const [customCategory, setCustomCategory] = useState<Category>(externalCategories[1]);

  const {
    anchorEl: categoriesAnchor,
    open: categoriesOpen,
    toggleMenu: toggleCategories,
    closeMenu: closeCategories,
  } = useMenu();

  const onboardingTasksProviderIds = teamData?.team?.onboarding?.onboardingTasks
    ?.map((task) => task?.providerId)
    ?.filter(Boolean);

  const onboardingIntegrations: NexoyaIntegration[] = integrations.filter((integration) =>
    isSupportUser
      ? true
      : onboardingTasksProviderIds?.length
        ? onboardingTasksProviderIds.includes(integration.provider_id)
        : true,
  );

  const isOnboardingAndNotSupportUser = !isSupportUser && onboardingTasksProviderIds?.length > 0;

  useEffect(() => {
    const applyFilters = () => {
      // If team is in onboarding, don't apply any filters
      if (isOnboardingAndNotSupportUser) {
        setIntegrations(
          onboardingIntegrations?.filter((integration) =>
            onboardingTasksProviderIds.includes(integration.provider?.provider_id),
          ),
        );
        return;
      }

      const isFeaturedCategory = customCategory?.title === externalCategories[1]?.title;

      let filteredIntegrations = orderBy(
        integrations,
        isFeaturedCategory ? ['connected'] : ['title'],
        isFeaturedCategory ? ['desc'] : ['asc'],
      );

      if (search) {
        try {
          const regex = new RegExp(search, 'i');
          filteredIntegrations = integrations.filter((integration: NexoyaIntegration) => {
            const providerTranslation = translate(translations, integration?.provider?.name);
            return regex.test(providerTranslation);
          });
          setIntegrations(filteredIntegrations);
          return;
        } catch (e) {
          console.error('Invalid regex pattern', e);
        }
      }

      if (category) {
        filteredIntegrations = filteredIntegrations.filter((integration) =>
          category.providerIds.includes(integration.provider_id),
        );
      }

      if (customCategory) {
        // If Featured category is selected, include all connected integrations (N333)
        if (isFeaturedCategory) {
          filteredIntegrations = filteredIntegrations.filter(
            (integration) => customCategory.providerIds.includes(integration.provider_id) || integration.connected,
          );
        } else {
          filteredIntegrations = filteredIntegrations.filter((integration) =>
            customCategory.providerIds.includes(integration.provider_id),
          );
        }
      }

      setIntegrations(filteredIntegrations);
    };

    applyFilters();
  }, [search, category, customCategory, translations, setIntegrations, refetching]);

  return (
    <div className="mb-6 flex gap-3">
      <Panel
        container={categoriesAnchor.current}
        anchorEl={categoriesAnchor.current}
        open={categoriesOpen}
        onClose={closeCategories}
        placement="bottom-start"
        popperProps={{
          style: {
            height: '100%',
            maxHeight: '100%',
            zIndex: 35000,
          },
        }}
        style={{
          maxHeight: 'fit-content',
        }}
      >
        <MenuList color="dark">
          {integrationCategories?.map((category, idx) => (
            <MenuItem
              onClick={() => {
                setCategory(category);
                closeCategories();
              }}
              key={idx + 'handle-change-simulation'}
              color="dark"
            >
              <Typography>{category.title}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Panel>

      <TextField
        style={{ width: '100%' }}
        placeholder="Search integrations"
        value={search}
        disabled={isOnboardingAndNotSupportUser}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="budgetStepSelector"
            active={categoriesOpen}
            variant="contained"
            color="secondary"
            flat
            size="small"
            type="button"
            disabled={isOnboardingAndNotSupportUser}
            style={{
              minWidth: 234,
              maxWidth: 234,
              boxShadow: 'rgb(223, 225, 237) 0px 0px 0px 1px',
              fontWeight: 400,
              color: nexyColors.cloudyBlue,
              padding: '12px 16px',
              justifyContent: 'space-between',
            }}
            onClick={toggleCategories}
            ref={categoriesAnchor}
            endAdornment={
              <ButtonAdornment position="end">
                <SvgCaretDown
                  style={{
                    transform: `rotate(${open ? '180' : '0'}deg)`,
                  }}
                />
              </ButtonAdornment>
            }
          >
            <Typography>
              {category ? category.title : customCategory ? customCategory.title : 'Select categories'}
            </Typography>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full font-normal" align="end">
          <DropdownMenuLabel>Explore</DropdownMenuLabel>
          <DropdownMenuGroup>
            {externalCategories?.map((categ) => (
              <DropdownMenuItem
                key={categ.title}
                className="flex justify-between gap-8"
                onClick={() => {
                  setCategory(undefined);

                  if (customCategory?.title === categ?.title) {
                    setCustomCategory(null);
                  } else {
                    setCustomCategory(categ);
                  }
                  closeCategories();
                }}
              >
                <Typography>{categ.title}</Typography>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuGroup>
            {integrationCategories?.map((categ) => (
              <DropdownMenuItem
                key={categ.title}
                className="flex justify-between gap-8"
                onClick={() => {
                  setCustomCategory(undefined);
                  setCategory(categ);
                  closeCategories();
                }}
              >
                <Typography>{categ.title}</Typography>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip content="Reset filters" variant="dark">
        <Button
          style={{ padding: '8px 16px' }}
          disabled={(!category && !search && !customCategory) || isOnboardingAndNotSupportUser}
          variant="contained"
          color="secondary"
          size="small"
          flat
          onClick={() => {
            setCategory(undefined);
            setCustomCategory(undefined);
            setSearch('');
            setIntegrations(integrations); // Reset to original integrations
          }}
        >
          <ListRestart />
        </Button>
      </Tooltip>
    </div>
  );
};
