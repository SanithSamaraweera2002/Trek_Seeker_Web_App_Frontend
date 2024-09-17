import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { useLocalStorage } from '../../hooks/localStorageHook';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tag, Tabs, Collapse, Card, message, Button, Modal, Input, Space } from 'antd';
import { ShareAltOutlined, SaveOutlined, EnvironmentOutlined, DownloadOutlined, MailOutlined } from '@ant-design/icons';
import { FaLocationDot } from 'react-icons/fa6';
import { CiFaceFrown } from 'react-icons/ci';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mockImage from '../../assets/images/kandy_image_new.jpg';
import './TripShow.scss';
import { createTripSelector, clearCreateTripResponse } from '../../redux/slices/trips/createTripSlice';
import { AuthPropType, useAuth } from '../../components/authProvider/AuthProvider';
import { saveTripRequest, saveTripSelector, clearSaveTripResponse } from '../../redux/slices/trips/saveTripSlice';
import { getTripSelector, clearGetTripResponse } from '../../redux/slices/trips/getTripByIdSlice';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import moment from 'moment';
import TripMap from './mapComponent/TripMap';
import { Accommodations } from './accommodations/Accommodations';

const { TabPane } = Tabs;
const { Panel } = Collapse;

export const TripShow = () => {
  const dispatch = useAppDispatch();
  const { user }: AuthPropType = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { createTripData, createTripStatus } = useAppSelector(createTripSelector);
  const { getTripByIdData, getTripByIdStatus } = useAppSelector(getTripSelector);
  const { saveTripStatus } = useAppSelector(saveTripSelector);

  const [tripDetails, setTripDetails] = useLocalStorage('tripDetails', {});
  const [accommodations, setAccommodations] = useState<{ day: number; placeId: string }[]>([]);
  const [cityImage, setCityImage] = useState(mockImage);
  const [isShareModalVisible, setIsShareModalVisible] = useState<boolean>(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState<boolean>(false);
  const [tripName, setTripName] = useState('');
  const [shareViaEmail, setShareViaEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const fromTripsPage = location.state?.fromTripsPage || false;
  // const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useLocalStorage('isSaveDisable', false);

  useEffect(() => {
    if (createTripStatus === 'SUCCESS') {
      setTripDetails(createTripData);
      dispatch(clearCreateTripResponse());
      setIsSaveDisabled(false);
    }
  }, [createTripStatus]);

  useEffect(() => {
    if (getTripByIdStatus === 'SUCCESS') {
      setTripDetails(getTripByIdData);
    }
    dispatch(clearGetTripResponse());
  }, [getTripByIdStatus]);

  useEffect(() => {
    if (saveTripStatus === 'SUCCESS') {
      message.success('Trip saved succesfully !');
      setIsSaveDisabled(true);
      dispatch(clearSaveTripResponse());
    }
    if (saveTripStatus === 'FAILED') {
      setIsSaveDisabled(false);
      dispatch(clearSaveTripResponse());
    }
  }, [saveTripStatus]);

  useEffect(() => {
    if (shareViaEmail) {
      generatePDF();
    }
  }, [shareViaEmail]);

  useEffect(() => {
    return () => {
      setTripDetails({});
      setIsSaveDisabled(false);
    };
  }, [navigate]);

  // const getMarkerColor = (dayNumber: number) => {
  //   const colors = ['#FF5733', '#33A2FF'];
  //   return colors[dayNumber - 1] || '#FF5733';
  // };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = moment(startDate).format('DD MMM YYYY');
    const end = moment(endDate).format('DD MMM YYYY');
    return `${start} - ${end}`;
  };

  const formatDate = (dateStr: string) => {
    const date = moment(dateStr);
    return date.format('dddd, MMMM Do');
  };

  const getMarkerColor = (dayNumber: number) => {
    const colors = [
      '#FF5733',
      '#33A2FF',
      '#FFBD33',
      '#FAD02E',
      '#F28D35',
      '#F67D8B',
      '#6C5B7B',
      '#C06C84',
      '#355C7D',
      '#6B4226',
    ];
    return colors[dayNumber - 1] || '#FF5733';
  };

  const formatDateWithDayNumber = (dateStr: string, dayNumber: number) => {
    const date = moment(dateStr).add(dayNumber - 1, 'days');
    return `Day ${dayNumber} - ${date.format('dddd, MMMM Do')}`;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsEmailValid(validateEmail(inputEmail));
  };

  const handleDownload = () => {
    setShareViaEmail(false);
    generatePDF();
    setIsShareModalVisible(false);
  };

  const handleSendEmail = () => {
    setShareViaEmail(true);
    setIsShareModalVisible(false);
  };

  const onCloseShareModal = () => {
    setIsShareModalVisible(false);
    setShareViaEmail(false);
    setEmail('');
    setIsEmailValid(false);
  };

  const handleAccommodationSelect = (placeId: string, day: number) => {
    setAccommodations((prevAccommodations) => {
      const existingIndex = prevAccommodations.findIndex((accommodation) => accommodation.day === day);
      if (existingIndex !== -1) {
        const updatedAccommodations = [...prevAccommodations];
        updatedAccommodations[existingIndex] = { day, placeId };
        return updatedAccommodations;
      }
      // Add new entry
      return [...prevAccommodations, { day, placeId }];
    });
  };

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return { lat: data.latitude, lng: data.longitude };
    } catch (error) {
      console.error('Error fetching user location:', error);
      return { lat: 0, lng: 0 }; // Default to (0,0) in case of an error
    }
  };

  const generateGoogleMapsURL = (userLocation: { lat: number; lng: number }, destination: any) => {
    console.log('Destination', destination);
    // return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.Latitude},${destination.Longitude}`;
    return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(
      destination.DestinationName
    )}`;
  };

  const handleViewDirections = async (destination: any) => {
    const userLocation = await fetchUserLocation();
    const directionsURL = generateGoogleMapsURL(userLocation, destination);
    window.open(directionsURL, '_blank');
  };

  const handleSave = () => {
    const payload = {
      CityID: tripDetails?.CityID,
      TripName: tripName,
      StartDate: tripDetails?.StartDate,
      EndDate: tripDetails?.EndDate,
      TravelerID: user ? user.id : 4,
      Itineraries: tripDetails?.Itineraries.flatMap((itinerary: any) =>
        itinerary.destinations.map((dest: any) => ({
          DayNumber: itinerary.DayNumber,
          DestinationID: dest.DestinationID,
          OrderNumber: dest.OrderNumber,
          TimeFrom: dest.TimeFrom,
          TimeTo: dest.TimeTo,
        }))
      ),
      Accommodations: accommodations.map((acc) => ({
        DayNumber: acc.day,
        PlaceID: acc.placeId,
      })),
    };

    dispatch(saveTripRequest({ tripData: payload }));
    setIsSaveModalVisible(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const cityName = tripDetails?.City?.CityName || 'City';
    // const tripId = '123';

    const topPadding = 20;
    let yPosition = topPadding;

    doc.setFontSize(18); // Increase font size
    doc.setFont('helvetica', 'bold');
    doc.text(`Adventure in ${cityName}`, 10, yPosition);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    doc.text(`${cityName}, Sri Lanka`, 10, yPosition);

    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text('Crafted by Trek Seeker', 10, yPosition);

    yPosition += 20; // Initial position of Day

    tripDetails?.Itineraries.forEach((item: any) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Day ${item.DayNumber}`, 10, yPosition);

      const tableData = item.destinations.map((destination: any) => [
        `${destination.TimeFrom} - ${destination.TimeTo}`,
        destination.DestinationName,
        '',
        // destination.DestinationDescription || 'Description not available.',
        // destination.Cost || 'Cost not available.',
      ]);

      autoTable(doc, {
        theme: 'grid',
        startY: yPosition + 10, // 10 units below table
        // head: [['Time', 'Destination', 'Description', 'Budget Cost']],
        head: [['Time', 'Destination', 'Location Details']],
        body: tableData,
        didDrawCell: (data) => {
          // Check if we're in the "Location Details" column
          if (data.cell.text[0] !== 'Location Details' && data.column.index === 2) {
            const destination = item.destinations[data.row.index];
            const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              destination.DestinationName
            )}&ll=${destination.Latitude},${destination.Longitude}`;

            // Add a clickable link
            doc.setTextColor(0, 0, 255);
            doc.textWithLink('View Details', data.cell.x + 2, data.cell.y + data.cell.height / 2, {
              url: googleMapsURL,
            });
          }
        },
      });

      // yPosition 20 units below
      yPosition = (doc as any).lastAutoTable.finalY + 20;

      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = topPadding;
      }
    });

    // doc.save(`adventure-in-${cityName.toLowerCase().replace(/ /g, '-')}-trip${tripId}.pdf`);
    if (shareViaEmail) {
      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      formData.append('file', pdfBlob, `adventure-in-${cityName.toLowerCase().replace(/ /g, '-')}.pdf`);
      formData.append('to', email);

      fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Email sent successfully', data);
          message.success('Email sent successfully');
          setShareViaEmail(false);
          setEmail('');
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          message.error('Failed to send email');
          setShareViaEmail(false);
        });
    } else {
      doc.save(`adventure-in-${cityName.toLowerCase().replace(/ /g, '-')}.pdf`);
    }
  };

  const extractLastDestinationCoordinates = () => {
    if (!tripDetails?.Itineraries) return [];

    return tripDetails.Itineraries.map((itinerary: any) => {
      // const date = moment(tripDetails?.StartDate)
      //   .add(itinerary.DayNumber - 1, 'days')
      //   .format('YYYY-MM-DD');
      const lastDestination = itinerary.destinations[itinerary.destinations.length - 1];
      return {
        latitude: parseFloat(lastDestination?.Latitude),
        longitude: parseFloat(lastDestination?.Longitude),
        day: itinerary.DayNumber,
      };
    });
  };

  console.log('Trip Details', tripDetails);
  console.log('shareViaEmail', shareViaEmail);
  console.log('FEtch by ID', getTripByIdData);
  console.log('accommodations', accommodations);
  return (
    <div className="trip-show-container">
      <div className="content-column">
        <div className="content-part top-part">
          <div className="sticky-header">
            <div className="header-buttons">
              <Button
                icon={<ShareAltOutlined />}
                shape="round"
                type="primary"
                className="header-button"
                onClick={() => {
                  setIsShareModalVisible(true);
                }}
              >
                Share
              </Button>
              {!fromTripsPage && (
                <Button
                  icon={<SaveOutlined />}
                  shape="round"
                  type="primary"
                  className="header-button"
                  onClick={() => setIsSaveModalVisible(true)}
                  disabled={isSaveDisabled}
                >
                  {!isSaveDisabled ? 'Save trip' : 'Trip Saved'}
                </Button>
              )}
            </div>
          </div>
          <div className="image-overlay">
            <img src={tripDetails?.City?.CityImage} alt="Trip" className="trip-main-image" />
            <div className="image-info">
              <h2 className="city-name">{tripDetails?.City?.CityName}</h2>
              <div className="date-info">
                <span className="date-range">{formatDateRange(tripDetails?.StartDate, tripDetails?.EndDate)}</span>
                {/* <span className="duration-tag">2 days</span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="content-part bottom-part">
          <Tabs type="card" style={{ width: '100%' }} defaultActiveKey="2">
            {' '}
            <TabPane tab="About City" key="1" className="about-city-panel">
              {/* City Content*/}
              <p className="about-city-topic">About {tripDetails?.City?.CityName}</p>
              <p className="about-city-description">
                {tripDetails?.City?.CityDescription || 'City description not available.'}
              </p>
            </TabPane>
            <TabPane tab="Itinerary" key="2">
              {/* Itinerary Content */}
              <Collapse defaultActiveKey={['0']} style={{ borderRadius: '8px' }}>
                {tripDetails?.Itineraries?.map((item: any, index: number) => (
                  <Panel
                    // header={`${formatDateWithDayNumber(tripDetails?.StartDate, item.DayNumber)}`}
                    header={
                      <div className="panel-header">
                        <FaLocationDot style={{ color: getMarkerColor(item.DayNumber), marginRight: '8px' }} />
                        {formatDateWithDayNumber(tripDetails?.StartDate, item.DayNumber)}
                      </div>
                    }
                    key={index}
                    className="itinerary-item-details"
                  >
                    {item.destinations.length ? (
                      <div className="destination-cards">
                        {item.destinations
                          .slice()
                          .sort((a: any, b: any) => a.OrderNumber - b.OrderNumber)
                          .map((destination: any, destIndex: number) => (
                            <Card
                              key={destIndex}
                              className="destination-card"
                              cover={<img alt="destination" src={destination?.Image} className="destination-image" />}
                            >
                              <Card.Meta
                                className="destination-card-description"
                                // title={destination.DestinationName}
                                title={
                                  <div className="destination-card-title">
                                    <div
                                      style={{
                                        backgroundColor: getMarkerColor(item.DayNumber),
                                      }}
                                      className="destination-card-title-number"
                                    >
                                      {destination.OrderNumber}
                                    </div>
                                    <span>{destination.DestinationName}</span>
                                  </div>
                                }
                                description={destination.Description || 'Description not available.'}
                              />
                              <div className="destination-times">
                                <Tag color="blue">{`${destination.TimeFrom} - ${destination.TimeTo}`}</Tag>
                                <Button type="link" onClick={() => handleViewDirections(destination)}>
                                  View Directions
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="no-destination-message">
                        <CiFaceFrown className="no-destination-message-icon" />
                        <span>Oh no! It looks like we don’t have enough data right now. Check Back Later!</span>
                      </div>
                    )}
                  </Panel>
                )) || <></>}
              </Collapse>
            </TabPane>
            {!(fromTripsPage && tripDetails?.Accommodations?.length < 1) && (
              <TabPane tab="Accommodations" key="3">
                <Accommodations
                  accommodationDetails={tripDetails?.Accommodations || []}
                  destinationsCoords={extractLastDestinationCoordinates()}
                  onAccommodationSelect={handleAccommodationSelect}
                  tripStartDate={tripDetails.StartDate}
                  isSaveDisabled={isSaveDisabled}
                  fromTripsPage={fromTripsPage}
                  city={tripDetails?.City?.CityName}
                />
              </TabPane>
            )}
          </Tabs>
        </div>
      </div>
      <div className="map-column">
        {/* Map */}
        <TripMap tripDetails={tripDetails} />

        <Modal
          title="Share Trip"
          visible={isShareModalVisible}
          onCancel={onCloseShareModal}
          footer={null}
          className="custom-modal"
        >
          <div className="modal-content">
            <Card className="share-card">
              <div
                className="option"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <h3>Download</h3>
                  <p>Export trip summary as PDF</p>
                </div>
                <DownloadOutlined style={{ fontSize: '24px' }} onClick={handleDownload} />
              </div>
            </Card>
            <Card className="share-card" style={{ marginTop: '16px' }}>
              <h3>Share via Email</h3>
              <p>Share trip summary among your loved ones ❤️</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChange={handleEmailChange}
                  style={{ marginRight: '8px', flex: 1 }}
                />
                <Button type="primary" icon={<MailOutlined />} disabled={!isEmailValid} onClick={handleSendEmail} />
              </div>
              {!isEmailValid && email && <p style={{ color: 'red' }}>Please enter a valid email address.</p>}
            </Card>
          </div>
        </Modal>

        <Modal
          title="Save Trip"
          visible={isSaveModalVisible}
          onOk={handleSave}
          okText="Save Trip"
          onCancel={() => setIsSaveModalVisible(false)}
          className="custom-modal"
        >
          <div className="modal-content">
            <Input placeholder="Enter Trip Name" value={tripName} onChange={(e) => setTripName(e.target.value)} />
          </div>
        </Modal>
      </div>
    </div>
  );
};
