import { get } from 'lodash';
import styled from 'styled-components';

import { useTeamQuery } from '../../graphql/team/queryTeam';
import isCurrencyDatatype from '../../utils/isCurrencyDatatype';

import FormattedCurrency from '../FormattedCurrency';
import NumberValue from '../NumberValue';
import dayjs from 'dayjs';

const WrapStyled = styled.div`
  .cellhovered {
    background-color: #fafbff;
  }
`;
const DateHeaderCellStyled = styled.div`
  padding-top: 14px;
  color: #949394;
  font-size: 12px;
`;

const KpiReportTableCell = (props: any) => {
  const { data, columnIndex, rowIndex, style } = props;
  const teamQuery = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });
  const kpiData = get(data, 'kpisForTable', []) || [];
  const itemRow = get(kpiData, `[${rowIndex}].detail.data`, []);
  const item = get(itemRow, `${columnIndex}`, {});
  const isLastItem = rowIndex + 1 === kpiData.length;
  return (
    <WrapStyled>
      <div
        style={{
          ...style,
          height: 59,
          padding: '8px 24px',
          borderBottom: !isLastItem ? '1px solid #eee' : 'none',
        }}
        className={`cell--${columnIndex}`}
        onMouseEnter={() => {
          const cells = document.getElementsByClassName(`cell--${columnIndex}`);

          if (cells.length > 0) {
            // @ts-ignore
            for (const cell of cells) {
              cell.classList.add('cellhovered');
            }
          }
        }}
        onMouseLeave={() => {
          const cells = document.getElementsByClassName(`cell--${columnIndex}`);

          if (cells.length > 0) {
            // @ts-ignore
            for (const cell of cells) {
              cell.classList.remove('cellhovered');
            }
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
          }}
        >
          {rowIndex === 0 ? (
            <DateHeaderCellStyled>{dayjs(item.timestamp).format('D MMM')}</DateHeaderCellStyled>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isCurrencyDatatype(kpiData[rowIndex].datatype) ? (
                <FormattedCurrency amount={data.showTotals ? item.valueSumUp : item.value} />
              ) : (
                <NumberValue
                  value={data.showTotals ? item.valueSumUp : item.value}
                  datatype={kpiData[rowIndex].datatype}
                  arrowWithColor
                />
              )}
            </div>
          )}
        </div>
      </div>
    </WrapStyled>
  );
};

export default KpiReportTableCell;
