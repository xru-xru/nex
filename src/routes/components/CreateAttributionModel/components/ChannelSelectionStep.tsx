import React from 'react';
import AvatarProvider from '../../../../components/AvatarProvider';
import Button from '../../../../components/Button';
import { AddFilterDropdown } from '../../../portfolio/components/Content/PortfolioRule/filter/AddFilterDropdown';
import { DataTableFilterOption } from '../../../portfolio/components/Content/PortfolioRule/types';
import { ChannelAccount, ChannelSelection } from '../types';
import { CirclePlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../components-ui/Command';
import translate from '../../../../utils/translate';
import useTranslationStore from '../../../../store/translations';
import { NexoyaContentFilterFieldName } from '../../../../types';
import { FilterItem } from '../../../portfolio/components/Content/PortfolioRule/filter/FilterItem';
import ButtonAdornment from '../../../../components/ButtonAdornment';
import { cn } from '../../../../lib/utils';
import Checkbox from '../../../../components/Checkbox';
import FormControlLabel from '../../../../components/FormControlLabel';

export type AvailableChannel = {
  providerId: number;
  providerName: string;
  providerLogo?: string;
  integrationId: number;
  accounts: ChannelAccount[];
};

type ChannelSelectionStepProps = {
  integrationsLoading: boolean;
  availableChannels: AvailableChannel[];
  selectedChannels: ChannelSelection[];
  openFilterPopoverProviderId: number | null;
  loadingAvailableFields: boolean;
  onAddChannelAccount: (providerId: number, adAccountId: string) => void;
  onSelectAllAccounts: (providerId: number) => void;
  onRemoveChannel: (providerId: number) => void;
  onOpenFilters: (providerId: number) => void;
  onMarkFilterPopoverOpen: (providerId: number) => void;
  getFiltersDispatch: (providerId: number) => React.Dispatch<React.SetStateAction<DataTableFilterOption[]>>;
};

export function ChannelSelectionStep({
  integrationsLoading,
  availableChannels,
  selectedChannels,
  openFilterPopoverProviderId,
  loadingAvailableFields,
  onAddChannelAccount,
  onSelectAllAccounts,
  onRemoveChannel,
  onOpenFilters,
  onMarkFilterPopoverOpen,
  getFiltersDispatch,
}: ChannelSelectionStepProps) {
  const { translations } = useTranslationStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                className="flex justify-between gap-2 !py-1.5"
                disabled={integrationsLoading || availableChannels.length === 0}
                startAdornment={
                  <ButtonAdornment>
                    <CirclePlus className="h-4 w-4" />
                  </ButtonAdornment>
                }
              >
                {integrationsLoading ? 'Loading channels...' : 'Add channel'}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 font-normal" align="start">
            {availableChannels.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500">No connected channels available.</div>
            ) : (
              availableChannels.map((channel) => (
                <DropdownMenuSub key={channel.providerId}>
                  <DropdownMenuSubTrigger className="flex items-center gap-2">
                    <AvatarProvider providerId={channel.providerId} size={18} color="dark" />
                    <span>{translate(translations, channel.providerName)}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="max-h-96 w-72 overflow-y-auto p-0">
                      <Command>
                        {channel.accounts.length > 6 && (
                          <CommandInput placeholder="Search accounts..." className="h-9" />
                        )}
                        <CommandList>
                          {channel.accounts.length === 0 ? (
                            <CommandEmpty>No accounts available</CommandEmpty>
                          ) : (
                            <CommandGroup>
                              {channel.accounts.length > 2 && (
                                <CommandItem
                                  onSelect={() => {
                                    onSelectAllAccounts(channel.providerId);
                                    return false;
                                  }}
                                  className="!p-0"
                                >
                                  <div className="w-full px-1 py-1.5">
                                    <FormControlLabel
                                      checked={
                                        selectedChannels.find((sel) => sel.providerId === channel.providerId)
                                          ?.selectedAccountIds.length === channel.accounts.length
                                      }
                                      onChange={() => onSelectAllAccounts(channel.providerId)}
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
                                  </div>
                                </CommandItem>
                              )}
                              {channel.accounts.map((account) => {
                                const isSelected =
                                  selectedChannels
                                    .find((sel) => sel.providerId === channel.providerId)
                                    ?.selectedAccountIds.includes(account.id) ?? false;
                                return (
                                  <CommandItem
                                    key={account.id}
                                    value={account.label}
                                    onSelect={() => onAddChannelAccount(channel.providerId, account.id)}
                                    className="flex items-center justify-between gap-2 px-1 py-1.5 text-sm"
                                  >
                                    <FormControlLabel
                                      checked={isSelected}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        onAddChannelAccount(channel.providerId, account.id);
                                      }}
                                      value={account.label}
                                      label={account.label}
                                      control={
                                        <Checkbox
                                          color="dark"
                                          className="!flex-row-reverse !py-1.5"
                                          onClick={(e) => e.preventDefault()}
                                          inputProps={{ 'aria-label': account.label }}
                                        />
                                      }
                                    />
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedChannels.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center text-sm text-neutral-400">
          No channels selected yet. Use “Add channel” to include the channels and ad accounts for this run.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {selectedChannels.map((channel) => {
            const filtersDispatch = getFiltersDispatch(channel.providerId);

            return (
              <div key={channel.providerId} className="rounded-lg border border-neutral-100 bg-white shadow-sm">
                <div className="flex items-start justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AvatarProvider providerId={channel.providerId} size={24} color="dark" />
                    <div>
                      <div className="text-mdlg font-medium text-neutral-900">
                        {translate(translations, channel.providerName)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-medium text-neutral-400 underline hover:text-neutral-600"
                    onClick={() => onRemoveChannel(channel.providerId)}
                  >
                    Remove from selection
                  </button>
                </div>

                <div className="flex w-full flex-col gap-2 p-6">
                  <div className="flex w-fit flex-col gap-2">
                    <div className="text-xs font-medium uppercase text-neutral-500">Contents: all</div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 rounded-md border border-neutral-100 px-3 text-sm font-normal text-neutral-400 shadow-sm">
                        <span className="text-neutral-600">Ad accounts: </span> {channel.selectedAccountIds.length}{' '}
                        selected
                      </div>
                      <AddFilterDropdown
                        options={channel.fields}
                        setSelectedOptions={filtersDispatch}
                        disabled={loadingAvailableFields && !channel.fields.length}
                        onSelect={() => {
                          onOpenFilters(channel.providerId);
                          onMarkFilterPopoverOpen(channel.providerId);
                        }}
                      />
                    </div>
                  </div>
                  <div className={cn(channel.filters.length ? 'mt-3' : '', 'rounded-lg')}>
                    <div className="flex flex-wrap gap-2">
                      {channel.filters
                        .filter(
                          (option) =>
                            option.value !== NexoyaContentFilterFieldName.ContentId &&
                            option.value !== NexoyaContentFilterFieldName.ParentContentId,
                        )
                        .map((option) => (
                          <FilterItem
                            key={option.id}
                            selectedOptions={channel.filters}
                            selectedOption={option}
                            setSelectedOptions={filtersDispatch}
                            defaultOpen={openFilterPopoverProviderId === channel.providerId}
                            setShouldFetch={() => {}}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
