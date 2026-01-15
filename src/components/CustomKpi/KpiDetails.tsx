import { useNewCustomKpi } from '../../context/NewCustomKpiProvider';

import DialogContent from '../DialogContent';
import TextField from '../TextField';

function KpiDetails() {
  const { name, description, fieldChange } = useNewCustomKpi();
  return (
    <>
      <DialogContent>
        <p
          style={{
            marginBottom: 15,
          }}
        >
          Please, give your custom KPI a name so you can easily find it later.
        </p>
        <TextField
          placeholder="Enter the name for your KPI"
          value={name}
          label="Custom KPI Name*"
          name="name"
          id="name"
          onChange={fieldChange}
          required
          //@ts-ignore
          style={{
            width: '100%',
            margin: '25px 0',
          }}
        />

        <TextField
          placeholder="Enter some description for your KPI"
          value={description}
          type="textarea"
          rows={3}
          label="Description"
          name="description"
          id="description"
          onChange={fieldChange}
          //@ts-ignore
          style={{
            width: '100%',
            marginBottom: 25,
          }}
        />
      </DialogContent>
    </>
  );
}

export default KpiDetails;
