import { PieChartOutlined, TeamOutlined } from '@ant-design/icons';
import { CiGlobe } from 'react-icons/ci';
import { IoLocationOutline } from 'react-icons/io5';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';

export function SideMenu({ systemData }: any) {
  let location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(location.pathname);

  function getSideMenuItem(link: string, label: string, icon?: JSX.Element) {
    return (
      <Menu.Item key={'/' + link} icon={icon}>
        <Link to={'/' + link}>{label}</Link>
      </Menu.Item>
    );
  }

  return (
    <Sider
      breakpoint={'lg'}
      theme={'light'}
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="sideMenu"
    >
      <Menu theme="light" defaultSelectedKeys={[current]} mode="inline">
        {getSideMenuItem('admin', 'Dashboard', <PieChartOutlined />)}
        <Menu.SubMenu key="prospect-management" icon={<TeamOutlined />} title="User Management">
          {getSideMenuItem('admin/users', 'Users')}
          {getSideMenuItem('admin/travelers', 'Travelers')}
        </Menu.SubMenu>
        {getSideMenuItem('admin/cities', 'Cities', <CiGlobe />)}
        {getSideMenuItem('admin/destinations', 'Destinations', <IoLocationOutline />)}
      </Menu>
    </Sider>
  );
}
