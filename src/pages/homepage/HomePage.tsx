import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { Button, Input, Card, Row, Col } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaRoute, FaMapMarkedAlt, FaSearchLocation, FaPassport } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { isMobile } from 'react-device-detect';
import { Footer } from '../../components/footer/Footer';
import heroImage from '../../assets/images/heroImage.jpg';
import featureDestNew from '../../assets/images/featureDestNew.jpg';
import kandyImage from '../../assets/images/kandy_image.jpg';
import dealsImage from '../../assets/images/dealsImage.jpg';
import dealCard from '../../assets/images/dealsImageCard.jpg';
import dealCardNY from '../../assets/images/dealsImageCard2.jpg';
import dealCardPR from '../../assets/images/dealsImageCard3.jpg';
import dealCardAU from '../../assets/images/dealsImageCard4.jpg';
import dealCardSW from '../../assets/images/dealsImageCard5.jpg';
import dealCardSL from '../../assets/images/dealsImageCard6.png';
import exploreCardUAE from '../../assets/images/exploreCard.jpg';
import exploreCardBali from '../../assets/images/exploreCardBali.jpg';

import './HomePage.scss';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: isMobile ? 1 : 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
};

const mockCards = [
  {
    cityName: 'Paris, France',
    dealHeading: 'Romantic Getaway',
    rating: '9.8',
    reviews: 456,
    price: 580,
    perNight: 290,
    discount: 28,
    imageSrc: dealCardPR, // Replace with the correct image path
  },
  {
    cityName: 'Yala, Sri Lanka',
    dealHeading: 'Wildlife Exploration',
    rating: '9.6',
    reviews: 342,
    price: 350,
    perNight: 175,
    discount: 20,
    imageSrc: dealCardSL, // Replace with the correct image path
  },
  {
    cityName: 'New York, United States',
    dealHeading: 'Urban Adventure',
    rating: '9.4',
    reviews: 512,
    price: 600,
    perNight: 300,
    discount: 18,
    imageSrc: dealCardNY, // Replace with the correct image path
  },
  {
    cityName: 'Sydney, Australia',
    dealHeading: 'Beach and Surf',
    rating: '9.7',
    reviews: 678,
    price: 560,
    perNight: 280,
    discount: 25,
    imageSrc: dealCardAU, // Replace with the correct image path
  },
  {
    cityName: 'Lucerne, Switzerland',
    dealHeading: 'Scenic Exploration',
    rating: '9.3',
    reviews: 421,
    price: 499,
    perNight: 250,
    discount: 15,
    imageSrc: dealCardSW, // Replace with the correct image path
  },
];

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // const handleUsername = (e: any) => {
  //   setEmail(e.target.value);
  // };

  // const handlePassword = (e: any) => {
  //   setPassword(e.target.value);
  // };

  // const handleLogin = () => {
  //   const credentialsObj = { Email: email, Password: password };
  //   dispatch(loginUserRequest(credentialsObj));
  // };

  return (
    <div>
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Plan Your Next Dream Vacation</h1>
          <p>One Stop Platform | Personalized Itineraries</p>
          <Button
            type="primary"
            className="create-trip-button"
            icon={<FaRoute style={{ marginRight: '5px' }} />}
            size="large"
            onClick={() => {
              navigate('/new-trip');
            }}
          >
            Start Journey
          </Button>
        </div>
      </div>
      {/* Features Section */}
      <div className="features-section">
        <h2>Everything At Your Fingertips</h2>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <div className="feature-item" data-aos="zoom-in">
              <div className="feature-icon">
                <FaMapMarkedAlt size={50} />
              </div>
              <h3>Explore Destinations</h3>
              <p>Discover hidden gems and popular spots around the world.</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-item" data-aos="zoom-in" data-aos-delay="200">
              <div className="feature-icon">
                <FaSearchLocation size={50} />
              </div>
              <h3>Personalized Itineraries</h3>
              <p>ML-Powered itineraries tailored specifically to your interests.</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-item" data-aos="zoom-in" data-aos-delay="400">
              <div className="feature-icon">
                <FaPassport size={50} />
              </div>
              <h3>Seamless Planning</h3>
              <p>Book and plan your trip with ease and confidence, all in one place.</p>
            </div>
          </Col>
        </Row>
      </div>

      {/* <div className="testimonials-section">
        <h2>What Other Travelers Say</h2>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <div className="testimonial-card" data-aos="fade-up">
              <div className="testimonial-avatar">
                <img src={dealCard} alt="User Avatar" />
              </div>
              <div className="testimonial-content">
                <p>"This platform made planning my vacation so easy! Highly recommend it."</p>
                <h4>- John Doe</h4>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-avatar">
                <img src="path/to/avatar2.jpg" alt="User Avatar" />
              </div>
              <div className="testimonial-content">
                <p>"I loved the personalized itinerary, it was perfect for my family."</p>
                <h4>- Jane Smith</h4>
              </div>
            </div>
          </Col>
        </Row>
      </div> */}
      {/* Deals and Packages Section */}
      <div className="deals-section">
        <h2>Exclusive Deals and Packages</h2>
        <div className="deal-card-container">
          <div className="deal-card" data-aos="zoom-in">
            <img src={dealsImage} alt="Deal" className="main-image" />
            <div className="overlay"></div>
            <div className="deal-content">
              <h3>Summer Special</h3>
              <p>Save big on your next summer vacation with our exclusive deals.</p>
            </div>
          </div>
          <div className="small-cards">
            <Slider {...settings}>
              {mockCards.map((card, index) => (
                <div className="small-card" data-aos="fade-left">
                  <img src={card.imageSrc} alt={`${card.cityName} Deal`} className="card-image" />
                  <div className="card-content">
                    <h4 className="card-city">{card.cityName}</h4>
                    <p className="card-name">{card.dealHeading}</p>
                    <div className="card-rating">
                      <span className="rating-tag">{card.rating}</span>
                      <span className="rating-details">{`Excellent (${card.reviews} reviews)`}</span>
                    </div>
                    <div className="card-price">
                      <span className="price">{`$${card.price}`}</span>
                      <span className="per-night">{`for 2 nights | $${card.perNight} per night`}</span>
                    </div>
                    <span className="discount-tag">{`${card.discount}% off`}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Explore Destinations Section */}
      <div className="explore-section">
        <h2>Explore Top Destinations</h2>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <div className="explore-card" data-aos="fade-right">
              <img src={kandyImage} alt="Destination" />
              <div className="explore-overlay">
                <h3>Kandy, Sri Lanka</h3>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="explore-card" data-aos="fade-right">
              <img src={dealCard} alt="Destination" />
              <div className="explore-overlay">
                <h3>London, England</h3>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="explore-card" data-aos="fade-right">
              <img src={exploreCardUAE} alt="Destination" />
              <div className="explore-overlay">
                <h3>Dubai, UAE</h3>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="explore-card" data-aos="fade-right">
              <img src={exploreCardBali} alt="Destination" />
              <div className="explore-overlay">
                <h3>Bali, Indonesia</h3>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </div>
  );
};
