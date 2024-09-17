import { Outlet, Navigate } from 'react-router-dom';
import { MainHeader } from '../header/MainHeader';
import { AuthPropType, useAuth } from '../authProvider/AuthProvider';

export const PrivateRoutes = ({ allowedRoles }: any) => {
  const { user }: AuthPropType = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'traveler') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;

  // return (
  //   <>
  //     {/* <MainHeader /> */}
  //     <Outlet />
  //   </>
  // );
};
