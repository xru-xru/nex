import { useTeam } from 'context/TeamProvider';
import { Currency, useCurrencyStore } from 'store/currency-selection';
import { Button } from 'components-ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components-ui/DropdownMenu';

export const CurrencySelector = () => {
  const { teamId } = useTeam();
  const { setCurrencyOverride } = useCurrencyStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="rounded-full" variant="secondary" size="sm">
          Currency selector
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 font-normal" align="start">
        {Object.values(Currency).map((currency) => (
          <DropdownMenuItem key={currency} onSelect={() => setCurrencyOverride(teamId, currency)}>
            {currency}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
