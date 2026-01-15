import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { useProviders } from '../../../../../../context/ProvidersProvider';
import translate from '../../../../../../utils/translate';
import {
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentV2,
  NexoyaProvider,
} from '../../../../../../types';
import AvatarProvider from '../../../../../../components/AvatarProvider';
import Button from '../../../../../../components/Button';
import { toNumber, truncate } from 'lodash';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../../../../components-ui/DropdownMenu';
import { Command, CommandInput, CommandItem, CommandList } from '../../../../../../components-ui/Command';
import ButtonAdornment from '../../../../../../components/ButtonAdornment';
import FormControlLabel from '../../../../../../components/FormControlLabel';
import { useProviderSubAccountsQuery } from '../../../../../../graphql/portfolioRules/queryProviderSubAccounts';
import { useTeam } from '../../../../../../context/TeamProvider';
import useTranslationStore from '../../../../../../store/translations';
import Checkbox from '../../../../../../components/Checkbox';
import { CONTENT_TYPE_SUB_ACCOUNT_NUMBER } from '../../../../utils/portfolio-rules';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../../../components-ui/AlertDialog';
import { useProviderRuleStore } from '../../../../../../store/provider-rules';

interface Options {
  value: string;
  label: string;
  subOptions: { value: string; label: string }[];
}

interface Props {
  portfolioId?: number;
  selectedAccountIds: number[];
  setSelectedAccountIds: Dispatch<SetStateAction<number[]>>;
  selectedProviderIds: number[];
  setSelectedProviderIds: Dispatch<SetStateAction<number[]>>;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
  allowMultipleProviderSelection: boolean;
  initialSubAccounts?: Partial<NexoyaContentV2[]>;
  resetFilters: () => void;
}

export function ProviderDropdownFilter({
  portfolioId,
  selectedProviderIds,
  setSelectedProviderIds,
  selectedAccountIds,
  setSelectedAccountIds,
  setShouldFetch,
  allowMultipleProviderSelection,
  initialSubAccounts,
  resetFilters,
}: Props) {
  const { providerMapSelection, setProviderMapSelection, subAccounts, setSubAccounts } = useProviderRuleStore();

  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ accountId: number; providerId: string } | null>(null);

  const { activeProviders } = useProviders();
  const { teamId } = useTeam();
  const { translations } = useTranslationStore();
  const [open, setOpen] = useState(false);

  const shouldSkipQuery = !portfolioId;
  const { loading } = useProviderSubAccountsQuery({
    teamId,
    portfolioId: portfolioId ?? 0,
    filters: [
      {
        fieldName: NexoyaContentFilterFieldName.ContentType,
        operator: NexoyaContentFilterOperator.Eq,
        value: { number: CONTENT_TYPE_SUB_ACCOUNT_NUMBER },
      },
    ],
    excludePortfolioContents: false,
    onCompleted: (data) => setSubAccounts(data?.filterContents),
    skip: shouldSkipQuery,
  });

  useEffect(() => {
    if (initialSubAccounts && !subAccounts.length) {
      setSubAccounts(initialSubAccounts as NexoyaContentV2[]);
    }
  }, []);

  useEffect(() => {
    if (selectedProviderIds.length && selectedAccountIds.length) {
      const initialProviderMapSelection: { [providerId: string]: number[] } = {};

      selectedProviderIds.forEach((providerId) => {
        const accountIds = subAccounts
          .filter((sub) => sub.provider?.provider_id === providerId)
          .map((sub) => sub.contentId)
          .filter((id) => selectedAccountIds.includes(id)); // Ensure only selected accounts are added

        if (accountIds.length > 0) {
          initialProviderMapSelection[providerId.toString()] = accountIds;
        }
      });

      setProviderMapSelection(initialProviderMapSelection);
    }
  }, [selectedProviderIds, selectedAccountIds, subAccounts]);

  const providerOptions: Options[] = activeProviders
    ?.filter((p: NexoyaProvider) => p.isPortfolioPrimaryChannel)
    ?.map((p: NexoyaProvider) => ({
      value: p.provider_id?.toString(),
      label: p.name,
      subOptions: subAccounts
        .filter((s) => s.provider?.provider_id === p.provider_id)
        .map((c) => ({
          value: c.contentId.toString(),
          label: translate(translations, c.title),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }));

  const toggleAccountSelection = (accountId: number, providerId: string) => {
    if (!allowMultipleProviderSelection) {
      const currentProvider = Object.keys(providerMapSelection)[0];
      if (currentProvider && currentProvider !== providerId) {
        setShowWarningDialog(true);
        setPendingSelection({ accountId, providerId });
        return;
      }
    }

    handleAccountSelection(accountId, providerId);
  };

  const handleAccountSelection = (accountId: number, providerId: string) => {
    // @ts-ignore
    setProviderMapSelection((prev) => {
      if (!allowMultipleProviderSelection) {
        const currentAccounts = prev[providerId] || [];
        const updatedAccounts = currentAccounts.includes(accountId)
          ? currentAccounts.filter((id) => id !== accountId)
          : [...currentAccounts, accountId];

        return { [providerId]: updatedAccounts };
      }

      const currentAccounts = prev[providerId] || [];
      const updatedAccounts = currentAccounts.includes(accountId)
        ? currentAccounts.filter((id) => id !== accountId)
        : [...currentAccounts, accountId];

      const newSelection = { ...prev, [providerId]: updatedAccounts };
      if (updatedAccounts.length === 0) {
        delete newSelection[providerId];
      }

      return newSelection;
    });

    setSelectedAccountIds((prev) => {
      if (!allowMultipleProviderSelection) {
        return prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId];
      }

      return prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId];
    });

    setSelectedProviderIds((prev) => {
      if (!allowMultipleProviderSelection) {
        const providerIdNumber = toNumber(providerId);
        return prev.includes(providerIdNumber) ? prev : [providerIdNumber];
      }

      const currentAccounts = providerMapSelection[providerId] || [];
      const isDeselectingLastAccount = currentAccounts.length === 1 && currentAccounts.includes(accountId);

      return isDeselectingLastAccount
        ? prev.filter((id) => id !== toNumber(providerId))
        : prev.includes(toNumber(providerId))
          ? prev
          : [...prev, toNumber(providerId)];
    });

    setShouldFetch(true);
  };

  return (
    <>
      {/* Add Channel Button */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {Object.keys(providerMapSelection).length > 0 ? (
            <Button
              disabled={loading || !providerOptions.length}
              size="small"
              variant="contained"
              color="secondary"
              className="!ml-2 flex items-center gap-2 !py-1.5"
            >
              {allowMultipleProviderSelection ? (
                <div className="flex items-center gap-2">
                  {Object.entries(providerMapSelection).map(([providerId, accountIds], index) => {
                    const provider = activeProviders.find((p) => p.provider_id?.toString() === providerId);
                    return (
                      <React.Fragment key={providerId}>
                        {index > 0 && <span className="text-neutral-400">•</span>}
                        <div className="flex items-center gap-1">
                          <AvatarProvider providerId={providerId} size={15} color="dark" />
                          <span>{translate(translations, provider?.name)}</span>
                          <span className="text-neutral-400">- {accountIds.length} selected</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {(() => {
                    const [[providerId, accountIds]] = Object.entries(providerMapSelection);
                    const provider = activeProviders.find((p) => p.provider_id?.toString() === providerId);

                    return (
                      <>
                        <AvatarProvider className="mr-2" providerId={providerId} size={15} color="dark" />
                        <span>{translate(translations, provider?.name)}</span>
                        {accountIds.length > 1 ? (
                          <span className="text-neutral-400">- {accountIds.length} selected</span>
                        ) : (
                          <span className="text-neutral-400">
                            -{' '}
                            {truncate(
                              translate(
                                translations,
                                subAccounts.find((sub) => sub.contentId === accountIds[0])?.title,
                              ),
                              {
                                length: 20,
                              },
                            )}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </Button>
          ) : (
            <Button
              disabled={loading || !providerOptions.length}
              size="small"
              variant="contained"
              color="secondary"
              className="!ml-2 flex justify-between gap-2 !py-1.5"
              startAdornment={
                <ButtonAdornment>
                  <CirclePlus className="h-4 w-4" />
                </ButtonAdornment>
              }
            >
              {loading ? 'Loading...' : 'Add channel'}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-96 w-64 overflow-y-auto font-normal" align="start">
          {providerOptions.map((provider) => (
            <DropdownMenuSub key={provider.value}>
              <DropdownMenuSubTrigger disabled={provider.subOptions.length === 0}>
                <AvatarProvider className="mr-2" providerId={provider.value} size={15} color="dark" />
                <span>{translate(translations, provider.label)}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-96 overflow-y-auto p-0">
                  <Command>
                    {provider.subOptions.length > 3 && (
                      <CommandInput placeholder="Search accounts..." autoFocus className="h-9" />
                    )}
                    <CommandList>
                      {provider.subOptions.length < 3 && (
                        <>
                          <DropdownMenuLabel className="text-[11px] uppercase text-neutral-400">
                            Account
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {provider.subOptions.length > 2 && (
                        <CommandItem onSelect={() => false} className="!p-0">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="w-full">
                            <FormControlLabel
                              checked={providerMapSelection[provider.value]?.length === provider.subOptions.length}
                              onChange={() => {
                                const allAccountIds = provider.subOptions.map((sub) => toNumber(sub.value));
                                const isAllSelected =
                                  providerMapSelection[provider.value]?.length === provider.subOptions.length;

                                // First case: When deselecting all
                                if (isAllSelected) {
                                  const newSelection = { ...providerMapSelection };
                                  delete newSelection[provider.value];
                                  setProviderMapSelection(newSelection);
                                  setSelectedAccountIds((prev) => prev.filter((id) => !allAccountIds.includes(id)));
                                  setSelectedProviderIds((prev) =>
                                    prev.filter((id) => id !== toNumber(provider.value)),
                                  );
                                } else {
                                  // Second case: When selecting all
                                  if (!allowMultipleProviderSelection) {
                                    setProviderMapSelection({ [provider.value]: allAccountIds });
                                  } else {
                                    const newSelection = {
                                      ...providerMapSelection,
                                      [provider.value]: allAccountIds,
                                    };
                                    setProviderMapSelection(newSelection);
                                  }
                                  setSelectedAccountIds((prev) => [...new Set([...prev, ...allAccountIds])]);
                                  setSelectedProviderIds((prev) => [...new Set([...prev, toNumber(provider.value)])]);
                                }
                                setShouldFetch(true);
                              }}
                              value="select-all"
                              label="Select all"
                              control={
                                <Checkbox
                                  color="dark"
                                  className="!flex-row-reverse !py-1.5"
                                  inputProps={{ 'aria-label': 'Select all' }}
                                />
                              }
                            />
                          </DropdownMenuItem>
                        </CommandItem>
                      )}
                      {provider.subOptions.map((sub) => (
                        <CommandItem key={sub.value} value={sub.label} onSelect={() => false} className="!p-0">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="w-full">
                            <FormControlLabel
                              checked={(providerMapSelection[provider.value] || []).includes(toNumber(sub.value))}
                              onChange={() => {
                                toggleAccountSelection(toNumber(sub.value), provider.value);
                              }}
                              value={sub.value}
                              label={sub.label}
                              control={
                                <Checkbox
                                  color="dark"
                                  className="!flex-row-reverse !py-1.5"
                                  inputProps={{ 'aria-label': sub.label }}
                                />
                              }
                            />
                          </DropdownMenuItem>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display selected provider filters only when allowMultipleProviderSelection is true */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent className="z-[3600]">
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                Selecting an account from a different provider will clear your current selection. Do you want to
                continue?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button onClick={() => setShowWarningDialog(false)} variant="contained" color="secondary" size="small">
                Cancel
              </Button>
            </AlertDialogAction>

            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  if (pendingSelection) {
                    handleAccountSelection(pendingSelection.accountId, pendingSelection.providerId);
                    setPendingSelection(null);
                    resetFilters();
                  }
                  setShowWarningDialog(false);
                }}
                variant="contained"
                color="danger"
                size="small"
              >
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
