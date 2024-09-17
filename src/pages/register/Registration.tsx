import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import { getAllCountries } from 'rc-geographic';

import {
  registerTravelerRequest,
  clearAddTravelersResponse,
  registerTravelersSelector,
} from '../../redux/slices/travelers/registerTravelerSlice';

import { Input, Button, Typography, Divider, Layout, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, FlagOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { FaMapLocationDot } from 'react-icons/fa6';
import logo from '../../assets/images/logo.png';

import './Registration.scss';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { MainHeader } from '../../components/header/MainHeader';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

type RegisterForm = {
  firstName: string;
  lastName: string;
  country: string;
  gender?: string;
  email: string;
  password: string;
};

export const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { addTravelerData, addTravelerStatus, addTravelerError } = useAppSelector(registerTravelersSelector);

  const [messageApi, contextHolder] = message.useMessage();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [countryList, setCountryList] = useState<any>([]);
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    country: '',
    gender: undefined,
    email: '',
    password: '',
  });

  useEffect(() => {
    if (addTravelerStatus === 'SUCCESS') {
      messageApi.success('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else if (addTravelerStatus === 'FAILED') {
      messageApi.error(addTravelerError || 'An unknown error occured');
    }
    dispatch(clearAddTravelersResponse());
  }, [addTravelerStatus]);

  useEffect(() => {
    const countries = getAllCountries();
    setCountryList(countries);

    axios
      .get('https://ipapi.co/json/')
      .then((response) => {
        const data = response.data;
        if (data && data.country_name) {
          setCountry(data.country_name);
          setRegisterForm((prevForm) => ({
            ...prevForm,
            country: data.country_name,
          }));
        }
      })
      .catch((error) => {
        console.error('Error fetching the country:', error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleCountryChange = (value: string) => {
    setRegisterForm((prevForm) => ({
      ...prevForm,
      country: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setRegisterForm((prevForm: any) => ({
      ...prevForm,
      gender: value,
    }));
  };

  const handleRegister = () => {
    const { firstName, lastName, country, email, password, gender } = registerForm;
    if (firstName && lastName && country && email && password) {
      let obj = {
        FirstName: firstName,
        LastName: lastName,
        Country: country,
        Gender: gender,
        Email: email,
        Password: password,
      };

      dispatch(registerTravelerRequest({ travelerData: obj }));
    } else {
      messageApi.error('Please fill in all required fields.');
    }
  };

  console.log('registerForm', registerForm);
  console.log('countryList', countryList);
  console.log('addTravelerError?.message', addTravelerError);

  return (
    <Layout>
      <Header className="header">
        <MainHeader loginpage={false} />
      </Header>
      {contextHolder}
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <FaMapLocationDot className="register-icon" />
            <Title level={2} className="register-title">
              Register
            </Title>
            <Paragraph className="register-subtitle">
              Embark on new journeys: Create an Account to Unlock New Adventures!
            </Paragraph>
          </div>
          <div className="register-form">
            <div className="register-form-item">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <Input
                id="firstName"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First Name"
                value={registerForm.firstName}
                size="large"
                onChange={handleInputChange}
              />
            </div>
            <div className="register-form-item">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <Input
                id="lastName"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Last Name"
                value={registerForm.lastName}
                size="large"
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="register-form-item">
              <label htmlFor="country">
                Country <span className="required">*</span>
              </label>
              <Input
                id="country"
                prefix={<FlagOutlined className="site-form-item-icon" />}
                placeholder="Country"
                value={registerForm.country}
                size="large"
                onChange={handleInputChange}
              />
            </div> */}
            <div className="register-form-item">
              <label htmlFor="country">
                Country <span className="required">*</span>
              </label>
              <Select
                id="country"
                placeholder="Select Country"
                value={registerForm.country}
                size="large"
                showSearch
                onChange={handleCountryChange}
                filterOption={(input, option) => {
                  const countryName = option?.value as string | React.ReactNode;
                  return typeof countryName === 'string'
                    ? countryName.toLowerCase().includes(input.toLowerCase())
                    : false;
                }}
              >
                {countryList.map((country: any) => (
                  <Option key={country.iso2} value={country.name}>
                    <span className={`fi fi-${country.iso2.toLowerCase()} fis`} style={{ marginRight: '8px' }}></span>
                    {country.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="register-form-item">
              <label htmlFor="gender">
                Gender <span className="optional">(Optional)</span>
              </label>
              <Select
                id="gender"
                placeholder="Select Gender"
                value={registerForm.gender}
                size="large"
                onChange={handleGenderChange}
                className="gender-select"
                allowClear
              >
                <Option value="male">
                  <ManOutlined /> Male
                </Option>
                <Option value="female">
                  <WomanOutlined /> Female
                </Option>
                <Option value="other">Other</Option>
              </Select>
            </div>
            <div className="register-form-item">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <Input
                id="email"
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                value={registerForm.email}
                size="large"
                onChange={handleInputChange}
              />
            </div>
            <div className="register-form-item">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <Input.Password
                id="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
                value={registerForm.password}
                onChange={handleInputChange}
              />
            </div>
            <Button type="primary" className="register-form-button" onClick={handleRegister}>
              Register
            </Button>
            <Divider />
            <div className="login-link">
              Already have an account?{' '}
              <a
                onClick={() => {
                  navigate('/login');
                }}
              >
                Sign in!
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
