export interface FetchCitiesInterface {
  limit?: number;
  page?: number;
}

export interface FetchCitiesPropsInterface {
  getCitiesLoading: boolean;
  getCitiesData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  getCitiesError: any;
  getCitiesStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AddCitiesInterface {
  cityData?: any;
}

export interface AddCitiesPropsInterface {
  addCityLoading?: boolean;
  addCityData?: any;
  addCityStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  addCityError?: any;
}

export interface UpdateCitiesInterface {
  cityId?: number;
  cityData?: any;
}

export interface UpdateCitiesPropsInterface {
  editCitiesLoading: boolean;
  editCitiesData: any;
  editCitiesError: any;
  editCitiesStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface FetchCityByIdInterface {
  cityId: number;
}

export interface FetchCityByIdPropsInterface {
  fetchCityByIdLoading?: boolean;
  fetchCityByIdData?: any;
  fetchCityByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  fetchCityByIdError?: any;
}

export interface DeleteCityPropsInterface {
  deleteCityLoading?: boolean;
  deleteCityData?: any;
  deleteCityStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  deleteCityError?: any;
}
