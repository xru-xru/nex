import React, { PureComponent, ReactNode, createContext } from 'react';

import { NexoyaMeasurement } from '../../../types/types';
import '../../../types/types';

import { equalKpis } from '../../../utils/kpi';

type AddSelectionFn = (selection: NexoyaMeasurement[]) => void;
type RemoveSelectionFn = (selection: NexoyaMeasurement[]) => void;
type ResetSelectionFn = () => void;
type KPIsSelectionCtx = {
  addSelection: AddSelectionFn;
  kpisSelected: NexoyaMeasurement[];
  removeSelection: RemoveSelectionFn;
  resetSelection: ResetSelectionFn;
};
type Props = {
  children: ReactNode;
};
const KPIsSelectionContext = createContext<Record<string, any>>({
  addSelection: (): void => {},
  kpisSelected: [],
  removeSelection: (): void => {},

  resetSelection() {},
});

class KPIsProvider extends PureComponent<Props, KPIsSelectionCtx> {
  state = {
    // Comment: used to cache necessary data to keep in the KPI selection drawer
    kpisSelected: [],
    // Comment: used to add the selections to the selected list
    addSelection: (selection: NexoyaMeasurement[]): void => {
      const { kpisSelected } = this.state;
      let nextKpisSelected = [...kpisSelected, ...selection];

      if (selection.length > 1) {
        nextKpisSelected = selection.reduce(
          (prev, next) => {
            const alreadySelected = kpisSelected.some((k) => equalKpis(k, next));

            if (!alreadySelected) {
              prev.push(next);
            }

            return prev;
          },
          [...kpisSelected]
        );
      }

      this.setState(() => ({
        kpisSelected: nextKpisSelected,
      }));
    },
    // Comment: used to remove selections from the selected list
    removeSelection: (selection: NexoyaMeasurement[]): void => {
      const nextKpis = this.state.kpisSelected.filter((stateKpi) => {
        const askedToBeRemoved = selection.some((s) => equalKpis(s, stateKpi));
        return !askedToBeRemoved;
      });
      this.setState(() => ({
        kpisSelected: nextKpis,
      }));
    },
    // Comment: used to reset the whole selection to default state
    resetSelection: (): void => {
      this.setState(() => ({
        kpisSelected: [],
      }));
    },
  };

  render() {
    return <KPIsSelectionContext.Provider value={this.state}>{this.props.children}</KPIsSelectionContext.Provider>;
  }
}

function useKPIsSelection() {
  const context = React.useContext(KPIsSelectionContext);

  if (context === undefined) {
    throw new Error('useKPIsSelection must be used within KPIsSlectionProvider');
  }

  return context;
}

export default KPIsProvider;
export { KPIsSelectionContext, useKPIsSelection };
export type { AddSelectionFn, RemoveSelectionFn, ResetSelectionFn };
