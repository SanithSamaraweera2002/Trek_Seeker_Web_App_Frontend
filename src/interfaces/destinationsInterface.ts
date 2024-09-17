export interface FetchDestinationsInterface {
  limit?: number;
  page?: number;
}

export interface FetchDestinationsPropsInterface {
  getDestinationsLoading: boolean;
  getDestinationsData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  getDestinationsError: any;
  getDestinationsStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AddDestinationsInterface {
  destinationData?: any;
}

export interface AddDestinationsPropsInterface {
  addDestinationLoading?: boolean;
  addDestinationData?: any;
  addDestinationStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  addDestinationError?: any;
}

export interface UpdateDestinationsInterface {
  destinationId?: number;
  destinationData?: any;
}

export interface UpdateDestinationsPropsInterface {
  editDestinationsLoading: boolean;
  editDestinationsData: any;
  editDestinationsError: any;
  editDestinationsStatus: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface FetchDestinationByIdInterface {
  destinationId: number;
}

export interface FetchDestinationByIdPropsInterface {
  fetchDestinationByIdLoading?: boolean;
  fetchDestinationByIdData?: any;
  fetchDestinationByIdStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  fetchDestinationByIdError?: any;
}

export interface DeleteDestinationPropsInterface {
  deleteDestinationLoading?: boolean;
  deleteDestinationData?: any;
  deleteDestinationStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  deleteDestinationError?: any;
}
