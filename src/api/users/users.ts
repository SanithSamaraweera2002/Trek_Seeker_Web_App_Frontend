import {
  AddUserInterface,
  UpdateUsersInterface,
  FetchUserByIdInterface,
  FetchUsersInterface,
} from '../../interfaces/usersInterface';
import { authenticatedRequest } from '../../utils/commonAxios';

export const getUsersAPIRequest = async (searchParams: FetchUsersInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/users?limit=${searchParams?.limit}&page=${searchParams?.page}`,
    'get',
    {
      data: {},
    }
  );
};

export const addUserAPIRequest = async (userData: AddUserInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/users`, 'post', {
    data: { ...userData?.userData },
  });
};

export const updateUserAPIRequest = async (userData: UpdateUsersInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/users/${userData?.userId}`, 'put', {
    data: { ...userData?.userData },
  });
};

export const getUserByIdAPIRequest = async (searchParams: FetchUserByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/users/${searchParams?.userId}`, 'get', {});
};

export const deleteUserAPIRequest = async (searchParams: FetchUserByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/users/${searchParams?.userId}`, 'delete', {});
};
