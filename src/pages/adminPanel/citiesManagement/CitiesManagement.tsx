import { useState, useEffect } from 'react';
import { PageHeader, Row, Col, Table, Button, Space, Modal, Form, Input, Card, message, Tooltip } from 'antd';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import {
  getCitiesRequest,
  getCitiesSelector,
  clearFetchCitiesResponse,
} from '../../../redux/slices/cities/getCitiesSlice';
import { addCityRequest, addCitiesSelector, clearAddCitiesResponse } from '../../../redux/slices/cities/addCitiesSlice';
import {
  updateCityRequest,
  editCitiesSelector,
  clearEditCitiesResponse,
} from '../../../redux/slices/cities/editCitiesSlice';
import {
  deleteCityRequest,
  clearDeleteCitiesResponse,
  deleteCitiesSelector,
} from '../../../redux/slices/cities/deleteCitiesSlice';

import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

const PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE_LIST = [10, 20];
const MAX_CHAR_LENGTH = 120;

export const CityManagement = () => {
  const dispatch = useAppDispatch();
  const { getCitiesData, getCitiesStatus } = useAppSelector(getCitiesSelector);
  const { editCitiesStatus } = useAppSelector(editCitiesSelector);
  const { addCityStatus } = useAppSelector(addCitiesSelector);
  const { deleteCityStatus } = useAppSelector(deleteCitiesSelector);

  const [dataSource, setDataSource] = useState<any>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [mode, setMode] = useState<any>('CREATE');

  const [formData, setFormData] = useState<any>({});

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getCitiesRequest({ limit: pageSize, page: page }));
  }, [pageSize, page]);

  useEffect(() => {
    dispatch(getCitiesRequest({ limit: pageSize, page: page }));
    // console.log('Request dispatch');
  }, []);

  const fetchCities = async (pageSize = PAGE_SIZE, pageNumber = page) => {
    dispatch(getCitiesRequest({ limit: pageSize, page: pageNumber }));
  };

  useEffect(() => {
    if (getCitiesStatus === 'SUCCESS') {
      setDataSource(getCitiesData?.data);
      setTotalItems(getCitiesData?.total);
      // setPage(addCitiesData?.page);
    }
    dispatch(clearFetchCitiesResponse());
  }, [getCitiesStatus]);

  useEffect(() => {
    if (editCitiesStatus === 'SUCCESS') {
      message.success('City successfully updated.');
      setSelectedCity(null);
      setFormData({});
      fetchCities(PAGE_SIZE, 1);
      setIsEditModalVisible(false);
    } else if (editCitiesStatus === 'FAILED') {
      message.error('Update failed. Please try again.');
    }

    dispatch(clearEditCitiesResponse());
  }, [editCitiesStatus]);

  useEffect(() => {
    if (addCityStatus === 'SUCCESS') {
      message.success('City Added Successfully !');
      setFormData({});
      setMode('CREATE');
      fetchCities(PAGE_SIZE, 1);
      setIsEditModalVisible(false);
    } else if (addCityStatus === 'FAILED') {
      message.error('Add failed. Please try again.');
    }

    dispatch(clearAddCitiesResponse());
  }, [addCityStatus]);

  useEffect(() => {
    if (deleteCityStatus === 'SUCCESS') {
      message.success('City Deleted Successfully !');
      setSelectedCity(null);
      fetchCities(PAGE_SIZE, 1);
    } else if (deleteCityStatus === 'FAILED') {
      message.success('Something went wrong !');
    }
    dispatch(clearDeleteCitiesResponse());
  }, [deleteCityStatus]);

  const handleEdit = (record: any) => {
    setMode('EDIT');
    setSelectedCity(record);
    setFormData(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
    console.log('Edit record', record);
  };

  const handleDelete = (record: any) => {
    setSelectedCity(record);
    setIsDeleteModalVisible(true);
    console.log('Delete record', record);
  };

  const handleView = (record: any) => {
    setSelectedCity(record);
    setIsViewModalVisible(true);
    console.log('View record', record);
  };

  const convertBeforeSubmit = (formData: any) => {
    let obj = {
      CityName: formData.CityName,
      CityDescription: formData.CityDescription,
      CityLatitude: formData.CityLatitude,
      CityLongitude: formData.CityLongitude,
    };
    return obj;
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === 'CREATE') {
          let obj = {
            cityData: convertBeforeSubmit(formData),
          };
          dispatch(addCityRequest(obj));
        } else if (mode === 'EDIT') {
          let obj = {
            cityId: selectedCity?.CityID,
            cityData: convertBeforeSubmit(formData),
          };
          dispatch(updateCityRequest(obj));
        }
      })
      .catch((errorInfo) => {
        // console.error('Validation Failed:', errorInfo);
      });
  };

  const handleFormChange = (changedValues: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleAddNewModal = () => {
    setMode('CREATE');
    setSelectedCity(null);
    setFormData({});
    form.resetFields();
    setIsEditModalVisible(true);
  };

  const handleDeleteOk = () => {
    dispatch(
      deleteCityRequest({
        cityId: selectedCity?.CityID,
      })
    );
    console.log('Deleting record:', selectedCity);
    setIsDeleteModalVisible(false);
  };

  const onCloseModal = () => {
    setFormData({});
    setMode('CREATE');
    setIsEditModalVisible(false);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      key: 'CityID',
      dataIndex: 'CityID',
    },
    {
      title: 'Name',
      key: 'CityName',
      dataIndex: 'CityName',
    },
    {
      title: 'Description',
      key: 'CityDescription',
      dataIndex: 'CityDescription',
      render: (text: string) => <span>{truncateText(text, MAX_CHAR_LENGTH)}</span>,
    },
    {
      title: 'Latitude',
      key: 'CityLatitude',
      dataIndex: 'CityLatitude',
    },
    {
      title: 'Longitude',
      key: 'CityLongitude',
      dataIndex: 'CityLongitude',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          </Tooltip>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const pagination = {
    showTotal: (total: number, range: [number, number]) => {
      return `Showing ${range[0]} to ${range[1]} of ${total} entries`;
    },
  };

  console.log('addCitiesData', getCitiesData);
  console.log('form data', formData);

  return (
    <div>
      <div className="pageHeader">
        <Row>
          <Col lg={24} xs={24}>
            <PageHeader ghost={false} title="Cities" subTitle="" />
          </Col>
        </Row>
      </div>
      <section className="pageContent">
        <Card>
          <Row justify="end" style={{ marginBottom: '16px' }}>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewModal}>
                New City
              </Button>
            </Col>
          </Row>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 1500 }}
            pagination={{
              onShowSizeChange: (current, size) => {
                setPage(0);
                setPageSize(size);
              },
              onChange: (current, size) => {
                setPage(current);
                setPageSize(size);
              },
              defaultCurrent: page,
              total: totalItems,
              pageSize: PAGE_SIZE,
              pageSizeOptions: DEFAULT_PAGE_SIZE_LIST,
            }}
          ></Table>
        </Card>
      </section>

      {/* Edit Modal */}
      <Modal
        title={mode === 'CREATE' ? 'Add City' : 'Edit City'}
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={onCloseModal}
      >
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Form.Item
            name="CityName"
            label="City Name"
            rules={[{ required: true, message: 'Please input the city name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="CityDescription"
            label="City Description"
            rules={[{ required: true, message: 'Please input the city description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="CityLatitude"
            label="Latitude"
            rules={[{ required: true, message: 'Please input the latitude!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="CityLongitude"
            label="Longitude"
            rules={[{ required: true, message: 'Please input the longitude!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete City"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedCity(null);
        }}
      >
        <p>Are you sure you want to delete {selectedCity?.CityName}?</p>
      </Modal>

      {/* View Modal */}
      <Modal
        title="City Details"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedCity(null);
        }}
        footer={null}
      >
        <p>
          <strong>ID:</strong> {selectedCity?.CityID}
        </p>
        <p>
          <strong>Name:</strong> {selectedCity?.CityName}
        </p>
        <p>
          <strong>Description:</strong> {selectedCity?.CityDescription}
        </p>
        <p>
          <strong>Latitude:</strong> {selectedCity?.CityLatitude}
        </p>
        <p>
          <strong>Longitude:</strong> {selectedCity?.CityLongitude}
        </p>
      </Modal>
    </div>
  );
};
