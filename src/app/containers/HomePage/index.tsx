/**
 *
 * HomePage
 *
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectHomePage } from './selectors';
import { homePageSaga } from './saga';
import { LeftMenu } from '../../components/LeftMenu/Loadable';
import { Header } from '../../components/Header/Loadable';
import { Upload } from '../../components/Upload/Loadable';
import { Layout } from 'antd';
import { breakpoint } from '../../../helpers';

const { Content } = Layout;
const { getCurrentBreakpoint } = breakpoint;

interface Props {}

export const HomePage = memo((props: Props) => {
  const [title, setTitle] = useState('');
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    getCurrentBreakpoint(window),
  );

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint(window);
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: homePageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const homePage = useSelector(selectHomePage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const onChangeMenu = useCallback(name => {
    setTitle(name);
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>{'HomePage'}</title>
        <meta name="description" content="Description of HomePage" />
      </Helmet>
      <StyledLayout>
        <Header title={title} />
        <Layout>
          <LeftMenu
            currentBreakpoint={currentBreakpoint}
            onChangeMenu={onChangeMenu}
          />
          <Content>
            <Upload currentBreakpoint={currentBreakpoint} />
          </Content>
        </Layout>
      </StyledLayout>
    </React.Fragment>
  );
});

const StyledLayout = styled(Layout)`
  height: 100vh;
`;
