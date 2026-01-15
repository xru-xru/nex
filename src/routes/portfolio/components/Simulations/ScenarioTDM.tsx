import React from 'react';

import { toast } from 'sonner';

import { useChangeBaseScenarioMutation } from '../../../../graphql/simulation/mutationChangeBaseScenario';

import ButtonIcon from 'components/ButtonIcon';
import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';

interface Props {
  scenarioId: number;
  simulationId: number;
  portfolioId: number;
  scenarioIdx: number;
  isBaseScenario?: boolean;
}

export function ScenarioTDM({ scenarioId, simulationId, portfolioId, scenarioIdx, isBaseScenario }: Props) {
  const { changeBaseScenario, loading: changeBaseScenarioLoading } = useChangeBaseScenarioMutation({
    portfolioId,
    simulationId,
    scenarioId,
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuOpenChange = (nextOpenState: boolean) => {
    if (changeBaseScenarioLoading) {
      return;
    }

    setIsMenuOpen(nextOpenState);
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
      <DropdownMenuTrigger asChild disabled={changeBaseScenarioLoading}>
        <ButtonIcon
          disabled={changeBaseScenarioLoading}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
          }}
          className="static"
        >
          {changeBaseScenarioLoading ? (
            <div className="w-[36px] p-[9px]">
              <Spinner size="20px" />
            </div>
          ) : (
            <SvgEllipsisV style={{ fontSize: 18 }} />
          )}
        </ButtonIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 font-normal">
        <DropdownMenuItem
          disabled={isBaseScenario}
          onSelect={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsMenuOpen(false);

            try {
              await changeBaseScenario();
              toast.success(`Scenario ${scenarioIdx} set as base`);
            } catch (err) {
              toast.error(`There was an error when setting Scenario ${scenarioIdx} as base`);
            }
          }}
        >
          Make base scenario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
