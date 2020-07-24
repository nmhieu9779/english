/**
 *
 * LeftMenu
 *
 */
import React, { memo, useState, useCallback, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';

const { Sider } = Layout;

const Menus = [
  {
    key: 'upload',
    Icon: CloudUploadOutlined,
  },
];

const Names = {
  upload: 'Upload',
};

interface Props {
  onChangeMenu: (value: string) => void;
  currentBreakpoint: string;
}

export const LeftMenu = memo((props: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedWidth, setCollapsedWidth]: [number?, any?] = useState(() =>
    props.currentBreakpoint === 'xs' ? 0 : undefined,
  );
  const [selectedKeys, setSelectedKeys] = useState(() => {
    const [{ key: selectedKey } = { key: '' }] = Menus;
    return [selectedKey];
  });

  const onMouseLeave = useCallback(() => {
    if (collapsed) return;
    setCollapsed(true);
  }, [collapsed]);

  const onMouseOver = useCallback(() => {
    if (!collapsed) return;
    setCollapsed(false);
  }, [collapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (collapsedWidth === undefined && window.innerWidth <= 576) {
        setCollapsedWidth(0);
      }
      if (collapsedWidth === 0 && window.innerWidth > 576) {
        setCollapsedWidth(undefined);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const onSelect = useCallback(({ keyPath }) => {
    setSelectedKeys([...keyPath]);
  }, []);

  useEffect(() => {
    props.onChangeMenu(Names[selectedKeys[0]]);
  }, [props, selectedKeys]);

  return (
    <Sider
      breakpoint={'sm'}
      collapsedWidth={collapsedWidth}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      collapsed={collapsed}
    >
      <Menu selectedKeys={selectedKeys} onSelect={onSelect}>
        {Menus.map(({ key, Icon }) => (
          <ItemMenu collapsed={collapsed ? 1 : 0} key={key}>
            {collapsed ? <Icon /> : Names[key]}
          </ItemMenu>
        ))}
      </Menu>
    </Sider>
  );
});

const ItemMenu = styled(Menu.Item)<{ collapsed: number }>`
  text-align: ${({ collapsed }) => (collapsed ? 'center' : 'left')};
`;
