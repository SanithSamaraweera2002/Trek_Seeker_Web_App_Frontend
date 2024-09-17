import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/localStorageHook';
import { useAppDispatch } from '../../hooks/storeHooks/hooks';
import { clearLoginResponse } from '../../redux/slices/auth/authSlice';

const AuthContext = createContext({});

export type AuthPropType = {
  login?(loginResponse: any): {};
  user?: {
    access_token: string;
    expires_in: number;
    'not-before-policy': number;
    refresh_expires_in: number;
    refresh_token: string;
    firstname: string;
    role: string;
    username: string;
    email: string;
    id: number;
    session_state: string;
    token_type: string;
  };
  logout?(): {};
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const login = async (data: any) => {
    if (data) {
      setUser(data);
      //   console.log('data', data);
    }
  };

  const logout = () => {
    dispatch(clearLoginResponse());
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
