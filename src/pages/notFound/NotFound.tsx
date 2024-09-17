import { useNavigate, useLocation } from 'react-router-dom';
import { AuthPropType, useAuth } from '../../components/authProvider/AuthProvider';
import { Button } from 'antd';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

import './NotFound.scss';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user }: AuthPropType = useAuth();

  const handleRedirect = () => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const isAdminPath = location.pathname.startsWith('/admin');
  const containerClass = isAdminPath ? 'adminPath' : 'defaultPath';

  return (
    <div className={`notFoundContainer ${containerClass}`}>
      <AiOutlineExclamationCircle className="icon" />
      <h1 className="title">404 - Page Not Found</h1>
      <p className="message">The page you are looking for does not exist.</p>
      <Button type="primary" size="large" onClick={handleRedirect}>
        Return to {user && user.role === 'admin' ? 'Admin Dashboard' : 'Home'}
      </Button>
    </div>
  );
};
