import { useState, useEffect } from 'react';
import { PageHeader, Row, Col, Table, Button, Space, Modal, Form, Input, Card, message, Select } from 'antd';

import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import {
  getDestinationsRequest,
  getDestinationsSelector,
  clearFetchDestinationsResponse,
} from '../../../redux/slices/destinations/getDestinationsSlice';
import {
  addDestinationRequest,
  addDestinationsSelector,
  clearAddDestinationsResponse,
} from '../../../redux/slices/destinations/addDestinationsSlice';
import {
  updateDestinationRequest,
  editDestinationsSelector,
  clearEditDestinationsResponse,
} from '../../../redux/slices/destinations/editDestinationsSlice';
import {
  deleteDestinationRequest,
  deleteDestinationsSelector,
  clearDeleteDestinationsResponse,
} from '../../../redux/slices/destinations/deleteDestinationsSlice';

import { cities } from '../../../constants/systemConstants';

import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

const PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE_LIST = [10, 20];
const MAX_CHAR_LENGTH = 120;

export const DestinationManagement = () => {
  const dispatch = useAppDispatch();
  const { getDestinationsData, getDestinationsStatus } = useAppSelector(getDestinationsSelector);
  const { addDestinationStatus } = useAppSelector(addDestinationsSelector);
  const { editDestinationsStatus } = useAppSelector(editDestinationsSelector);
  const { deleteDestinationStatus } = useAppSelector(deleteDestinationsSelector);

  const [dataSource, setDataSource] = useState<any>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const [mode, setMode] = useState<any>('CREATE');

  const [formData, setFormData] = useState<any>({});

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getDestinationsRequest({ limit: pageSize, page: page }));
  }, [pageSize, page]);

  useEffect(() => {
    dispatch(getDestinationsRequest({ limit: pageSize, page: page }));
    // console.log('Request dispatch');
  }, []);

  const fetchDestinations = async (pageSize = PAGE_SIZE, pageNumber = page) => {
    dispatch(getDestinationsRequest({ limit: pageSize, page: pageNumber }));
  };

  useEffect(() => {
    if (getDestinationsStatus === 'SUCCESS') {
      setDataSource(getDestinationsData?.data);
      setTotalItems(getDestinationsData?.total);
      // setPage(addCitiesData?.page);
    }
    dispatch(clearFetchDestinationsResponse());
  }, [getDestinationsStatus]);

  useEffect(() => {
    if (editDestinationsStatus === 'SUCCESS') {
      message.success('Destination successfully updated.');
      setSelectedDestination(null);
      setFormData({});
      fetchDestinations(PAGE_SIZE, 1);
      setIsEditModalVisible(false);
    } else if (editDestinationsStatus === 'FAILED') {
      message.error('Update failed. Please try again.');
    }

    dispatch(clearEditDestinationsResponse());
  }, [editDestinationsStatus]);

  useEffect(() => {
    if (addDestinationStatus === 'SUCCESS') {
      message.success('Destination Added Successfully !');
      setFormData({});
      setMode('CREATE');
      fetchDestinations(PAGE_SIZE, 1);
      setIsEditModalVisible(false);
    } else if (addDestinationStatus === 'FAILED') {
      message.error('Add failed. Please try again.');
    }

    dispatch(clearAddDestinationsResponse());
  }, [addDestinationStatus]);

  useEffect(() => {
    if (deleteDestinationStatus === 'SUCCESS') {
      message.success('Destination Deleted Successfully !');
      setSelectedDestination(null);
      fetchDestinations(PAGE_SIZE, 1);
    } else if (deleteDestinationStatus === 'FAILED') {
      message.success('Something went wrong !');
    }
    dispatch(clearDeleteDestinationsResponse());
  }, [deleteDestinationStatus]);

  const handleEdit = (record: any) => {
    setMode('EDIT');
    setSelectedDestination(record);
    setFormData(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
    console.log('Edit record', record);
  };

  const handleDelete = (record: any) => {
    setSelectedDestination(record);
    setIsDeleteModalVisible(true);
    console.log('Delete record', record);
  };

  const handleView = (record: any) => {
    setSelectedDestination(record);
    setIsViewModalVisible(true);
    console.log('View record', record);
  };

  const convertBeforeSubmit = (formData: any) => {
    let obj = {
      DestinationName: formData.DestinationName,
      Description: formData.Description,
      Latitude: formData.Latitude,
      Longitude: formData.Longitude,
      TimeSpent: parseInt(formData.TimeSpent, 10),
      Ratings: parseFloat(formData.Ratings),
      CityID: parseInt(formData.CityID, 10),
    };
    return obj;
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === 'CREATE') {
          let obj = {
            destinationData: convertBeforeSubmit(formData),
          };
          dispatch(addDestinationRequest(obj));
        } else if (mode === 'EDIT') {
          let obj = {
            destinationId: selectedDestination?.DestinationID,
            destinationData: convertBeforeSubmit(formData),
          };
          dispatch(updateDestinationRequest(obj));
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
    setSelectedDestination(null);
    setFormData({});
    form.resetFields();
    setIsEditModalVisible(true);
  };

  const handleDeleteOk = () => {
    dispatch(
      deleteDestinationRequest({
        destinationId: selectedDestination?.DestinationID,
      })
    );
    console.log('Deleting record:', selectedDestination);
    setIsDeleteModalVisible(false);
  };

  const onCloseModal = () => {
    form.resetFields();
    setFormData({});
    setMode('CREATE');
    setSelectedDestination(null);
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
      key: 'DestinationID',
      dataIndex: 'DestinationID',
    },
    {
      title: 'Name',
      key: 'DestinationName',
      dataIndex: 'DestinationName',
    },
    {
      title: 'Description',
      key: 'Description',
      dataIndex: 'Description',
      width: 400,
      render: (text: string) => <span>{truncateText(text, MAX_CHAR_LENGTH)}</span>,
    },
    {
      title: 'City',
      key: 'CityID',
      dataIndex: 'CityID',
      render: (text: any, record: any) => record.city?.CityName || '',
    },
    {
      title: 'Latitude',
      key: 'Latitude',
      dataIndex: 'Latitude',
    },
    {
      title: 'Longitude',
      key: 'Longitude',
      dataIndex: 'Longitude',
    },
    {
      title: 'Time Spent',
      key: 'TimeSpent',
      dataIndex: 'TimeSpent',
    },
    {
      title: 'Average Rating',
      key: 'Ratings',
      dataIndex: 'Ratings',
    },

    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
        </Space>
      ),
    },
  ];

  console.log('addCitiesData', getDestinationsData);
  console.log('form data', formData);

  return (
    <div>
      <div className="pageHeader">
        <Row>
          <Col lg={24} xs={24}>
            <PageHeader ghost={false} title="Destinations" subTitle=""></PageHeader>
          </Col>
        </Row>
      </div>
      <section className="pageContent">
        <Card>
          <Row justify="end" style={{ marginBottom: '16px' }}>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewModal}>
                New Destination
              </Button>
            </Col>
          </Row>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 1700 }}
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
              // pageSizeOptions: DEFAULT_PAGE_SIZE_LIST,
            }}
          ></Table>
        </Card>
      </section>

      {/* Edit Modal */}
      <Modal
        title={mode === 'CREATE' ? 'Add Destination' : 'Edit Destination'}
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={onCloseModal}
      >
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Form.Item
            name="DestinationName"
            label="Destination Name"
            rules={[{ required: true, message: 'Please input the destination name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true, message: 'Please input the destination description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="CityID" label="City" rules={[{ required: true, message: 'Please input city!' }]}>
            <Select placeholder="Please Select City">
              {cities.map((city) => (
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="TimeSpent"
            label="Time Spent"
            rules={[{ required: true, message: 'Please input time spent!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Ratings"
            label="Average Rating"
            rules={[{ required: true, message: 'Please input the average rating!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Latitude"
            label="Latitude"
            rules={[{ required: true, message: 'Please input the latitude!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Longitude"
            label="Longitude"
            rules={[{ required: true, message: 'Please input the longitude!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Destination"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedDestination(null);
        }}
      >
        <p>Are you sure you want to delete {selectedDestination?.DestinationName}?</p>
      </Modal>

      {/* View Modal */}
      <Modal
        title="City Details"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedDestination(null);
        }}
        footer={null}
      >
        <p>
          <strong>ID:</strong> {selectedDestination?.DestinationID}
        </p>
        <p>
          <strong>Name:</strong> {selectedDestination?.DestinationName}
        </p>
        <p>
          <strong>Description:</strong> {selectedDestination?.Description}
        </p>
        <p>
          <strong>City:</strong> {selectedDestination?.city?.CityName}
        </p>
        <p>
          <strong>Time Spent:</strong> {selectedDestination?.TimeSpent}
        </p>
        <p>
          <strong>Average Rating:</strong> {selectedDestination?.Ratings}
        </p>
        <p>
          <strong>Latitude:</strong> {selectedDestination?.Latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {selectedDestination?.Longitude}
        </p>
      </Modal>
    </div>
  );
};
