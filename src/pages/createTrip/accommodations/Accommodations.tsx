import { useState, useEffect } from 'react';
import { Modal, Button, Card, Tooltip, Row, Col, Collapse } from 'antd';
import {
  FaWifi,
  FaParking,
  FaWheelchair,
  FaSwimmingPool,
  FaSnowflake,
  FaConciergeBell,
  FaChild,
  FaUtensils,
  FaMapMarkerAlt,
  FaGlobe,
  FaHeart,
} from 'react-icons/fa';
import { GlobalOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import { FaTrashAlt } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import {
  getHotelRecommendationsRequest,
  getHotelRecommendationsSelector,
  clearFetchHotelRecommendationsResponse,
} from '../../../redux/slices/hotels/getHotelRecommendationsSlice';
import './Accommodations.scss';
import hotelImg from '../../../assets/images/hotelsImg.jpg';

const { Panel } = Collapse;

export const Accommodations = ({
  accommodationDetails,
  destinationsCoords,
  tripStartDate,
  onAccommodationSelect,
  isSaveDisabled,
  fromTripsPage,
  city,
}: any) => {
  const dispatch = useAppDispatch();
  const { getHotelRecommendationsIdData, getHotelRecommendationsStatus } = useAppSelector(
    getHotelRecommendationsSelector
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accommodationRecommendationsData, setAccommodationRecommendationsData] = useState<any[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<any>(accommodationDetails);
  // const [selectedHotel, setSelectedHotel] = useState<any>({});
  const [mode, setMode] = useState('ADD');

  const showModal = () => {
    setMode('ADD');
    dispatch(getHotelRecommendationsRequest({ destinations: destinationsCoords }));
  };

  const handleCancel = () => {
    setMode('ADD');
    setIsModalVisible(false);
  };

  // const handleFavorite = (hotel: any) => {
  //   setSelectedHotel((prev: any) => {
  //     const isSelected = prev[hotel.day]?.placeId === hotel.placeId;
  //     const updatedSelection = { ...prev };
  //     if (isSelected) {
  //       delete updatedSelection[hotel.day];
  //     } else {
  //       updatedSelection[hotel.day] = { ...hotel, day: hotel.day };
  //     }
  //     return updatedSelection;
  //   });
  // };

  // const handleAddToMainTab = () => {
  //   Object.entries(selectedHotel).forEach(([_, hotel]: any) => {
  //     onAccommodationSelect(hotel.placeId, hotel.day);
  //   });
  //   setFavoriteHotels(selectedHotel);
  //   setIsModalVisible(false);
  // };

  // const handleUpdateSelection = (hotel: any) => {
  //   setSelectedHotel((prev: any) => ({ ...prev, [hotel.day]: favoriteHotels[hotel.day] }));
  //   setIsModalVisible(true);
  // };
  const handleHotelClick = (hotel: any, day: any) => {
    setFavoriteHotels((prev: any) => {
      const updatedHotels = { ...prev };
      if (updatedHotels[day]?.placeId === hotel.placeId) {
        delete updatedHotels[day];
      } else {
        updatedHotels[day] = { ...hotel, day };
      }
      onAccommodationSelect(hotel.placeId, day);
      return updatedHotels;
    });
  };

  useEffect(() => {
    if (getHotelRecommendationsStatus === 'SUCCESS') {
      setAccommodationRecommendationsData(getHotelRecommendationsIdData.recommendations);
      setIsModalVisible(true);
    }
    dispatch(clearFetchHotelRecommendationsResponse());
  }, [getHotelRecommendationsStatus]);

  const amenitiesList = [
    { name: 'Free WiFi', icon: <FaWifi /> },
    { name: 'Parking', icon: <FaParking /> },
    { name: 'WheelChair Accessible', icon: <FaWheelchair /> },
    { name: 'Pool Access', icon: <FaSwimmingPool /> },
    { name: 'Air Conditioned', icon: <FaSnowflake /> },
    { name: 'Room Service', icon: <FaConciergeBell /> },
    { name: 'Kid Friendly', icon: <FaChild /> },
    { name: 'Restaurant', icon: <FaUtensils /> },
  ];

  console.log('favoriteHotels', favoriteHotels);
  // console.log('selectedHotel', selectedHotel);
  console.log('destinationsCoords', destinationsCoords);
  console.log('fromTripsPage', fromTripsPage);

  return (
    <div className="accommodations-tab">
      {!Object.keys(favoriteHotels).length ? (
        <div className="no-accommodations">
          <img src={hotelImg} alt="Explore Icon" className="explore-icon" />
          <p>Discover handpicked accommodations just for your journey!</p>
          <Button type="primary" onClick={showModal}>
            Explore Stays
          </Button>
        </div>
      ) : (
        <div className="selected-accommodations">
          <div className="heading-container">
            <h3>
              <span className="highlight">Your Perfect Stays</span> Await
            </h3>
          </div>
          {Object.values(favoriteHotels)
            .sort((a: any, b: any) => (a.day > b.day ? 1 : -1))
            .map((hotel: any, index) => (
              <Card
                key={index}
                className="selected-card"
                title={`Day ${hotel.day}: ${hotel.name}`}
                extra={
                  !isSaveDisabled && !fromTripsPage ? (
                    // <Button
                    //   onClick={() => {
                    //     handleUpdateSelection(hotel);
                    //     setMode('UPDATE');
                    //   }}
                    //   className="change-btn"
                    // >
                    //   Change
                    // </Button>
                    <>
                      <div className="action-buttons">
                        <Tooltip title="Change">
                          <Button
                            onClick={() => {
                              // handleHotelClick(hotel, hotel.day);
                              // setMode('UPDATE');
                              showModal();
                            }}
                            className="edit-btn"
                            icon={<EditOutlined />}
                          />
                        </Tooltip>
                        <Tooltip title="Remove">
                          <Button
                            onClick={() => handleHotelClick(hotel, hotel.day)}
                            className="delete-btn"
                            icon={<FaTrashAlt />}
                          />
                        </Tooltip>
                      </div>
                    </>
                  ) : null
                }
                style={{
                  marginBottom: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                }}
              >
                <p className="location">
                  {' '}
                  <FaMapMarkerAlt className="marker-icon" />
                  {city}, Sri Lanka
                </p>
                <div className="amenities-list">
                  {amenitiesList.map((amenity, i) => (
                    <div key={i} className="amenity-item">
                      <span className="amenity-icon">{amenity.icon}</span>
                      <span className="amenity-name">{amenity.name}</span>
                    </div>
                  ))}
                </div>
                <div className="hotel-details">
                  <div className="rating">
                    <span className="rating-stars">★★★★☆</span>
                    <span className="rating-count">({hotel.userRatingsTotal})</span>
                  </div>
                  <div className="hotel-links">
                    {hotel.website && (
                      <Button
                        className="hotel-button globe"
                        icon={<GlobalOutlined />}
                        onClick={() => window.open(hotel.website, '_blank')}
                      >
                        Website
                      </Button>
                    )}

                    <Button
                      className="hotel-button map"
                      icon={<EnvironmentOutlined />}
                      onClick={() => window.open(hotel.url, '_blank')}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      <Modal
        title="Discover Your Perfect Stay"
        visible={isModalVisible}
        onCancel={handleCancel}
        // footer={false}
        onOk={handleCancel}
        // footer={
        //   <Button type="primary" onClick={handleAddToMainTab} disabled={!Object.keys(selectedHotel).length}>
        //     {mode === 'UPDATE' ? 'Update my accommodations' : 'Add to My Accommodations'}
        //   </Button>
        // }
        width={1000}
      >
        {accommodationRecommendationsData?.map((dayData: any, index: number) => (
          <div className="recommendations" key={dayData.day}>
            <Collapse accordion ghost defaultActiveKey={[index === 0 ? dayData.day : null]}>
              {dayData.hotels.length > 0 && (
                <Panel header={`Recommendations for Day ${dayData.day}`} key={dayData.day}>
                  <div className="hotel-cards">
                    <Row gutter={16}>
                      {dayData.hotels.map((hotel: any) => (
                        <Col key={hotel.placeId} span={8}>
                          <Card
                            hoverable
                            className="hotel-card"
                            cover={
                              <>
                                <img alt={hotel.name} src={hotel.image || 'default-hotel.jpg'} />
                                <div className="favorite-icon" onClick={() => handleHotelClick(hotel, dayData.day)}>
                                  {/* <FaHeart
                                  className={`heart-icon ${
                                    favoriteHotels[dayData.day]?.placeId === hotel.placeId ? 'favorited' : ''
                                  }`}
                                /> */}
                                  <svg
                                    className={`heart-icon ${
                                      favoriteHotels[dayData.day]?.placeId === hotel.placeId ? 'favorited' : ''
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path
                                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                      className="heart-path"
                                    />
                                  </svg>
                                </div>
                              </>
                            }
                            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                          >
                            <div className="card-content">
                              <div className="main-details">
                                <h3 className="hotel-name">{hotel.name}</h3>
                                <p className="hotel-location">{city}, Sri Lanka</p>
                              </div>

                              <div className="amenities">
                                {amenitiesList.map((amenity) => (
                                  <span key={amenity.name} title={amenity.name} className="amenity-icon">
                                    {amenity.icon}
                                  </span>
                                ))}
                              </div>

                              <div className="rating-container">
                                <div className="rating-details">
                                  <span className="rating-value">{hotel.rating}</span>
                                  <span className="rating-classification">
                                    {' '}
                                    {hotel.rating >= 4 ? 'Excellent' : 'Very Good'}
                                  </span>
                                  <span className="rating-separator">•</span>
                                  <span className="review-count">({hotel.userRatingsTotal} reviews)</span>
                                </div>
                              </div>

                              <div className="action-buttons">
                                {hotel.url && (
                                  <Tooltip title="View on Google Maps">
                                    <Button
                                      icon={<FaMapLocationDot />}
                                      type="primary"
                                      href={hotel.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="action-button"
                                    />
                                  </Tooltip>
                                )}
                                {hotel.website && (
                                  <Tooltip title="Website">
                                    <Button
                                      icon={<FaGlobe />}
                                      type="primary"
                                      href={hotel.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="action-button"
                                    />
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Panel>
              )}
            </Collapse>
          </div>
        ))}
      </Modal>
    </div>
  );
};
