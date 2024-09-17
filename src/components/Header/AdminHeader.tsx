import { useNavigate, Link } from 'react-router-dom';

import { Button, Switch } from 'antd';
import { LogoutOutlined, SwapOutlined } from '@ant-design/icons';
import { AuthPropType, useAuth } from '../authProvider/AuthProvider';

export const AdminHeader = () => {
  const { logout }: AuthPropType = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout && logout();
    console.log('Logout clicked');
  };

  const handleToggleView = () => {
    navigate('/');
  };

  return (
    <div className="admin-header">
      <Link to="/admin">
        <strong className="admin-header-title">Trek Seeker</strong>
      </Link>

      <div>
        <Button type="primary" icon={<SwapOutlined />} onClick={handleToggleView} style={{ marginRight: '10px' }}>
          Switch View
        </Button>
        <Button type="default" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};
