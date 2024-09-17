import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Rate, Select } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoid2hpdGUtdGFuZ2VudCIsImEiOiJjbTA0djdjcm4wYmFwMmlwdTYyaHNta2ZpIn0.uOHl1aUz_vzRahvsInL0Kw';

interface Destination {
  DestinationID: string;
  Longitude: string;
  Latitude: string;
  DestinationName: string;
  OrderNumber: number;
  Rating: number;
  Image: string;
}

interface Itinerary {
  DayNumber: number;
  StartDate: string;
  destinations: Destination[];
}

interface TripMapProps {
  tripDetails: any;
}

const TripMap: React.FC<TripMapProps> = ({ tripDetails }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | 'all' | null>('all');
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 13,
  });
  const [viewStateReady, setViewStateReady] = useState(false);

  useEffect(() => {
    if (tripDetails?.Itineraries) {
      const destinations = tripDetails.Itineraries.flatMap((itinerary: Itinerary) => itinerary.destinations);

      // if (destinations.length > 0) {
      //   const longitudes = destinations.map((d: Destination) => parseFloat(d.Longitude));
      //   const latitudes = destinations.map((d: Destination) => parseFloat(d.Latitude));

      //   const minLongitude = Math.min(...longitudes);
      //   const maxLongitude = Math.max(...longitudes);
      //   const minLatitude = Math.min(...latitudes);
      //   const maxLatitude = Math.max(...latitudes);

      //   const centerLongitude = (minLongitude + maxLongitude) / 2;
      //   const centerLatitude = (minLatitude + maxLatitude) / 2;

      //   // Zoom level calculation
      //   const zoomLevel = Math.min(
      //     13,
      //     Math.max(2, 15 - Math.log2(Math.max(maxLongitude - minLongitude, maxLatitude - minLatitude)) * 5)
      //   );

      //   setViewState({
      //     longitude: centerLongitude,
      //     latitude: centerLatitude,
      //     zoom: zoomLevel,
      //   });

      //   setViewStateReady(true);
      // }
      if (destinations.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();

        destinations.forEach((destination: Destination) => {
          const longitude = parseFloat(destination.Longitude);
          const latitude = parseFloat(destination.Latitude);
          bounds.extend([longitude, latitude]);
        });

        // Fit all destinations in intial view
        if (map) {
          map.fitBounds(bounds, { padding: 100 });
        }
      }

      // setViewStateReady(true);
    }
  }, [tripDetails, map]);

  const getMarkerColor = (dayNumber: number) => {
    // const colors = ['#FF5733', '#33A2FF'];
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

  const getDateForDay = (startDate: string, dayNumber: number) => {
    return moment(startDate)
      .add(dayNumber - 1, 'days')
      .format('dddd, MMMM Do');
  };

  const formatDate = (dateStr: string) => {
    const date = moment(dateStr);
    return date.format('dddd, MMMM Do');
  };

  const handleMapLoad = (event: any) => {
    setMap(event.target);
  };

  const fetchDirections = async (coordinates: [number, number][]) => {
    const waypoints = coordinates.map((coord) => coord.join(',')).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates;
      } else {
        console.error('No routes found in API response');
        return [];
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      return [];
    }
  };

  const updateRouteOnMap = async (destinations: Destination[], dayNumber: number) => {
    if (destinations.length < 2) return;

    const coordinates: [number, number][] = destinations.map((d) => [parseFloat(d.Longitude), parseFloat(d.Latitude)]);

    const routeCoordinates = await fetchDirections(coordinates);

    if (map) {
      if (map.getLayer('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      const routeColor = getMarkerColor(dayNumber);

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          // 'line-color': '#3887be',
          'line-color': routeColor,
          'line-width': 5,
        },
      });
    }
  };

  const handleMarkerClick = (destination: Destination, dayNumber: number) => {
    if (selectedDay === dayNumber) {
      setSelectedDay('all');
      if (map) {
        if (map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }
      }
    } else {
      setSelectedDay(dayNumber);
      const dayDestinations =
        tripDetails.Itineraries.find((itinerary: Itinerary) => itinerary.DayNumber === dayNumber)?.destinations || [];
      updateRouteOnMap(dayDestinations, dayNumber);
    }
    setPopupInfo({
      destinationName: destination.DestinationName,
      dayNumber,
      date: getDateForDay(tripDetails.StartDate, dayNumber),
      longitude: parseFloat(destination.Longitude),
      latitude: parseFloat(destination.Latitude),
      image: destination.Image,
      rating: destination.Rating,
    });
  };

  const handleDaySelection = async (value: number | 'all') => {
    setSelectedDay(value);

    if (map && map.getLayer('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    if (value !== 'all') {
      const dayDestinations =
        tripDetails.Itineraries.find((itinerary: Itinerary) => itinerary.DayNumber === value)?.destinations || [];
      console.log('dayDestinations', dayDestinations);
      if (dayDestinations.length > 1) {
        updateRouteOnMap(dayDestinations, value as number);
      }
    }
  };

  console.log('tripDetails', tripDetails);

  return (
    <>
      {/* <div style={{ position: 'absolute', top: 110, right: 10, zIndex: 1 }}>
        <Select value={selectedDay} style={{ width: 200 }} placeholder="Select a day" onChange={handleDaySelection}>
          <Select.Option value="all">All Days</Select.Option>
          {tripDetails.Itineraries?.map((itinerary: Itinerary) => (
            // <Select.Option key={itinerary.DayNumber} value={itinerary.DayNumber}>
            //   {getDateForDay(tripDetails.StartDate, itinerary.DayNumber)}
            // </Select.Option>
            <Select.Option key={itinerary.DayNumber} value={itinerary.DayNumber}>
              Day {itinerary.DayNumber}
            </Select.Option>
          ))}
        </Select>
      </div> */}

      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 30,
          zIndex: 1,
          padding: '10px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Toggle Route View</div>
        <Select value={selectedDay} style={{ width: 160 }} placeholder="Select a day" onChange={handleDaySelection}>
          <Select.Option value="all">All Days</Select.Option>
          {/* {tripDetails.Itineraries?.map((itinerary: Itinerary) => (
            // <Select.Option key={itinerary.DayNumber} value={itinerary.DayNumber}>
            //   {getDateForDay(tripDetails.StartDate, itinerary.DayNumber)}
            // </Select.Option>
            <Select.Option key={itinerary.DayNumber} value={itinerary.DayNumber}>
              Day {itinerary.DayNumber}
            </Select.Option>
          ))} */}
          {tripDetails.Itineraries?.filter((itinerary: any) => itinerary.destinations.length > 0).map(
            (itinerary: Itinerary) => (
              <Select.Option key={itinerary.DayNumber} value={itinerary.DayNumber}>
                Day {itinerary.DayNumber}
              </Select.Option>
            )
          )}
        </Select>
      </div>

      <Map
        initialViewState={viewState}
        style={{ width: '100%', height: '100%' }}
        // mapStyle="mapbox://styles/mapbox/streets-v11"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={handleMapLoad}
      >
        {tripDetails?.Itineraries?.map((itinerary: Itinerary) =>
          itinerary.destinations.map(
            (destination: Destination) =>
              (selectedDay === 'all' || selectedDay === itinerary.DayNumber) && (
                <Marker
                  key={destination.DestinationID}
                  longitude={parseFloat(destination.Longitude)}
                  latitude={parseFloat(destination.Latitude)}
                  color={getMarkerColor(itinerary.DayNumber)}
                >
                  <div
                    style={{
                      backgroundColor: getMarkerColor(itinerary.DayNumber),
                      color: 'white',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => handleMarkerClick(destination, itinerary.DayNumber)}
                    onMouseEnter={() =>
                      setPopupInfo({
                        destinationName: destination.DestinationName,
                        dayNumber: itinerary.DayNumber,
                        date: getDateForDay(tripDetails.StartDate, itinerary.DayNumber),
                        longitude: parseFloat(destination.Longitude),
                        latitude: parseFloat(destination.Latitude),
                        image: destination.Image,
                        rating: destination.Rating,
                      })
                    }
                    onMouseLeave={() => setPopupInfo(null)}
                  >
                    {destination.OrderNumber}
                  </div>
                </Marker>
              )
          )
        )}

        {/* {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeButton={false}
              onClose={() => setPopupInfo(null)}
              anchor="bottom"
            >
              <div>
                <strong>{popupInfo.destinationName}</strong>
                <br />
                Day {popupInfo.dayNumber}
                <br />
                {popupInfo.date}
              </div>
            </Popup>
          )} */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeButton={false}
            onClose={() => setPopupInfo(null)}
            anchor="bottom"
            style={{ padding: '0', margin: '0', border: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                padding: '12px',
                width: '200px',
              }}
            >
              {popupInfo.image && (
                <img
                  src={popupInfo.image}
                  alt={popupInfo.destinationName}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                />
              )}

              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#333' }}>{popupInfo.destinationName}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <div>Day {popupInfo.dayNumber}</div>
                  <div>{popupInfo.date}</div>
                </div>
              </div>
              <Rate disabled allowHalf value={popupInfo.rating} style={{ marginTop: '8px' }} />
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default TripMap;
