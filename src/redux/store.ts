import { configureStore } from '@reduxjs/toolkit';
import emptyInitialReducer from './slices/emptyInitialSlice';
import authSliceReducer from './slices/auth/authSlice';
import createTripReducer from './slices/trips/createTripSlice';
import getCitiesReducer from './slices/cities/getCitiesSlice';
import addCitiesReducer from './slices/cities/addCitiesSlice';
import editCitiesReducer from './slices/cities/editCitiesSlice';
import deleteCitiesReducer from './slices/cities/deleteCitiesSlice';
import saveTripReducer from './slices/trips/saveTripSlice';
import getAllTripsByTravelerIdReducer from './slices/trips/getAllTripsByTravelerIdSlice';
import getTripByIdReducer from './slices/trips/getTripByIdSlice';
import deleteTripReducer from './slices/trips/deleteTripSlice';
import getUsersReducer from './slices/users/getUsersSlice';
import addUsersReducer from './slices/users/addUsersSlice';
import editUsersReducer from './slices/users/editUsersSlice';
import deleteUsersReducer from './slices/users/deleteUsersSlice';
import getTravelersReducer from './slices/travelers/getTravelersSlice';
import registerTravelerReducer from './slices/travelers/registerTravelerSlice';
import editTravelersReducer from './slices/travelers/editTravelersSlice';
import deleteTravelersReducer from './slices/travelers/deleteTravelersSlice';
import getDestinationsReducer from './slices/destinations/getDestinationsSlice';
import addDestinationsReducer from './slices/destinations/addDestinationsSlice';
import editDestinationsReducer from './slices/destinations/editDestinationsSlice';
import deleteDestinationsReducer from './slices/destinations/deleteDestinationsSlice';
import getDashboardStatsReducer from './slices/dashboard/getDashboardStatsSlice';
import getTravelerByIdReducer from './slices/travelers/getTravelerByIdSlice';
import loadingReducer from './slices/loading/loadingSlice';
import getHotelRecommendationsReducer from './slices/hotels/getHotelRecommendationsSlice';
import forgotPasswordReducer from './slices/auth/forgotPasswordSlice';
import resetPasswordReducer from './slices/auth/resetPasswordSlice';

const store = configureStore({
  reducer: {
    login: authSliceReducer,
    empty: emptyInitialReducer,
    CreateTrip: createTripReducer,
    FetchCities: getCitiesReducer,
    AddCity: addCitiesReducer,
    EditCity: editCitiesReducer,
    DeleteCity: deleteCitiesReducer,
    SaveTrip: saveTripReducer,
    FetchAllTrips: getAllTripsByTravelerIdReducer,
    FetchTripById: getTripByIdReducer,
    DeleteTrip: deleteTripReducer,
    FetchUsers: getUsersReducer,
    AddUser: addUsersReducer,
    EditUser: editUsersReducer,
    DeleteUser: deleteUsersReducer,
    FetchTravelers: getTravelersReducer,
    RegisterTraveler: registerTravelerReducer,
    EditTraveler: editTravelersReducer,
    DeleteTraveler: deleteTravelersReducer,
    FetchDestinations: getDestinationsReducer,
    AddDestination: addDestinationsReducer,
    EditDestination: editDestinationsReducer,
    DeleteDestination: deleteDestinationsReducer,
    FetchDashboardStats: getDashboardStatsReducer,
    FetchTravelerById: getTravelerByIdReducer,
    loading: loadingReducer,
    FetchHotelRecommendations: getHotelRecommendationsReducer,
    ForgotPassword: forgotPasswordReducer,
    ResetPassword: resetPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
