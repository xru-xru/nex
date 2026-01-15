import React, { PureComponent, createContext } from 'react';
import { Location, withRouter } from 'react-router-dom';

import { track } from '../../../constants/datadog';

type FilterProviderType = number;
type FilterMeasurementType = {
  id: number;
  title: string;
  providerName: string;
};
type FilterCollectionType = {
  id: number;
  title: string;
};
type AddFilterCollectionFn = (collection: FilterCollectionType) => void;
type AddFilterProviderFn = (id: number) => void;
type AddFilterMeasurementFn = (measurement: FilterMeasurementType) => void;
type OnFilterSumToggleFn = () => void;
type RemoveFilterCollectionFn = (collectionId: number) => void;
type RemoveFilterProviderFn = (providerId: FilterProviderType) => void;
type RemoveFilterMeasurementFn = (measurementId: number) => void;
type SetFilterSearchFn = (value: string) => void;
type FilterSearchType = string;
type FilterSumType = boolean;
type KPIsFilterCtx = {
  addFilterCollection: AddFilterCollectionFn;
  addFilterMeasurement: AddFilterMeasurementFn;
  addFilterProvider: AddFilterProviderFn;
  filterCollections: FilterCollectionType[];
  filterMeasurements: FilterMeasurementType[];
  filterProviders: FilterProviderType[];
  onSumFilterToggle: OnFilterSumToggleFn;
  removeFilterCollection: RemoveFilterCollectionFn;
  removeFilterMeasurement: RemoveFilterMeasurementFn;
  removeFilterProvider: RemoveFilterProviderFn;
  search: FilterSearchType;
  setSearch: SetFilterSearchFn;
  sumFilterActive: FilterSumType;
};
type Props = {
  children: React.ReactNode;
  location: Location;
};
const KPIsFilterContext = createContext<Record<string, any>>({
  addFilterCollection: (): void => {},
  addFilterMeasurement: (): void => {},
  addFilterProvider: (): void => {},
  filterCollections: [],
  filterMeasurement: [],
  filterProviders: [],

  onSumFilterToggle() {},

  removeFilterCollection: (): void => {},
  removeFilterMeasurement: (): void => {},
  removeFilterProvider: (): void => {},
  search: '',
  setSearch: (): void => {},
  sumFilterActive: false,
});

class KPIsProvider extends PureComponent<Props, KPIsFilterCtx> {
  date = Date.now();
  state = {
    // Comment: used for the query search coming from debounce search input
    search: '',
    // Comment: used for list of collections DATA used to filter query and show in UI
    filterCollections: [],
    // Comment: used for list of measurements DATA used to filter query and show in UI
    filterMeasurements: [],
    // Comment: used for list of provider IDs used to filter query and show in UI
    filterProviders: [],
    // Comment: used to activate or deactivate sum filter for the query
    sumFilterActive: false,
    // Comment: used for adding an ID to a list of provider filters and used in query and show in UI
    addFilterProvider: (providerId: FilterProviderType): void => {
      this.setState((state) => ({
        filterProviders: [...state.filterProviders, providerId],
      }));
    },
    // Comment: remove from the filter providers
    removeFilterProvider: (providerId: FilterProviderType): void => {
      const nextFilterProviders = this.state.filterProviders.filter((p) => p !== providerId);
      this.setState({
        filterProviders: nextFilterProviders,
      });
    },
    // Comment: used to add a collection to the filter for the query and to show in the UI. We need the ID as well as the title.
    addFilterCollection: (collection: FilterCollectionType): void => {
      this.setState((state) => ({
        filterCollections: [...state.filterCollections, collection],
      }));
    },
    // Comment: remove from the filter collections
    removeFilterCollection: (collectionId: number): void => {
      const nextFilterCollections = this.state.filterCollections.filter((c) => c.id !== collectionId);
      this.setState({
        filterCollections: nextFilterCollections,
      });
    },
    // Comment: used for adding an ID to a list of measurements filters and used in query and show in UI
    addFilterMeasurement: (measurement: FilterMeasurementType): void => {
      this.setState((state) => ({
        filterMeasurements: [...state.filterMeasurements, measurement],
      }));
    },
    // Comment: remove from the filter measuremnts
    removeFilterMeasurement: (measurementId: number): void => {
      const nextFilterMeasurements = this.state.filterMeasurements.filter((m) => m.id !== measurementId);
      this.setState({
        filterMeasurements: nextFilterMeasurements,
      });
    },
    // Comment: Toggling sum filter.
    onSumFilterToggle: () =>
      this.setState((state) => ({
        sumFilterActive: !state.sumFilterActive,
      })),
    // Comment: used to set the debounce search value for the apollo query.
    setSearch: (value: FilterSearchType): void =>
      this.setState({
        search: value,
      }),
  };

  render() {
    return (
      <KPIsFilterContext.Provider
        value={{
          ...this.state,
          setSearch: track('kpis word search', this.state.setSearch),
          onSumFilterToggle: track('kpis toggle sum filter', this.state.onSumFilterToggle),
          addFilterProvider: track('kpis add provider filter', this.state.addFilterProvider),
          ...this.props,
        }}
      >
        {this.props.children}
      </KPIsFilterContext.Provider>
    );
  }
}

function useKPIsFilter() {
  const context = React.useContext(KPIsFilterContext);

  if (context === undefined) {
    throw new Error(`useKPIsFilter must be used with KPIsFilterProvider`);
  }

  return context;
}

export default withRouter(KPIsProvider);
export { KPIsFilterContext, useKPIsFilter };
export type { FilterProviderType, FilterCollectionType, FilterSearchType, FilterSumType, FilterMeasurementType };
