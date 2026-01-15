import styled from 'styled-components';

const sharedTypography = `
  text-align: center;
  line-height: 145%;
`;

export const CalendarCard = styled.div`
  display: flex;
  min-width: 55px;
  padding: 6px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: -8px;
  border-radius: 5px;
  border: 1px solid #eaeaea;
  background: #fff;
`;

export const CalendarMonth = styled.div`
  ${sharedTypography};
  color: #e86b71;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.48px;
  text-transform: uppercase;
`;

export const CalendarDay = styled.div`
  ${sharedTypography};
  color: #131314;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1.04px;
`;
