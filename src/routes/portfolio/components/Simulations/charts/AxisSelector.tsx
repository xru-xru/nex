import React, { useEffect } from 'react';

import styled from 'styled-components';
import { StringParam, useQueryParams } from 'use-query-params';

import { NexoyaScenarioFunnelStep } from '../../../../../types';

import { AXIS_BUDGET_KEYWORD } from '../../../utils/simulation';

import MenuList from '../../../../../components/ArrayMenuList/ArrayMenuList';
import Button from '../../../../../components/Button';
import ButtonAdornment from '../../../../../components/ButtonAdornment';
import { useMenu } from '../../../../../components/Menu';
import MenuItem from '../../../../../components/MenuItem';
import Panel from '../../../../../components/Panel';
import Typography from '../../../../../components/Typography';
import SvgCaretDown from '../../../../../components/icons/CaretDown';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const StyledTypography = styled(Typography)`
  color: #8a8c9e;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: 0.44px;
  text-transform: uppercase;
`;

export const AxisSelector = ({
  options,
  targetFunnelStep,
}: {
  options: { title: string; id: string }[];
  targetFunnelStep: NexoyaScenarioFunnelStep;
}) => {
  const { anchorEl: xAxisAnchorEl, open: xAxisOpen, toggleMenu: xAxisToggle, closeMenu: xAxisClose } = useMenu();
  const { anchorEl: yAxisAnchorEl, open: yAxisOpen, toggleMenu: yAxisToggle, closeMenu: yAxisClose } = useMenu();
  const [queryParams, setQueryParams] = useQueryParams({
    xAxis: StringParam,
    yAxis: StringParam,
  });

  useEffect(() => {
    if (!queryParams.xAxis || !queryParams.yAxis) {
      setQueryParams({ xAxis: AXIS_BUDGET_KEYWORD, yAxis: targetFunnelStep?.funnelStep?.funnelStepId?.toString() });
    }
  }, [options]);

  const yAxisTitle = options?.find((c) => c?.id === queryParams.yAxis)?.title;
  const xAxisTitle = options?.find((c) => c?.id === queryParams.xAxis)?.title;
  return (
    <Container>
      <ButtonContainer>
        <StyledTypography>X-Axis Metric</StyledTypography>
        <Button
          ref={xAxisAnchorEl}
          onClick={xAxisToggle}
          variant="contained"
          color="secondary"
          size="small"
          style={{ maxWidth: 400 }}
          endAdornment={
            <ButtonAdornment position="end">
              <SvgCaretDown />
            </ButtonAdornment>
          }
        >
          {xAxisTitle}
        </Button>
      </ButtonContainer>
      <Panel
        container={xAxisAnchorEl.current}
        anchorEl={xAxisAnchorEl.current}
        open={xAxisOpen}
        onClose={xAxisClose}
        placement="bottom-end"
        style={{
          minWidth: 138,
          maxWidth: 400,
        }}
      >
        <MenuList color="dark">
          {options
            //  Don't show the selected axis in the dropdown
            ?.filter((option) => option?.id !== queryParams.yAxis && option?.id !== queryParams.xAxis)
            ?.map((option, idx) => (
              <MenuItem
                onClick={() => {
                  setQueryParams({ xAxis: option?.id });
                  xAxisClose();
                }}
                key={idx}
                color="dark"
              >
                {option?.title}
              </MenuItem>
            ))}
        </MenuList>
      </Panel>
      <ButtonContainer>
        <StyledTypography>Y-Axis Metric</StyledTypography>
        <Button
          ref={yAxisAnchorEl}
          onClick={yAxisToggle}
          variant="contained"
          color="secondary"
          size="small"
          style={{ maxWidth: 400 }}
          endAdornment={
            <ButtonAdornment position="end">
              <SvgCaretDown />
            </ButtonAdornment>
          }
        >
          {yAxisTitle}
        </Button>
      </ButtonContainer>
      <Panel
        container={yAxisAnchorEl.current}
        anchorEl={yAxisAnchorEl.current}
        open={yAxisOpen}
        onClose={yAxisClose}
        placement="bottom-end"
        style={{
          minWidth: 138,
          maxWidth: 400,
        }}
      >
        <MenuList color="dark">
          {options
            //  Don't show the selected axis in the dropdown
            ?.filter((option) => option?.id !== queryParams.yAxis && option?.id !== queryParams.xAxis)
            ?.map((option, idx) => (
              <MenuItem
                onClick={() => {
                  setQueryParams({ yAxis: option?.id });
                  yAxisClose();
                }}
                key={idx}
                color="dark"
              >
                {option?.title}
              </MenuItem>
            ))}
        </MenuList>
      </Panel>
    </Container>
  );
};
