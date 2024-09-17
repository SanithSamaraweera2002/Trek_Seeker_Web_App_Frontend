import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Row, Col, message, Card, Statistic } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import {
  getDashboardStatsRequest,
  getDashboardStatsSelector,
  clearFetchDashboardStatsResponse,
} from '../../../redux/slices/dashboard/getDashboardStatsSlice';

import { UserOutlined, TeamOutlined, EnvironmentOutlined, GlobalOutlined, ArrowUpOutlined } from '@ant-design/icons';

import LineChartComponent from '../../../components/charts/LineChartComponent';
import PieChartComponent from '../../../components/charts/PieChartComponent';
import BarChartComponent from '../../../components/charts/BarChartComponent';
import MapChartComponent from '../../../components/charts/MapChartComponent';

import './AdminDashboard.scss';

export const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { getDashboardStatsStatus, getDashboardStatsData } = useAppSelector(getDashboardStatsSelector);

  const [dashboardStats, setDashboardStats] = useState<any>({});

  useEffect(() => {
    getDashboardStats();
  }, []);

  useEffect(() => {
    if (getDashboardStatsStatus === 'SUCCESS') {
      setDashboardStats(getDashboardStatsData);
      dispatch(clearFetchDashboardStatsResponse());
    } else if (getDashboardStatsStatus === 'FAILED') {
      message.error('Something Went Wrong !');
    }
  });

  const getDashboardStats = () => {
    dispatch(getDashboardStatsRequest());
  };

  const signUpsByMonthData = dashboardStats?.signUpsByMonth || [];
  const usersByGenderData =
    dashboardStats?.usersByGender?.map((gender: any) => ({ name: gender.Gender, value: gender.count })) || [];
  const usersByCountryData =
    dashboardStats?.usersByCountry?.map((country: any) => ({ name: country.Country, count: country.count })) || [];

  return (
    <div>
      <div className="pageHeader">
        <Row>
          <Col lg={24} xs={24}>
            <PageHeader ghost={false} title="Dashboard" subTitle="" />
          </Col>
        </Row>
      </div>
      <section className="pageContent">
        <Row gutter={[16, 16]} className="dashboard-cards">
          <Col xs={24} md={6} lg={6}>
            <Link to="/admin/travelers">
              <Card hoverable className="dashboard-card">
                <Statistic
                  title="Total Travelers"
                  value={dashboardStats?.totalUsers || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Link>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Card hoverable className="dashboard-card">
              <Statistic
                title="Active Travelers"
                value={dashboardStats?.activeUserCount || 0}
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Card hoverable className="dashboard-card">
              <Statistic
                title="Inactive Travelers"
                value={dashboardStats?.inactiveUserCount || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Card hoverable className="dashboard-card">
              <Statistic title="Total Trips" value={dashboardStats?.totalTrips || 0} prefix={<GlobalOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Card hoverable className="dashboard-card">
              <Statistic
                title="Most Popular City"
                value={dashboardStats?.mostPopularCity?.city?.CityName || 'N/A'}
                prefix={<EnvironmentOutlined />}
                suffix={`(${dashboardStats?.mostPopularCity?.tripCount || 0} trips)`}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="chart-cards" style={{ marginBottom: '24px' }}>
          {/* <Col xs={24}>
            <div className="chart-map">
              <MapChartComponent data={usersByCountryData} />
            </div>
          </Col> */}
          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Card hoverable className="chart-card">
              <LineChartComponent data={signUpsByMonthData} xKey="month" yKey="count" title="Sign-Ups by Month" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Card hoverable className="chart-card">
              <PieChartComponent data={usersByGenderData} dataKey="value" nameKey="name" title="Users by Gender" />
            </Card>
          </Col>
          <Col xs={24} md={24}>
            <Card hoverable className="chart-card">
              <BarChartComponent data={usersByCountryData} xKey="name" yKey="count" title="Users by Country" />
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
};
