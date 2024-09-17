import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks/hooks';
import {
  getTravelerByIdRequest,
  getTravelerSelector,
  clearGetTravelerByIdResponse,
} from '../../redux/slices/travelers/getTravelerByIdSlice';
import {
  updateTravelerRequest,
  editTravelersSelector,
  clearEditTravelersResponse,
} from '../../redux/slices/travelers/editTravelersSlice';
import { AuthPropType, useAuth } from '../../components/authProvider/AuthProvider';
import { getAllCountries } from 'rc-geographic';
import { Typography, Row, Col, Button, Modal, Form, Input, Alert, Select, message, Spin } from 'antd';
import { EditOutlined, UserOutlined, MailOutlined, GlobalOutlined, ManOutlined } from '@ant-design/icons';
import { RiLockPasswordLine } from 'react-icons/ri';
import './UserProfilePage.scss';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import bcrypt from 'bcryptjs';
import { isMobile } from 'react-device-detect';

import ProfilePageImg from '../../assets/images/profile-page-img.png';

const { Title } = Typography;
const { Option } = Select;

// ISO2 Mapping
const countries = getAllCountries();
const countryToIso2 = countries.reduce((acc, country) => {
  acc[country.name] = country.iso2;
  return acc;
}, {} as any);

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, logout }: AuthPropType = useAuth();

  const { fetchTravelerByIdData, fetchTravelerByIdStatus } = useAppSelector(getTravelerSelector);
  const { editTravelerStatus } = useAppSelector(editTravelersSelector);

  const [profileDetails, setProfileDetails] = useState<any>({});
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState<boolean>(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState<boolean>(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user && user.role === 'traveler') {
      fetchTravelerProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (fetchTravelerByIdStatus === 'SUCCESS') {
      setProfileDetails(fetchTravelerByIdData);
    }
    // dispatch(clearGetTravelerByIdResponse());
  }, [fetchTravelerByIdStatus]);

  useEffect(() => {
    if (editTravelerStatus === 'SUCCESS') {
      if (isPasswordChange) {
        message.success('Password Changed Successfully! Redirecting to Login!');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
        setPasswordError(null);

        setTimeout(() => {
          setIsPasswordChange(false);
          logout && logout();
          navigate('/login');
        }, 3000);
      } else {
        setIsEditProfileModalVisible(false);
        message.success('Profile Details Updated Successfully !');
        if (user) {
          fetchTravelerProfile(user.id);
        }
      }
    } else if (editTravelerStatus === 'FAILED') {
      message.error('Something Went Wrong !');
    }

    dispatch(clearEditTravelersResponse());
  }, [editTravelerStatus]);

  const fetchTravelerProfile = (travelerId: number) => {
    dispatch(getTravelerByIdRequest({ travelerId: travelerId }));
  };

  // Get ISO2 code for the country
  const iso2Code = profileDetails?.Country ? countryToIso2[profileDetails.Country] : 'N/A';

  const handleOk = async () => {
    setIsPasswordChange(true);
    try {
      const values = await passwordForm.validateFields();
      const { oldPassword, newPassword, confirmNewPassword } = values;

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, profileDetails.user.Password);
      if (!isOldPasswordValid) {
        setPasswordError('Old password is incorrect');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      // Perform password change logic here (e.g., API request)
      let obj = {
        travelerId: user?.id,
        travelerData: { Password: newPassword },
      };

      dispatch(updateTravelerRequest(obj));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormChange = (changedValues: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleCancel = () => {
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
    setPasswordError(null);
  };

  const handleEditProfileOk = async () => {
    profileForm.validateFields().then((values) => {
      let obj = {
        travelerId: user?.id,
        travelerData: formData,
      };

      dispatch(updateTravelerRequest(obj));
    });
  };

  const handleProfileCancel = () => {
    setIsEditProfileModalVisible(false);
    setFormData({
      FirstName: profileDetails.FirstName,
      LastName: profileDetails.LastName,
      Email: profileDetails.user?.Email,
      Country: profileDetails.Country,
      Gender: profileDetails.Gender,
    });
  };

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
    setFormData({
      FirstName: profileDetails.FirstName,
      LastName: profileDetails.LastName,
      Email: profileDetails.user?.Email,
      Country: profileDetails.Country,
      Gender: profileDetails.Gender,
    });
  };

  console.log('profileDetails', profileDetails);
  console.log('formData', formData);

  return (
    <div className="main-content">
      <div className="profile-page-content">
        <div className="profile-page-header">
          <Title level={isMobile ? 4 : 2}>Your Profile</Title>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>
        <div className="profile-details">
          <Row gutter={16}>
            <Col xs={24} md={12} className="profile-details-left">
              <div className="profile-detail">
                <div className="profile-info">
                  <UserOutlined className="profile-icon" />
                  <label className="profile-label">First Name:</label>
                </div>
                <p className="profile-value">{profileDetails?.FirstName || 'N/A'}</p>
              </div>
              <div className="profile-detail">
                <div className="profile-info">
                  <UserOutlined className="profile-icon" />
                  <label className="profile-label">Last Name:</label>
                </div>
                <p className="profile-value">{profileDetails?.LastName || 'N/A'}</p>
              </div>
              <div className="profile-detail">
                <div className="profile-info">
                  <MailOutlined className="profile-icon" />
                  <label className="profile-label">Email:</label>
                </div>
                <p className="profile-value">{profileDetails?.user?.Email || 'N/A'}</p>
              </div>
              <div className="profile-detail">
                <div className="profile-info">
                  <GlobalOutlined className="profile-icon" />
                  <label className="profile-label">Country:</label>
                </div>
                <p className="profile-value">
                  {' '}
                  {iso2Code ? (
                    <>
                      <span className={`fi fi-${iso2Code.toLowerCase()}`} style={{ marginRight: 8 }}></span>
                      {profileDetails.Country}
                    </>
                  ) : (
                    profileDetails?.Country || 'N/A'
                  )}
                </p>
              </div>
              <div className="profile-detail">
                <div className="profile-info">
                  <ManOutlined className="profile-icon" />
                  <label className="profile-label">Gender:</label>
                </div>
                <p className="profile-value">
                  {profileDetails?.Gender
                    ? profileDetails.Gender.charAt(0).toUpperCase() + profileDetails.Gender.slice(1).toLowerCase()
                    : 'N/A'}
                </p>
              </div>
              <div className="profile-detail">
                <div className="profile-info">
                  <RiLockPasswordLine className="profile-icon" />
                  <label className="profile-label">Password:</label>
                </div>
                <Button
                  type="primary"
                  onClick={() => setIsPasswordModalVisible(true)}
                  className="change-password-button"
                >
                  Change Password
                </Button>
              </div>
            </Col>
            <Col xs={24} md={12} className="profile-details-right">
              <div className="profile-image-wrapper">
                <img src={ProfilePageImg} alt="Profile" className="profile-image" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={isPasswordModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Change Password"
        cancelText="Cancel"
        centered
        style={{ borderRadius: '8px' }}
      >
        {passwordError && <Alert message={passwordError} type="error" showIcon />}
        <Form
          form={passwordForm}
          layout="vertical"
          initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
        >
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: 'Please enter your old password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please enter a new password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={isEditProfileModalVisible}
        onOk={handleEditProfileOk}
        onCancel={handleProfileCancel}
        okText="Save"
        cancelText="Cancel"
        centered
        style={{ borderRadius: '8px' }}
      >
        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{
            FirstName: profileDetails.FirstName,
            LastName: profileDetails.LastName,
            Email: profileDetails.user?.Email,
            Country: profileDetails.Country,
            Gender: profileDetails.Gender,
          }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="First Name"
            name="FirstName"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="LastName"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Country" name="Country" rules={[{ required: true, message: 'Please select your country' }]}>
            <Select placeholder="Select Country">
              {countries.map((country) => (
                <Option key={country.iso2} value={country.name}>
                  <span className={`fi fi-${country.iso2.toLowerCase()}`} style={{ marginRight: 8 }}></span>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Gender" name="Gender" rules={[{ required: true, message: 'Please select your gender' }]}>
            <Select placeholder="Select Gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
