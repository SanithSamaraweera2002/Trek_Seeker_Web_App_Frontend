import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';

import {
  getAllTripsRequest,
  getAllTripsSelector,
  clearGetAllTripsResponse,
} from '../../redux/slices/trips/getAllTripsByTravelerIdSlice';
import { getTripByIdRequest, getTripSelector, clearGetTripResponse } from '../../redux/slices/trips/getTripByIdSlice';
import {
  deleteTripRequest,
  deleteTripSelector,
  clearDeleteTripResponse,
} from '../../redux/slices/trips/deleteTripSlice';
import { AuthPropType, useAuth } from '../../components/authProvider/AuthProvider';

import { Card, Col, Row, Typography, Button, Tooltip, message, Spin } from 'antd';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { FaTrashAlt, FaCalendarAlt, FaMapMarkedAlt, FaCompass } from 'react-icons/fa';
import { MdOutlineExplore } from 'react-icons/md';
import './UserTripsPage.scss';
import TripImage from '../../assets/images/kandy_image_new.jpg';
import NoTripsFoundImg from '../../assets/images/no-trips-found.svg';

const { Title, Text } = Typography;

const tripsData = [
  {
    id: 1,
    cityImage: TripImage,
    tripName: 'Trip to Kandy',
    destination: 'Kandy, Sri Lanka',
    startDate: '2024-09-15',
    duration: '3 Days',
  },
  {
    id: 2,
    cityImage: TripImage,
    tripName: 'Urban Adventure',
    destination: 'Colombo, Sri Lanka',
    startDate: '2024-10-01',
    duration: '5 Days',
  },
  {
    id: 2,
    cityImage: TripImage,
    tripName: 'Scenic Vibes',
    destination: 'Nuwara Eliya, Sri Lanka',
    startDate: '2024-08-12',
    duration: '1 Days',
  },
  {
    id: 2,
    cityImage: TripImage,
    tripName: 'Colombo Adventure',
    destination: 'Colombo, Sri Lanka',
    startDate: '2024-19-20',
    duration: '2 Days',
  },
  {
    id: 2,
    cityImage: TripImage,
    tripName: 'Beach Trails',
    destination: 'Galle, Sri Lanka',
    startDate: '2024-08-22',
    duration: '4 Days',
  },
];

export const UserTripsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user }: AuthPropType = useAuth();

  const { getAllTripsByTravelerIdStatus, getAllTripsByTravelerIdLoading, getAllTripsByTravelerIdData } =
    useAppSelector(getAllTripsSelector);
  const { deleteTripByIdStatus, deleteTripByIdError } = useAppSelector(deleteTripSelector);
  const { getTripByIdStatus } = useAppSelector(getTripSelector);

  const [trips, setTrips] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (getAllTripsByTravelerIdStatus === 'SUCCESS') {
      setTrips(getAllTripsByTravelerIdData);
      setIsLoading(false);
    } else if (getAllTripsByTravelerIdStatus === 'FAILED') {
      message.error('Something went wrong !');
      setIsLoading(false);
    }
    dispatch(clearGetAllTripsResponse());
  }, [getAllTripsByTravelerIdStatus]);

  useEffect(() => {
    if (deleteTripByIdStatus === 'SUCCESS') {
      message.success('Trip Deleted Successfully !');
      fetchTrips();
    } else if (deleteTripByIdStatus === 'FAILED') {
      message.error(deleteTripByIdError);
    }
    dispatch(clearDeleteTripResponse());
  }, [deleteTripByIdStatus]);

  useEffect(() => {
    if (getTripByIdStatus === 'SUCCESS') {
      navigate('/trip', { state: { fromTripsPage: true } });
    } else if (getTripByIdStatus === 'FAILED') {
      message.error('Something went wrong !');
    }
    // dispatch(clearGetTripResponse());
  }, [getTripByIdStatus, navigate]);

  const fetchTrips = () => {
    dispatch(getAllTripsRequest({ travelerId: user ? user.id : 4 }));
  };

  const handleDelete = (tripId: any) => {
    dispatch(deleteTripRequest({ tripId: tripId }));
  };

  const handleOnClickTrip = (tripId: any) => {
    dispatch(getTripByIdRequest({ tripId: tripId }));
  };

  // const formatDuration = (days: number): string => {
  //   return days === 1 ? '1 Day' : `${days} Days`;
  // };

  console.log('=== Trip Data ===', trips);

  return (
    <div className="main-content">
      <div className="trips-page-content">
        {!isLoading && trips && trips.length > 0 ? (
          <>
            <div className="trips-page-header">
              <Title level={2}>Your Trips</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  navigate('/new-trip');
                }}
              >
                New Trip
              </Button>
            </div>
            <div className="trips-page-content">
              <Row gutter={[16, 16]}>
                {trips.map((trip: any) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={trip.TripID}>
                    <div className="card-container">
                      <Card
                        hoverable
                        cover={<img alt={trip.TripName} src={trip?.city?.CityImage} />}
                        onClick={() => handleOnClickTrip(trip?.TripID)}
                      >
                        <Card.Meta
                          title={trip.TripName || `Trip to ${trip.city?.CityName}`}
                          description={
                            <>
                              <div className="destination-name">{trip.city?.CityName}, Sri Lanka</div>
                              <div className="trip-date-duration">
                                <FaCalendarAlt />
                                <span className="start-date">{trip.StartDate}</span>
                                <span className="duration">
                                  {trip.Duration} {trip.Duration === 1 ? 'Day' : 'Days'}
                                </span>
                              </div>
                            </>
                          }
                        />
                      </Card>
                      <Tooltip title="Delete">
                        <FaTrashAlt className="delete-icon" onClick={() => handleDelete(trip.TripID)} />
                      </Tooltip>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        ) : !isLoading && trips.length === 0 ? (
          <>
            <>
              <div className="no-trips">
                <img src={NoTripsFoundImg} alt="Adventure Hub" className="adventure-image" />
                <h2>Welcome to Your Adventure Hub! 🎉</h2>
                <p>An exciting adventure awaits you! Let's embark on your first journey!</p>
                <Button
                  type="primary"
                  size="large"
                  className="plan-button"
                  icon={<MdOutlineExplore size={22} />}
                  onClick={() => navigate('/new-trip')}
                >
                  Create Your First Trip!
                </Button>
              </div>
            </>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
