export interface TripCreateInterface {
  cityID: number;
  userInterests: string[];
  budget: number;
  startDate: string;
  endDate: string;
  travelerCategory: string;
  ageCategory: string;
  gender: string;
}

export interface TripCreatePropsInterface {
  createTripLoading?: boolean;
  createTripData?: any;
  createTripStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  createTripError?: any;
}

export interface TripSaveInterface {
  tripData?: any;
}

export interface TripSavePropsInterface {
  saveTripLoading?: boolean;
  saveTripData?: any;
  saveTripStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  saveTripError?: any;
}

export interface FetchAllTripsByTravelerIdIdInterface {
  travelerId?: number;
}

export interface FetchAllTripsByTravelerIdPropsInterface {
  getAllTripsByTravelerIdLoading?: boolean;
  getAllTripsByTravelerIdData?: any;
  getAllTripsByTravelerIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  getAllTripsByTravelerIdError?: any;
}

export interface FetchTripByIdInterface {
  travelerId?: number;
  tripId?: number;
}

export interface FetchTripByIdPropsInterface {
  getTripByIdLoading?: boolean;
  getTripByIdData?: any;
  getTripByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  getTripByIdError?: any;
}

export interface DeleteTripPropsInterface {
  deleteTripByIdLoading?: boolean;
  deleteTripByIdData?: any;
  deleteTripByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  deleteTripByIdError?: any;
}
