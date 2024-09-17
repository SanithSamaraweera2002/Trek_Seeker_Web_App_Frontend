export interface AddTravelerInterface {
  travelerData: any;
}

export interface AddTravelerPropsInterface {
  addTravelerLoading?: boolean;
  addTravelerData?: any;
  addTravelerStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  addTravelerError?: any;
}

export interface FetchTravelersInterface {
  limit?: number;
  page?: number;
}

export interface FetchTravelersPropsInterface {
  getTravelersLoading: boolean;
  getTravelersData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  getTravelersError: any;
  getTravelersStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface UpdateTravlerInterface {
  travelerId?: number;
  travelerData?: any;
}

export interface UpdateTravelerPropsInterface {
  editTravelerLoading: boolean;
  editTravelerData: any;
  editTravelerError: any;
  editTravelerStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface FetchTravelerByIdInterface {
  travelerId: number;
}

export interface FetchTravelerByIdPropsInterface {
  fetchTravelerByIdLoading?: boolean;
  fetchTravelerByIdData?: any;
  fetchTravelerByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  fetchTravelerByIdError?: any;
}

export interface DeleteTravelerPropsInterface {
  deleteTravelerLoading?: boolean;
  deleteTravelerData?: any;
  deleteTravelerStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  deleteTravelerError?: any;
}
