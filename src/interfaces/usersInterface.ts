export interface AddUserInterface {
  userData: any;
}

export interface AddUserPropsInterface {
  addUserLoading?: boolean;
  addUserData?: any;
  addUserStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  addUserError?: any;
}

export interface FetchUsersInterface {
  limit?: number;
  page?: number;
}

export interface FetchUsersPropsInterface {
  getUsersLoading: boolean;
  getUsersData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  getUsersError: any;
  getUsersStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface UpdateUsersInterface {
  userId?: number;
  userData?: any;
}

export interface UpdateUsersPropsInterface {
  editUsersLoading: boolean;
  editUsersData: any;
  editUsersError: any;
  editUsersStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface FetchUserByIdInterface {
  userId: number;
}

export interface FetchUserByIdPropsInterface {
  fetchUserByIdLoading?: boolean;
  fetchUserByIdData?: any;
  fetchUserByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  fetchUserByIdError?: any;
}

export interface DeleteUserPropsInterface {
  deleteUserLoading?: boolean;
  deleteUserData?: any;
  deleteUserStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  deleteUserError?: any;
}
