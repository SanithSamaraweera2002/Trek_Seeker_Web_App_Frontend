import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoutes } from './components/privateRoutes/PrivateRoutes';
import { MainLayout } from './components/mainLayout/MainLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'antd/dist/antd.min.css';
import '../src/assets/scss/app.scss';

import { HomePage } from './pages/homepage/HomePage';
import { CurrencyConversion } from './pages/currencyConversion/CurrencyConversion';
import { WeatherInfo } from './pages/weatherInformation/WeatherInfo';
import { CreateTrip } from './pages/createTrip/CreateTrip';
import { TripShow } from './pages/createTrip/TripShow';
import { UserTripsPage } from './pages/profile/UserTripsPage';
import { UserProfilePage } from './pages/profile/UserProfilePage';
import { Login } from './pages/login/loginPage';
import { Registration } from './pages/register/Registration';
import { ResetPassword } from './pages/passwordReset/resetPassword';
import { ForgotPassword } from './pages/passwordReset/forgotPassword';

import { AdminDashboard } from './pages/adminPanel/dashboard/AdminDashboard';
import { CityManagement } from './pages/adminPanel/citiesManagement/CitiesManagement';
import { DestinationManagement } from './pages/adminPanel/destinationManagement/DestinationsManagement';
import { UserManagement } from './pages/adminPanel/userManagement/UserManagement';
import { TravelerManagement } from './pages/adminPanel/userManagement/TravelerManagement';

import { NotFound } from './pages/notFound/NotFound';
import { Preloader } from './components/preloader/Preloader';

AOS.init();

function App() {
  return (
    <>
      <Preloader />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/currency-conversion" element={<CurrencyConversion />} />
          <Route path="/weather-info" element={<WeatherInfo />} />

          <Route path="/trip" element={<TripShow />} />

          {/* Traveller Specific Routes */}
          <Route element={<PrivateRoutes allowedRoles={['traveler']} />}>
            <Route path="/new-trip" element={<CreateTrip />} />
            <Route path="/trips" element={<UserTripsPage />} />
          </Route>

          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Specific Routes */}
          <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
              <Route path="cities" element={<CityManagement />} />
              <Route path="destinations" element={<DestinationManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="travelers" element={<TravelerManagement />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
