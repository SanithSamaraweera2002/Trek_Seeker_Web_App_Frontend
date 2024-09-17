import {
  FetchCitiesInterface,
  AddCitiesInterface,
  FetchCityByIdInterface,
  UpdateCitiesInterface,
} from '../../interfaces/countriesInterface';
import { authenticatedRequest } from '../../utils/commonAxios';

export const getCitiesAPIRequest = async (searchParams: FetchCitiesInterface) => {
  return await authenticatedRequest(
    `${process.env.REACT_APP_API_URL}/cities?limit=${searchParams?.limit}&page=${searchParams?.page}`,
    'get',
    {
      data: {},
    }
  );
};

export const addCityAPIRequest = async (cityData: AddCitiesInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/city`, 'post', {
    data: { ...cityData?.cityData },
  });
};

export const updateCityAPIRequest = async (cityData: UpdateCitiesInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/city/${cityData?.cityId}`, 'put', {
    data: { ...cityData?.cityData },
  });
};

export const getCityByIdAPIRequest = async (searchParams: FetchCityByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/city/${searchParams?.cityId}`, 'get', {});
};

export const deleteCityAPIRequest = async (searchParams: FetchCityByIdInterface) => {
  return await authenticatedRequest(`${process.env.REACT_APP_API_URL}/city/${searchParams?.cityId}`, 'delete', {});
};
