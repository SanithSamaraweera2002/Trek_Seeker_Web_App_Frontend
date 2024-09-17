import { useState, useEffect } from 'react';
import { PageHeader, Row, Col, Table, Button, Space, Modal, Form, Input, Card, message, Tooltip } from 'antd';

import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import { getUsersRequest, getUsersSelector, clearFetchUsersResponse } from '../../../redux/slices/users/getUsersSlice';
import { addUsersRequest, addUsersSelector, clearAddUsersResponse } from '../../../redux/slices/users/addUsersSlice';
import {
  updateUserRequest,
  editUsersSelector,
  clearEditUsersResponse,
} from '../../../redux/slices/users/editUsersSlice';
import {
  deleteUserRequest,
  deleteUsersSelector,
  clearDeleteUsersResponse,
} from '../../../redux/slices/users/deleteUsersSlice';

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { RiAdminLine } from 'react-icons/ri';
import { ColumnsType } from 'antd/lib/table';

const PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE_LIST = [10, 20];

export const UserManagement = () => {
  const dispatch = useAppDispatch();
  const { getUsersData, getUsersStatus } = useAppSelector(getUsersSelector);
  const { editUsersStatus, editUsersError } = useAppSelector(editUsersSelector);
  const { addUserStatus, addUserError } = useAppSelector(addUsersSelector);
  const { deleteUserStatus, deleteUserError } = useAppSelector(deleteUsersSelector);

  const [dataSource, setDataSource] = useState<any>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState<boolean>(false);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate' | null>(null);

  const [mode, setMode] = useState<any>('CREATE');

  const [formData, setFormData] = useState<any>({});

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers(PAGE_SIZE, page);
  }, [pageSize, page]);

  const fetchUsers = async (pageSize = PAGE_SIZE, pageNumber = page) => {
    dispatch(getUsersRequest({ limit: pageSize, page: pageNumber }));
  };

  useEffect(() => {
    if (getUsersStatus === 'SUCCESS') {
      setDataSource(getUsersData?.data);
      setTotalItems(getUsersData?.total);
      // setPage(addCitiesData?.page);
    } else if (getUsersStatus === 'FAILED') {
      message.error('Something went wrong !');
    }
    dispatch(clearFetchUsersResponse());
  }, [getUsersStatus]);

  useEffect(() => {
    if (addUserStatus === 'SUCCESS') {
      message.success('User Added Successfully !');
      setFormData({});
      setMode('CREATE');
      fetchUsers(PAGE_SIZE, 1);
      setIsAddModalVisible(false);
    } else if (addUserStatus === 'FAILED') {
      message.error(addUserError.message);
    }

    dispatch(clearAddUsersResponse());
  }, [addUserStatus]);

  useEffect(() => {
    if (editUsersStatus === 'SUCCESS') {
      message.success('User successfully updated.');
      setSelectedUser(null);
      setFormData({});
      fetchUsers(PAGE_SIZE, 1);
      setIsStatusModalVisible(false);
      setIsEditModalVisible(false);
    } else if (editUsersStatus === 'FAILED') {
      message.error(editUsersError?.message);
    }

    dispatch(clearEditUsersResponse());
  }, [editUsersStatus]);

  const handleFormChange = (changedValues: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleAddNewModal = () => {
    setMode('CREATE');
    form.resetFields();
    setSelectedUser(null);
    setFormData({ Permission: 'admin' });
    setIsAddModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setMode('EDIT');
    setSelectedUser(record);
    editForm.setFieldsValue({ Email: record.Email });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: any) => {
    setSelectedUser(record);
    setIsDeleteModalVisible(true);
    console.log('Delete record', record);
  };

  const handleView = (record: any) => {
    setSelectedUser(record);
    setIsViewModalVisible(true);
    console.log('View record', record);
  };

  const handleDeactivate = (record: any) => {
    setSelectedUser(record);
    setStatusAction(record.Status === 1 ? 'deactivate' : 'activate');
    setIsStatusModalVisible(true);
  };

  const handleStatusChange = async () => {
    if (selectedUser) {
      const updatedStatus = statusAction === 'activate' ? 1 : 0;
      const obj = {
        userId: selectedUser.UserID,
        userData: { Status: updatedStatus },
      };
      dispatch(updateUserRequest(obj));
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        let obj = {
          userData: formData,
        };
        dispatch(addUsersRequest(obj));
      })
      .catch((errorInfo) => {
        // console.error('Validation Failed:', errorInfo);
      });
  };

  const handleEditSubmit = () => {
    editForm
      .validateFields()
      .then((values) => {
        if (selectedUser) {
          let obj = {
            userId: selectedUser?.UserID,
            userData: { Email: values.Email },
          };
          dispatch(updateUserRequest(obj));
        }
      })
      .catch((errorInfo) => {});
  };

  const onCloseModal = () => {
    setFormData({
      Permission: 'admin',
    });
    setMode('CREATE');
    setIsAddModalVisible(false);
  };

  const onCloseEditModal = () => {
    setMode('CREATE');
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const columns: ColumnsType<any> = [
    {
      title: 'User ID',
      key: 'UserID',
      dataIndex: 'UserID',
    },
    {
      title: 'User Name',
      key: 'UserName',
      dataIndex: 'UserName',
      render: (text: string, record: any) => (
        <>
          {record.Status === 1 ? (
            <Tooltip title="Active">
              <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Inactive">
              <CloseCircleOutlined style={{ color: 'red', marginRight: 8 }} />
            </Tooltip>
          )}
          {text}
        </>
      ),
    },
    {
      title: 'Email',
      key: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Role',
      key: 'Permission',
      dataIndex: 'Permission',
      render: (text: string) => (
        <>
          {text.toLowerCase() === 'admin' ? (
            <Tooltip title="Admin">
              <RiAdminLine style={{ marginRight: 8 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Traveler">
              <UserOutlined style={{ marginRight: 8 }} />
            </Tooltip>
          )}
          {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'Status',
      dataIndex: 'Status',
      render: (status: number) => (status === 1 ? 'Acitve' : 'Inactive'),
    },
    // {
    //   title: 'Longitude',
    //   key: 'CityLongitude',
    //   dataIndex: 'CityLongitude',
    // },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={record.Status === 1 ? 'Deactivate' : 'Activate'}>
            <Button
              icon={record.Status === 1 ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleDeactivate(record)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  console.log('Form Data', formData);
  console.log('Error', addUserError);

  return (
    <div>
      {' '}
      <div className="pageHeader">
        <Row>
          <Col lg={24} xs={24}>
            <PageHeader ghost={false} title="Users" subTitle=""></PageHeader>
          </Col>
        </Row>
      </div>
      <section className="pageContent">
        <Card>
          <Row justify="end" style={{ marginBottom: '16px' }}>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewModal}>
                Create Admin
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
      {/* Add Modal */}
      <Modal title="Add New Admin" visible={isAddModalVisible} onOk={handleSubmit} onCancel={onCloseModal}>
        <Form form={form} layout="vertical" initialValues={formData} onValuesChange={handleFormChange}>
          <Form.Item
            name="FirstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="LastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Password"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit Modal  */}
      <Modal title="Edit User" visible={isEditModalVisible} onOk={handleEditSubmit} onCancel={onCloseEditModal}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="Email" label="Email" rules={[{ required: true, message: 'Please enter the email!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* View Modal */}
      <Modal
        title="User Details"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
      >
        <p>
          <strong>ID:</strong> {selectedUser?.UserID}
        </p>
        <p>
          <strong>User Name:</strong> {selectedUser?.UserName}
        </p>
        <p>
          <strong>Email:</strong> {selectedUser?.Email}
        </p>
        <p>
          <strong>Role:</strong>{' '}
          {selectedUser?.Permission?.charAt(0).toUpperCase() + selectedUser?.Permission?.slice(1).toLowerCase()}
        </p>
        <p>
          <strong>Status:</strong> {selectedUser?.Status === 0 ? 'Inactive' : 'Active'}
        </p>
        {/* <p>
          <strong>Longitude:</strong> {selectedUser?.CityLongitude}
        </p> */}
      </Modal>
      {/* Status Confirmation Modal */}
      <Modal
        title={statusAction === 'activate' ? 'Activate User Account' : 'Deactivate User Account'}
        visible={isStatusModalVisible}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to {statusAction} the account with email <strong>{selectedUser?.Email}</strong>?
        </p>
      </Modal>
    </div>
  );
};
