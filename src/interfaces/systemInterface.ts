export interface FetchDashboardStatsPropsInterface {
  getDashboardStatsLoading?: boolean;
  getDashboardStatsData?: any;
  getDashboardStatsStatus?: 'IDLE' | 'SUCCESS' | 'FAILED' | 'PENDING';
  getDashboardStatsError?: any;
}
