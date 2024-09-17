interface DayEntry {
  latitude: number;
  longitude: number;
  date: string;
}

export interface FetchHotelRecommendationsInterface {
  days: DayEntry[];
  hotelTypes: string[];
}

export interface FetchHotelRecommendationsPropsInterface {
  getHotelRecommendationsLoading?: boolean;
  getHotelRecommendationsIdData?: any;
  getHotelRecommendationsStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  getHotelRecommendationsError?: any;
}
