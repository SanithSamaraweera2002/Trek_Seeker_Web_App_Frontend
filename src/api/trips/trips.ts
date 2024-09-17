import {
  TripCreateInterface,
  TripSaveInterface,
  FetchTripByIdInterface,
  FetchAllTripsByTravelerIdIdInterface,
} from '../../interfaces/tripsInterface';
import { nonAuthenticatedRequest } from '../../utils/commonAxios';
import { authenticatedRequest } from '../../utils/commonAxios';

export const createTripAPIRequest = async (userData: TripCreateInterface) => {
  return await nonAuthenticatedRequest(`${process.env.REACT_APP_API_URL}/generate-trip`, 'post', {
    data: { ...userData },
  });
};

export const saveTripAPIRequest = async (tripData: TripSaveInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/trips`, 'post', {
    data: { ...tripData?.tripData },
  });
};

export const getAllTripsAPIRequest = async (searchParams: FetchAllTripsByTravelerIdIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/trips/${searchParams?.travelerId}`, 'get', {});
};

export const getTripByIdAPIRequest = async (searchParams: FetchTripByIdInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/trips/details/${searchParams?.tripId}`,
    'get',
    {}
  );
};

export const deleteTripAPIRequest = async (searchParams: FetchTripByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/trips/${searchParams?.tripId}`, 'delete', {});
};
