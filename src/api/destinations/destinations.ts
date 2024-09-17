import {
  FetchDestinationsInterface,
  AddDestinationsInterface,
  FetchDestinationByIdInterface,
  UpdateDestinationsInterface,
} from '../../interfaces/destinationsInterface';
import { authenticatedRequest } from '../../utils/commonAxios';

export const getDestinationsAPIRequest = async (searchParams: FetchDestinationsInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/destinations?limit=${searchParams?.limit}&page=${searchParams?.page}`,
    'get',
    {
      data: {},
    }
  );
};

export const addDestinationAPIRequest = async (destinationData: AddDestinationsInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/destinations`, 'post', {
    data: { ...destinationData?.destinationData },
  });
};

export const updateDestinationAPIRequest = async (destinationData: UpdateDestinationsInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/destinations/${destinationData?.destinationId}`,
    'put',
    {
      data: { ...destinationData?.destinationData },
    }
  );
};

export const getDestinationByIdAPIRequest = async (searchParams: FetchDestinationByIdInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/destinations/${searchParams?.destinationId}`,
    'get',
    {}
  );
};

export const deleteDestinationAPIRequest = async (searchParams: FetchDestinationByIdInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/destinations/${searchParams?.destinationId}`,
    'delete',
    {}
  );
};
