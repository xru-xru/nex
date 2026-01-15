import React from 'react';
import { Link } from 'react-router-dom';

import { NexoyaCollectionEdges } from 'types';

import isCurrencyDatatype from 'utils/isCurrencyDatatype';

import Collapse from 'components/Collapse';
import FormattedCurrency from 'components/FormattedCurrency';
import NameTranslation from 'components/NameTranslation';
import NumberValue from 'components/NumberValue';
import TypographyTranslation from 'components/TypographyTranslation';
import SvgChevronDown from 'components/icons/ChevronDown';
import { buildContentPath, buildKpiPath } from 'routes/paths';

import * as Styles from './styles/ContentPageTableRow';

type Props = {
  data: NexoyaCollectionEdges;
};

function ContentPageTableRow({ data }: Props) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <>
      <Styles.GridRowStyled>
        <Styles.NameLink to={buildContentPath(data.node?.collection_id)}>
          <NameTranslation withEllipsis text={data.node?.title} />
        </Styles.NameLink>
        <div>
          <Styles.ChevronWrap expanded={expanded} onClick={() => setExpanded((s) => !s)}>
            <SvgChevronDown />
          </Styles.ChevronWrap>
        </div>
      </Styles.GridRowStyled>
      <Collapse in={expanded}>
        {data?.node?.measurements.map((measurement) => (
          <Styles.GridRowStyled child key={measurement.measurement_id}>
            <Link
              to={buildKpiPath(
                {
                  measurement_id: measurement.measurement_id,
                  collection_id: data.node?.collection_id,
                },
                {}
              )}
            >
              <TypographyTranslation text={measurement.name} />
            </Link>
            <Styles.ValueStyled>
              {isCurrencyDatatype(measurement.datatype) ? (
                <FormattedCurrency amount={measurement.detail?.value} />
              ) : (
                <NumberValue justify="center" value={measurement.detail?.value} datatype={measurement.datatype} />
              )}
              <Styles.NumberValueStyled value={measurement.detail?.valueChangePercentage} textWithColor symbol="%" />
            </Styles.ValueStyled>
          </Styles.GridRowStyled>
        ))}
      </Collapse>
    </>
  );
}

export default ContentPageTableRow;
