import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export function GetToken() {
  const userData = JSON.parse(localStorage.getItem('user') as string);
  return userData;
}

export async function authenticatedRequest<T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  config?: AxiosRequestConfig,
  retryCount: number = 3
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.request<T>({
      method,
      url,
      headers: {
        Authorization: `Bearer ${GetToken().token}`,
        ContentType: 'application/json',
        ...config?.headers,
      },
      ...config,
    });
    return response?.data;
    // @ts-ignore
  } catch (error: AxiosError) {
    if (error.response && error.response.status === 401) {
      if (retryCount > 0) {
        return authenticatedRequest<T>(url, method, config, retryCount - 1);
      } else {
        localStorage.removeItem('user');
      }
    }

    return Promise.reject(error);
  }
}

export async function nonAuthenticatedRequest<T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.request<T>({
      method,
      url,
      ...config,
    });
    return response?.data;
  } catch (error: any) {
    // console.error('Error>>', error);
    return Promise.reject(error?.response?.data?.error_description || error?.response?.data?.message);
  }
}
