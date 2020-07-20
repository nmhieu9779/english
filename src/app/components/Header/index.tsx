/**
 *
 * Header
 *
 */
import React, { memo } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components/macro';

const { Header: HeaderAntd } = Layout;
interface Props {
  title: string;
}

export const Header = memo(({ title }: Props) => {
  return <StyledHeaderAntd>{title}</StyledHeaderAntd>;
});

const StyledHeaderAntd = styled(HeaderAntd)`
  color: white;
  font-weight: bold;
`;
