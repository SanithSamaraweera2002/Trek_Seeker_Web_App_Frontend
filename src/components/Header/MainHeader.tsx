import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/storeHooks/hooks';
import { Menu, Dropdown, Avatar, Button } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/localStorageHook';
import { AuthPropType, useAuth } from '../authProvider/AuthProvider';
import { useAppSelector } from '../../hooks/storeHooks/hooks';

import {
  getTravelerSelector,
  getTravelerByIdRequest,
  clearGetTravelerByIdResponse,
} from '../../redux/slices/travelers/getTravelerByIdSlice';

import { MdLogout, MdOutlineArrowDropDown, MdOutlineMenu, MdOutlinePersonOutline } from 'react-icons/md';
import { UserOutlined, SwapOutlined } from '@ant-design/icons';
import { IoAirplane } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

import logo from '../../assets/images/logo.png';

export const MainHeader = ({ loginpage }: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, logout }: AuthPropType = useAuth();
  const { fetchTravelerByIdData, fetchTravelerByIdStatus } = useAppSelector(getTravelerSelector);

  // const [user, setUser] = useState<any>({});
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // useEffect(() => {
  //   const user = localStorage.getItem('user');
  //   setUser(user);
  //   setIsAuthenticated(!!user);
  // }, []);

  // const [user, setUser] = useLocalStorage('user', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (fetchTravelerByIdStatus === 'IDLE') {
      dispatch(getTravelerByIdRequest({ travelerId: user?.id }));
    } else if (fetchTravelerByIdStatus === 'SUCCESS') {
      setUserName(fetchTravelerByIdData?.FirstName);
    }
  }, [fetchTravelerByIdStatus]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const handleToggleView = () => {
    navigate('/admin');
  };

  // console.log('Status', fetchTravelerByIdStatus);
  // console.log('AuthContext:', user);

  // const localStorageUser = window.localStorage.getItem('user');
  // console.log('localStorage:', localStorageUser ? JSON.parse(localStorageUser) : null);

  const menu = (
    <Menu className="dropdown-menu">
      <Menu.Item key="0">
        {/* <a href="/trips">
          <IoAirplane />
          Trips
        </a> */}
        <Link to="/trips">
          <IoAirplane />
          Trips
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        {/* <a href="/profile">
          <FaUser />
          Profile
        </a> */}
        <Link to="/profile">
          <FaUser />
          Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <a onClick={logout}>
          <FiLogOut />
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

  // console.log('User', user);

  return (
    <>
      {/* <img
        // onClick={() => {
        //   navigate('/dashboard');
        // }}
        className="logo"
        src={logo}
        alt="Logo"
      /> */}
      <div>
        {' '}
        <Link to="/">
          <strong className="header-title">Trek Seeker</strong>
        </Link>
      </div>
      <div className="header_menu_area">
        <Menu mode="horizontal" overflowedIndicator={<MdOutlineMenu size={18} />}>
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/currency-conversion">Currency Conversion</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/weather-info">Weather Information</Link>
          </Menu.Item>
          {/* {!loginpage && (
            <Menu.Item>
              <Link to="/new-trip">Create a trip</Link>
            </Menu.Item>
          )} */}
          <Menu.Item>
            <Link to="/new-trip">Create a trip</Link>
          </Menu.Item>
        </Menu>
        <div className="profile_btn_area">
          {/* <Dropdown className="profile_btn" overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link">
              <Avatar size="large" className="avatarImage" icon={<UserOutlined />} />
              <span className="sp_hide">Sanith</span>
              <MdOutlineArrowDropDown />
            </a>
          </Dropdown> */}
          {isAuthenticated ? (
            user && user?.role === 'admin' ? (
              <Button type="primary" icon={<SwapOutlined />} onClick={handleToggleView} style={{ marginRight: '10px' }}>
                Switch To Dashboard
              </Button>
            ) : (
              <Dropdown className="profile_btn" overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link">
                  <Avatar size="large" className="avatarImage" icon={<UserOutlined className="avatar-icon" />} />
                  <span className="profile-name">{userName || 'User'}</span>
                  <MdOutlineArrowDropDown className="profile-btn-arrow" />
                </a>
              </Dropdown>
            )
          ) : (
            <div>
              <Button type="primary">
                <Link to="/login">Sign In</Link>
              </Button>
              {/* <Button type="primary">
                <Link to="/register">Sign Up</Link>
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
