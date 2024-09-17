import axios from 'axios';
import { LoginPageInterface, resetPasswordInterface } from '../../interfaces/logininterface';

export const loginAPIRequest = (userCredentials: LoginPageInterface) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/login`, userCredentials);
};

export const forgotPasswordAPIRequest = (email: string) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/forgot-password`, { Email: email });
};

export const resetPasswordAPIRequest = (resetData: resetPasswordInterface) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, resetData);
};
