import { FetchHotelRecommendationsInterface } from '../../interfaces/hotelsinterface';
import { nonAuthenticatedRequest } from '../../utils/commonAxios';

export const getHotelRecommendationsAPIRequest = async (hotelData: FetchHotelRecommendationsInterface) => {
  return await nonAuthenticatedRequest(`${process.env.REACT_APP_API_URL}/hotels/recommendations`, 'post', {
    data: { ...hotelData },
  });
};
