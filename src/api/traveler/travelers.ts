import {
  AddTravelerInterface,
  FetchTravelerByIdInterface,
  FetchTravelersInterface,
  UpdateTravlerInterface,
} from '../../interfaces/travelersInterface';
import { nonAuthenticatedRequest } from '../../utils/commonAxios';
import { authenticatedRequest } from '../../utils/commonAxios';

export const getTravelersAPIRequest = async (searchParams: FetchTravelersInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/travelers?limit=${searchParams?.limit}&page=${searchParams?.page}`,
    'get',
    {
      data: {},
    }
  );
};

export const registerTravelerAPIRequest = async (travelerData: AddTravelerInterface) => {
  return await nonAuthenticatedRequest(`${process.env.REACT_APP_API_URL}/traveler/register`, 'post', {
    data: { ...travelerData?.travelerData },
  });
};

export const updateTravelerAPIRequest = async (travelerData: UpdateTravlerInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/traveler/${travelerData?.travelerId}`, 'put', {
    data: { ...travelerData?.travelerData },
  });
};

export const getTravelerByIdAPIRequest = async (searchParams: FetchTravelerByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/traveler/${searchParams?.travelerId}`, 'get', {});
};

export const deleteTravelerAPIRequest = async (searchParams: FetchTravelerByIdInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/traveler/${searchParams?.travelerId}`,
    'delete',
    {}
  );
};
