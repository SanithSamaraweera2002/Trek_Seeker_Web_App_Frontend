import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { Input, Button, Typography, Layout, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import {
  forgotPasswordRequest,
  forgotPasswordSelector,
  clearForgotPasswordResponse,
} from '../../redux/slices/auth/forgotPasswordSlice';

import '../login/LoginPage.scss';
import { MainHeader } from '../../components/header/MainHeader';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

export const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { forgotPasswordStatus, forgotPasswordError, forgotPasswordInfo } = useAppSelector(forgotPasswordSelector);

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (forgotPasswordStatus === 'SUCCESS') {
      message.info('Password Reset Email Sent. Please check your inbox');
      setEmail('');
      dispatch(clearForgotPasswordResponse());
    } else if (forgotPasswordStatus === 'FAILED') {
      message.error(forgotPasswordError?.message);
      dispatch(clearForgotPasswordResponse());
    }

    setLoading(false);
  }, [forgotPasswordStatus]);

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setError('');
    setLoading(true);

    dispatch(forgotPasswordRequest(email));
  };

  return (
    <Layout>
      <Header className="header">
        <MainHeader loginpage={true} />
      </Header>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Title level={2} className="login-title">
              Forgot Password
            </Title>
            <Paragraph className="login-subtitle">
              {' '}
              Enter your email to receive a password reset link to the email you've registered with us.
            </Paragraph>
          </div>
          <div className="login-form">
            <div className="login-form-item">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                value={email}
                size="large"
                onChange={(e) => setEmail(e.target.value)}
                status={error ? 'error' : ''}
              />
              {error && <div className="login-form-error">{error}</div>}
            </div>
            <Button type="primary" className="login-form-button" onClick={handlePasswordReset} loading={loading}>
              Send Reset Link
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
