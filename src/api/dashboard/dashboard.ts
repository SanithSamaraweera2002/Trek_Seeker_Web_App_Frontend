import { authenticatedRequest } from '../../utils/commonAxios';

export const getDashboardStatsAPIRequest = async () => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/admin/dashboard`, 'get', {});
};
