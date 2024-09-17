export interface LoginPageInterface {
  email: string;
  password: string;
}

export interface LoginPagePropsInterface {
  LoginLoading: boolean;
  LoginUserInfo: any;
  LoginError: any;
  LoginStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}
export interface forgotPasswordPropsInterface {
  forgotPasswordLoading: boolean;
  forgotPasswordInfo: any;
  forgotPasswordError: any;
  forgotPasswordStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface resetPasswordInterface {
  resetToken: string;
  newPassword: string;
}
export interface resetPasswordPropsInterface {
  resetPasswordLoading: boolean;
  resetPasswordInfo: any;
  resetPasswordError: any;
  resetPasswordStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}
