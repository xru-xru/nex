import { get } from 'lodash';

import { useAddReportKpisMutation } from '../../../../graphql/report/mutationAddReportKpis';
import { useRemoveReportKpisMutation } from '../../../../graphql/report/mutationRemoveReportKpis';

import { KpisObjectMap } from './useKpiSelectionReducer';

type Options = {
  reportId: number;
  toAdd: KpisObjectMap;
  toRemove: KpisObjectMap;
  setLoading: (state: boolean) => void;
  onDone: () => void;
  onSuccess: () => void;
  channel: boolean;
};

function useSaveMutation({ reportId, toAdd, toRemove, setLoading, onDone, onSuccess, channel = false }: Options) {
  const [addReportKpis] = useAddReportKpisMutation({
    reportId,
  });
  const [removeReportKpis] = useRemoveReportKpisMutation({
    reportId,
  });
  return async function handleSave() {
    const toAddKeys = Object.keys(toAdd);
    const toRemoveKeys = Object.keys(toRemove);
    const all = [];

    if (toAddKeys.length === 0 && toRemoveKeys.length === 0) {
      return;
    }

    const toAddKpis = channel
      ? Object.values(toAdd).map((value) => ({
          collection_id: value.provider_id,
        }))
      : toAddKeys.map((key) => ({
          measurement_id: get(toAdd, `[${key}].measurement_id`, 0),
          collection_id: get(toAdd, `[${key}].collection.collection_id`, 0),
        }));
    const toRemoveKpis = channel
      ? Object.values(toRemove).map((value) => ({
          collection_id: value.provider_id,
        }))
      : toRemoveKeys.map((key) => ({
          measurement_id: get(toRemove, `[${key}].measurement_id`, 0),
          collection_id: get(toRemove, `[${key}].collection.collection_id`, 0),
        }));
    setLoading(true);

    try {
      if (toAddKeys.length) {
        all.push(
          //@ts-expect-error
          addReportKpis({
            variables: {
              report_id: reportId,
              kpis: toAddKpis,
            },
          })
        );
      }

      if (toRemoveKeys.length) {
        all.push(
          removeReportKpis({
            variables: {
              report_id: reportId,
              kpis: toRemoveKpis,
            },
          })
        );
      }

      const res = await Promise.all(all);

      if (
        res.some((r) => get(r, 'data.addReportKpis', false)) ||
        res.some((r) => get(r, 'data.removeReportKpis', false))
      ) {
        onSuccess();
        setLoading(false);
        onDone();
      } else {
        setLoading(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };
}

export { useSaveMutation };
