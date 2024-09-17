import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { useNavigate } from 'react-router-dom';
import { Select, DatePicker, Tag, Button, Typography, Slider, Radio, message } from 'antd';
import {
  createTripRequest,
  createTripSelector,
  clearCreateTripResponse,
} from '../../redux/slices/trips/createTripSlice';
import { Footer } from '../../components/footer/Footer';
import {
  EnvironmentOutlined,
  BankOutlined,
  PictureOutlined,
  RocketOutlined,
  SmileOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  RestOutlined,
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import './CreateTrip.scss';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const CreateTrip = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createTripForm, setCreateTripForm] = useState<any>({
    budget: 1,
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { createTripStatus } = useAppSelector(createTripSelector);

  // useEffect(() => {
  //   setSelectedInterests([]);
  //   setCreateTripForm({});
  // }, []);

  useEffect(() => {
    if (createTripStatus === 'SUCCESS') {
      navigate('/trip');
    }
  }, [createTripStatus, navigate]);

  const handleCityChange = (value: string) => {
    setCreateTripForm((prevState: any) => ({ ...prevState, cityID: value }));
  };

  const handleDateChange = (dates: any) => {
    if (dates) {
      setCreateTripForm((prevState: any) => ({
        ...prevState,
        startDate: dates[0]?.format('YYYY-MM-DD'),
        endDate: dates[1]?.format('YYYY-MM-DD'),
      }));
    }
  };

  const handleBudgetChange = (value: number) => {
    setCreateTripForm((prevState: any) => ({ ...prevState, budget: value + 1 }));
  };

  const handleTravelerCategoryChange = (e: any) => {
    setCreateTripForm((prevState: any) => ({ ...prevState, travelerCategory: e.target.value }));
  };

  const handleAgeCategoryChange = (e: any) => {
    setCreateTripForm((prevState: any) => ({ ...prevState, ageCategory: e.target.value }));
  };

  const handleGenderChange = (e: any) => {
    setCreateTripForm((prevState: any) => ({ ...prevState, gender: e.target.value }));
  };

  const interests = [
    { label: 'Historical', value: 'Historical', icon: <BankOutlined /> },
    { label: 'Art & Cultural', value: 'Art_Cultural', icon: <EnvironmentOutlined /> },
    { label: 'Nature & Wildlife', value: 'Nature_Wildlife', icon: <PictureOutlined /> },
    { label: 'Outdoor Activites, Hiking & Adventure', value: 'Adventure_Hiking', icon: <RocketOutlined /> },
    { label: 'Kid Friendly', value: 'Kid_friendly', icon: <SmileOutlined /> },
    { label: 'Scenic', value: 'Scenic_Viewpoints', icon: <EyeOutlined /> },
    { label: 'Shopping & Local Markets', value: 'Shopping_Local', icon: <ShoppingCartOutlined /> },
    { label: 'Relaxation & Wellness', value: 'Relaxation_Wellness', icon: <RestOutlined /> },
    { label: 'Religious', value: 'Religious', icon: <BankOutlined /> },
  ];

  const toggleInterest = (interestValue: string) => {
    if (selectedInterests.includes(interestValue)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interestValue));
    } else {
      setSelectedInterests([...selectedInterests, interestValue]);
    }
  };

  const validateForm = () => {
    const { cityID, startDate, endDate, travelerCategory, ageCategory, gender } = createTripForm;

    if (!cityID || !startDate || !endDate || !travelerCategory || !ageCategory || !gender) {
      if (selectedInterests.length === 0) {
        message.warning('Please fill all details and select at least one interest.');
      } else {
        message.warning('Please fill all details.');
      }
      return false;
    }

    if (selectedInterests.length === 0) {
      message.warning('Select at least one interest.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // const mockData = {
    //   cityID: 2,
    //   userInterests: ['Cultural', 'Historical', 'Nature'],
    //   budget: 3,
    //   startDate: '2024-07-21',
    //   endDate: '2024-07-22',
    //   travelerCategory: 1,
    // };

    // const obj = {
    //   ...createTripForm,
    //   userInterests: selectedInterests,
    // };

    // dispatch(createTripRequest(obj));
    if (validateForm()) {
      const obj = {
        ...createTripForm,
        userInterests: selectedInterests,
      };
      dispatch(createTripRequest(obj));
    }
  };

  console.log('selectedInterests', selectedInterests);
  console.log('trip form', createTripForm);

  return (
    <div className="main-content">
      <div className="create-trip-page-content">
        <Title level={2} className="title">
          Craft your next adventure
        </Title>

        <div className="form-group">
          <label>Where do you want to go? </label>
          <Select
            size="large"
            placeholder="Select a city"
            className="select-city"
            showSearch
            allowClear
            onChange={handleCityChange}
          >
            <Option value="2">Kandy</Option>
            <Option value="1">Colombo</Option>
            <Option value="3">Nuwara Eliya</Option>
            <Option value="4">Galle</Option>
          </Select>
        </div>

        <div className="form-group">
          <label>Trip Dates</label>
          <RangePicker size="large" className="date-picker" onChange={handleDateChange} />
        </div>

        <div className="form-group">
          <label>Select your preferences/interests</label>
          <div className="tags-container">
            {interests.map((interest) => (
              <Tag
                key={interest.label}
                className={`interest-tag ${selectedInterests.includes(interest.value) ? 'selected-tag' : ''}`}
                onClick={() => toggleInterest(interest.value)}
              >
                {interest.icon} {interest.label}
              </Tag>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Budget</label>
          <Slider
            marks={{ 0: 'Cheap', 1: 'Medium', 2: 'High' }}
            min={0}
            max={2}
            step={1}
            tipFormatter={(value) => (value === undefined ? '' : ['Cheap', 'Medium', 'High'][value])}
            onChange={handleBudgetChange}
          />
        </div>

        <div className="form-group">
          <label>Age Category</label>
          <Radio.Group className="horizontal-radio-group" onChange={handleAgeCategoryChange}>
            <Radio value="18-24">18-24</Radio>
            <Radio value="25-35">25-35</Radio>
            <Radio value="36-45">36-45</Radio>
            <Radio value="46-60">46-60</Radio>
          </Radio.Group>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <Radio.Group className="horizontal-radio-group" onChange={handleGenderChange}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </div>

        <div className="form-group">
          <label>Traveler Category</label>
          <Radio.Group className="horizontal-radio-group" onChange={handleTravelerCategoryChange}>
            <Radio value="Solo">
              <UserOutlined /> Solo
            </Radio>
            <Radio value="Couple">
              <HeartOutlined /> Couple
            </Radio>
            <Radio value="Group">
              <TeamOutlined /> Group
            </Radio>
          </Radio.Group>
        </div>

        <Button type="primary" className="continue-button" onClick={handleSubmit}>
          Create New Trip
        </Button>

        <div className="floating-icons">
          <RocketOutlined className="floating-icon" />
          <SmileOutlined className="floating-icon" />
          <ShoppingCartOutlined className="floating-icon" />
          <PictureOutlined className="floating-icon" />
          <HeartOutlined className="floating-icon" />
          <EnvironmentOutlined className="floating-icon" />
        </div>
      </div>
      <Footer />
    </div>
  );
};
