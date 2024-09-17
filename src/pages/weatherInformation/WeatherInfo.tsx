import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Card, Row, Col, Typography, message } from 'antd';
import { Footer } from '../../components/footer/Footer';
import './WeatherInfo.scss';
import { isMobile } from 'react-device-detect';

const { Title, Text } = Typography;

export const WeatherInfo: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    fetchLocationFromIP();
  }, []);

  const fetchWeatherData = async (city: string) => {
    if (!city) return;

    setLoading(true);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      // Unique dates
      const forecastList = forecastResponse?.data?.list;
      const uniqueDates = new Set<string>();
      const filteredForecast = forecastList.filter((item: any) => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        if (!uniqueDates.has(date)) {
          uniqueDates.add(date);
          return true;
        }
        return false;
      });

      setForecast(filteredForecast.slice(1, 6));

      const hourlyResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${weatherResponse?.data?.coord?.lat}&lon=${weatherResponse?.data?.coord?.lon}&exclude=minutely,daily&appid=${apiKey}&units=metric`
      );
      setHourly(hourlyResponse?.data?.hourly.slice(0, 6));
    } catch (error: any) {
      console.error(error);
      message.error(capitalizeFirstLetter(error.response?.data?.message || 'An error occurred!'));
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationFromIP = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      const { city } = response.data;
      fetchWeatherData(city);
    } catch (error) {
      console.error('Error fetching location:', error);
      message.error('Failed to get location!');
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="main-content">
      <div className="weather-info-container">
        <div className="weather-info-header">
          <Title level={2} className="weather-info-title">
            Weather Information
          </Title>
          <div className="search-bar">
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onPressEnter={() => fetchWeatherData(city)}
              size={isMobile ? 'middle' : 'large'}
              className="search-input"
            />
            <Button
              type="primary"
              onClick={() => fetchWeatherData(city)}
              loading={loading}
              size="large"
              className="search-button"
            >
              Search
            </Button>
          </div>
        </div>

        {weather && (
          <div className="current-weather-container">
            <Card className="current-weather" title="Current Weather">
              <Row gutter={16} align="middle" justify="center">
                {/* <Col span={8}>
                  <div className="weather-icon">
                    <img
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                      alt={weather.weather[0].description}
                    />
                  </div>
                </Col> */}
                <Col span={24}>
                  <Title level={3}>{weather.name}</Title>
                  <Text>Temperature: {weather.main.temp}°C</Text>
                  <br />
                  <Text>Feels like: {weather.main.feels_like}°C</Text>
                  <br />
                  <Text>Weather: {capitalizeFirstLetter(weather.weather[0].description)}</Text>
                  <br />
                  <Text>Humidity: {weather.main.humidity}%</Text>
                  <br />
                  <Text>Wind Speed: {weather.wind.speed} m/s</Text>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {forecast.length > 0 && (
          <Card className="forecast" title="5-Day Forecast">
            <Row gutter={[15, 16]} justify="space-between">
              {forecast.map((item: any) => (
                <Col xs={12} md={4} key={item.dt}>
                  <Card className="forecast-card">
                    <div className="forecast-icon">
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                      />
                    </div>
                    <Text>{new Date(item.dt_txt).toLocaleDateString()}</Text>
                    <br />
                    <Text>Temp: {item.main.temp}°C</Text>
                    <br />
                    <Text>Weather: {capitalizeFirstLetter(item.weather[0].description)}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {hourly.length > 0 && (
          <Card className="hourly-forecast" title="Hourly Forecast">
            <Row gutter={[16, 16]} justify="space-between">
              {hourly.map((item: any) => (
                <Col xs={12} md={4} key={item.dt}>
                  <Card className="hourly-card">
                    <div className="hourly-icon">
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                      />
                    </div>
                    <Text>{new Date(item.dt * 1000).toLocaleTimeString()}</Text>
                    <br />
                    <Text>Temp: {item.temp}°C</Text>
                    <br />
                    <Text>Weather: {capitalizeFirstLetter(item.weather[0].description)}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </div>
      {hourly.length > 0 && <Footer />}
    </div>
  );
};
