import { get } from 'lodash';
import _omit from 'lodash/omit';
import styled from 'styled-components';

import { NexoyaCustomKpi, NexoyaMeasurement } from '../../types/types';
import DOMPurify from 'dompurify';

import useCustomKpiMetaController from '../../controllers/CustomKpiMetaController';
import { useUpdateCustomKpiMutation } from '../../graphql/kpi/mutationUpdateCustomKpi';

import { customKpiInputArr } from '../../utils/kpi';
import FormControlLabel from '../FormControlLabel';
import Radio from '../Radio';
import RadioGroup from '../RadioGroup';
import SidePanel from '../SidePanel';
import Text from '../Text';
import TextField from '../TextField';
import ButtonAsync from '../ButtonAsync';
import { toast } from 'sonner';

type Props = {
  kpi: NexoyaMeasurement;
  isEditPanelOpen?: boolean;
  closeEditPanel?: (arg0: boolean) => void;
};
const inputTypeConfig = {
  inputs: [
    {
      placeholder: 'Enter the name for your KPI',
      label: 'Custom KPI Name',
      name: 'name',
      id: 'name',
      style: {
        width: '100%',
        margin: '25px 0',
      },
    },
    {
      placeholder: 'Enter some description for your KPI',
      type: 'textarea',
      rows: 3,
      label: 'Description',
      name: 'description',
      id: 'description',
      style: {
        width: '100%',
        marginBottom: 25,
      },
    },
  ],
  radios: [
    {
      value: 'sum',
      label: 'Sum',
      name: 'calcType',
    },
    {
      value: 'avg',
      label: 'Average',
      name: 'calcType',
    },
    {
      value: 'max',
      label: 'Max',
      name: 'calcType',
    },
    {
      value: 'min',
      label: 'Min',
      name: 'calcType',
    },
    {
      value: 'mul',
      label: 'Mul',
      name: 'calcType',
    },
    {
      value: 'div',
      label: 'Div',
      name: 'calcType',
    },
  ],
};
const SidePanelContentStyled = styled.div`
  width: 600px;
  padding: 24px;
`;
const TextStyled = styled(Text)`
  font-size: 23px;
  line-height: 32px;
  letter-spacing: 0.4px;
`;
const RadioGroupStyled = styled(RadioGroup)`
  display: flex;
  flex-wrap: wrap;
`;
const FormControlLabelStyled = styled(FormControlLabel)`
  flex: 0 0 50%;
  margin-bottom: 10px;
`;
const ButtonWrapperStyled = styled.div`
  background: #fafbff;
  padding: 28px 32px 20px 32px;
  margin-top: auto;
  display: flex;
  justify-content: space-around;
`;

function EditCustomKpiMeta({ kpi, isEditPanelOpen = false, closeEditPanel = () => null }: Props) {
  const customKpiConfig: NexoyaCustomKpi = get(kpi, 'customKpiConfig', null);
  const { customKpiMeta, handleCustomKpiMetaInputChange } = useCustomKpiMetaController({
    name: customKpiConfig?.name,
    description: customKpiConfig?.description || '',
    calcType: customKpiConfig?.calc_type,
  });
  const includeSearch = !!customKpiConfig?.search;
  // @ts-ignore
  const [updateCustomKpi, { loading }] = useUpdateCustomKpiMutation({
    custom_kpi_id: customKpiConfig?.custom_kpi_id,
    name: DOMPurify.sanitize(customKpiMeta.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(customKpiMeta.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    kpis: !includeSearch ? customKpiInputArr(customKpiConfig?.kpis, customKpiConfig) : undefined,
    search: includeSearch ? _omit(customKpiConfig?.search, '__typename') : undefined,
    calc_type: customKpiMeta.calcType,
    collectionId: get(kpi, 'collection.collection_id', null),
    measurementId: get(kpi, 'measurement_id', null),
  });

  async function handleSubmit() {
    try {
      //@ts-ignore
      const res = await updateCustomKpi();

      if (get(res, 'data.updateCustomKpi', null)) {
        toast.success('Custom KPI updated successfully');
        closeEditPanel(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      toast.error('Error updating custom KPI');
    }
  }

  return (
    <SidePanel isOpen={isEditPanelOpen} onClose={() => closeEditPanel(false)}>
      <SidePanelContentStyled>
        <TextStyled data-cy="panelTitle">Edit custom KPI</TextStyled>
        {inputTypeConfig.inputs.map((inputItem, index) => (
          <TextField
            key={`key-${inputItem.name}-${index}`}
            type={inputItem.type || 'input'}
            rows={inputItem.rows || null}
            placeholder={inputItem.placeholder}
            label={inputItem.label}
            name={inputItem.name}
            value={customKpiMeta[inputItem.name]}
            id={inputItem.id}
            style={inputItem.style}
            onChange={handleCustomKpiMetaInputChange}
          />
        ))}
        <RadioGroupStyled>
          {inputTypeConfig.radios.map((radioItem, index) => (
            <FormControlLabelStyled
              key={`key-${radioItem.name}-${index}`}
              checked={customKpiMeta.calcType === radioItem.value}
              onChange={handleCustomKpiMetaInputChange}
              value={radioItem.value}
              name={radioItem.name}
              label={radioItem.label}
              control={
                <Radio
                  inputProps={{
                    'aria-label': 'A',
                  }}
                />
              }
              data-cy={radioItem.value}
            />
          ))}
        </RadioGroupStyled>
      </SidePanelContentStyled>
      <ButtonWrapperStyled>
        <ButtonAsync
          id="discard"
          loading={loading}
          disabled={loading}
          variant="contained"
          onClick={() => closeEditPanel(false)}
        >
          Discard changes
        </ButtonAsync>
        <ButtonAsync
          loading={loading}
          disabled={loading}
          id="save"
          color="primary"
          variant="contained"
          onClick={handleSubmit}
        >
          Save changes
        </ButtonAsync>
      </ButtonWrapperStyled>
    </SidePanel>
  );
}

export default EditCustomKpiMeta;
