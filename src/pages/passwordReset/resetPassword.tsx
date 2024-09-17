import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { Input, Button, Typography, Layout, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import {
  resetPasswordRequest,
  resetPasswordSelector,
  clearResetPasswordResponse,
} from '../../redux/slices/auth/resetPasswordSlice';

import '../login/LoginPage.scss';
import { MainHeader } from '../../components/header/MainHeader';

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { resetPasswordStatus, resetPasswordError } = useAppSelector(resetPasswordSelector);

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (resetPasswordStatus === 'SUCCESS') {
      message.success('Password reset successful. You can now log in with your new password.');
      navigate('/login');
      dispatch(clearResetPasswordResponse());
    } else if (resetPasswordStatus === 'FAILED') {
      message.error(resetPasswordError?.message);
      dispatch(clearResetPasswordResponse());
    }

    setLoading(false);
  }, [resetPasswordStatus]);

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Both fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    dispatch(resetPasswordRequest({ resetToken: token, newPassword }));
  };

  return (
    <Layout>
      <Header className="header">
        <MainHeader loginpage={true} />
      </Header>
      <Content className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Title level={2} className="login-title">
              Reset Password
            </Title>
            <Paragraph className="login-subtitle">Enter your new password below.</Paragraph>
          </div>
          <div className="login-form">
            <div className="login-form-item">
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="New Password"
                value={newPassword}
                size="large"
                onChange={(e) => setNewPassword(e.target.value)}
                status={error ? 'error' : ''}
              />
            </div>
            <div className="login-form-item">
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
                value={confirmPassword}
                size="large"
                onChange={(e) => setConfirmPassword(e.target.value)}
                status={error ? 'error' : ''}
              />
              {error && <div className="login-form-error">{error}</div>}
            </div>
            <Button type="primary" className="login-form-button" onClick={handlePasswordReset} loading={loading}>
              Reset Password
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
