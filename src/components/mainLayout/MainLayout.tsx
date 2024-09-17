import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { MainHeader } from '../header/MainHeader';
import { SideMenu } from '../sideMenu/sideMenu';
import { AdminHeader } from '../header/AdminHeader';

const { Header, Content, Sider } = Layout;

export const MainLayout = () => {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  const isHomePage = location.pathname === '/';
  const isAdminPanel = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (location.pathname === '/') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  return (
    <>
      {!isAdminPanel ? (
        <Layout>
          <Header className={`header ${isSticky ? 'sticky' : ''} ${isHomePage ? 'no-border' : ''}`}>
            <MainHeader />
          </Header>
          <Outlet />
        </Layout>
      ) : (
        <Layout>
          <Header className="admin-header">
            <AdminHeader />
          </Header>
          <Layout>
            <SideMenu />
            <Content className="admin-layout">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};
