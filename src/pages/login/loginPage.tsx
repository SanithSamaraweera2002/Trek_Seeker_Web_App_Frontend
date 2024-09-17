import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { Input, Button, Typography, Divider, Layout, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { FaMapPin } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import logo from '../../assets/images/logo.png';

import { loginUserRequest, loginSelector, clearLoginResponse } from '../../redux/slices/auth/authSlice';
import { getTravelerByIdRequest } from '../../redux/slices/travelers/getTravelerByIdSlice';
import { AuthPropType, useAuth } from '../../components/authProvider/AuthProvider';

import './LoginPage.scss';
import { MainHeader } from '../../components/header/MainHeader';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

export const Login = () => {
  const { login, user }: AuthPropType = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { LoginStatus, LoginUserInfo, LoginError } = useAppSelector(loginSelector);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (LoginStatus === 'SUCCESS') {
      if (login) {
        login(LoginUserInfo);
      }
      setEmail('');
      setPassword('');
    } else if (LoginStatus === 'FAILED') {
      error();
    }
    dispatch(clearLoginResponse());
  }, [LoginStatus]);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'traveler') {
      dispatch(getTravelerByIdRequest({ travelerId: user.id }));
      navigate('/trips');
    }
  }, [user]);

  console.log('user', user?.role);

  // const handleLogin = () => {
  //   if (email && password) {
  //     const credentialsObj = { Email: email, Password: password };
  //     dispatch(loginUserRequest(credentialsObj));
  //   }
  // };
  const handleLogin = () => {
    let hasError = false;
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const credentialsObj = { Email: email, Password: password };
    dispatch(loginUserRequest(credentialsObj));
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: LoginError?.message,
    });
  };

  const userData = JSON.parse(localStorage.getItem('user') as string);

  console.log('user Data', userData);
  console.log('Login Error', LoginError);
  return (
    <Layout>
      <Header className="header">
        <MainHeader loginpage={true} />
      </Header>
      {contextHolder}
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <FaMapLocationDot className="login-icon" />
            <Title level={2} className="login-title">
              Sign In
            </Title>
            <Paragraph className="login-subtitle">Sign in to create & access your trips</Paragraph>
          </div>
          <div className="login-form">
            <div className="login-form-item">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                value={email}
                size="large"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                }}
                // Add validation error styling
                status={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="login-form-error">{errors.email}</div>}
            </div>
            <div className="login-form-item">
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                }}
                // Add validation error styling
                status={errors.password ? 'error' : ''}
              />
              {errors.password && <div className="login-form-error">{errors.password}</div>}
            </div>
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <Button type="primary" className="login-form-button" onClick={handleLogin}>
              Sign in
            </Button>
            <Divider />
            <div className="register-link">
              Don't have an account?{' '}
              <a
                onClick={() => {
                  navigate('/register');
                }}
              >
                register now!
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
