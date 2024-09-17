import axios from 'axios';
import { useState, useEffect } from 'react';
import { PageHeader, Row, Col, Table, Button, Space, Modal, Form, Input, Card, message, Tooltip } from 'antd';

import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks/hooks';
import {
  getTravelersRequest,
  getTravelersSelector,
  clearFetchTravelersResponse,
} from '../../../redux/slices/travelers/getTravelersSlice';
import {
  deleteTravelerRequest,
  deleteTravelersSelector,
  clearDeleteTravelersResponse,
} from '../../../redux/slices/travelers/deleteTravelersSlice';
import { countryToIso2 } from '../../../utils/commonFunctions';

import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

import * as XLSX from 'xlsx';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE_LIST = [10, 20];

export const TravelerManagement = () => {
  const dispatch = useAppDispatch();
  const { getTravelersData, getTravelersStatus } = useAppSelector(getTravelersSelector);
  const { deleteTravelerStatus } = useAppSelector(deleteTravelersSelector);

  const [dataSource, setDataSource] = useState<any>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<any>(null);

  const [mode, setMode] = useState<any>('CREATE');

  const [formData, setFormData] = useState<any>({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    Permission: 'admin',
  });

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTravelers();
  }, []);

  useEffect(() => {
    fetchTravelers(PAGE_SIZE, page);
  }, [pageSize, page]);

  const fetchTravelers = async (pageSize = PAGE_SIZE, pageNumber = page) => {
    dispatch(getTravelersRequest({ limit: pageSize, page: pageNumber }));
  };

  useEffect(() => {
    if (getTravelersStatus === 'SUCCESS') {
      setDataSource(getTravelersData?.data);
      setTotalItems(getTravelersData?.total);
      // setPage(addCitiesData?.page);
    } else if (getTravelersStatus === 'FAILED') {
      message.error('Something went wrong !');
    }
    dispatch(clearFetchTravelersResponse());
  }, [getTravelersStatus]);

  const handleEdit = (record: any) => {
    setMode('EDIT');
    setSelectedTraveler(record);
    setFormData(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
    console.log('Edit record', record);
  };

  const handleDelete = (record: any) => {
    setSelectedTraveler(record);
    setIsDeleteModalVisible(true);
    console.log('Delete record', record);
  };

  const handleView = (record: any) => {
    setSelectedTraveler(record);
    setIsViewModalVisible(true);
    console.log('View record', record);
  };

  const fetchAllTravelers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/travelers/all`);
      return response.data;
    } catch (error) {
      message.error('Failed to fetch all travelers');
      return [];
    }
  };

  const exportToExcel = async () => {
    const allTravelers = await fetchAllTravelers();

    const filteredData = allTravelers.map((item: any) => ({
      TravelerID: item.TravelerID,
      FirstName: item.FirstName,
      LastName: item.LastName,
      Country: item.Country,
      Gender: item.Gender,
      Status: item.Status,
      UserID: item.UserID,
    }));

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Travelers');
    XLSX.writeFile(wb, 'travelers.xlsx');
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Traveler ID',
      key: 'TravelerID',
      dataIndex: 'TravelerID',
    },
    {
      title: 'First Name',
      key: 'FirstName',
      dataIndex: 'FirstName',
    },
    {
      title: 'Last Name',
      key: 'LastName',
      dataIndex: 'LastName',
    },
    {
      title: 'Country',
      key: 'Country',
      dataIndex: 'Country',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={`fi fi-${countryToIso2[text]?.toLowerCase()}`} style={{ marginRight: '8px' }}></span>
          {text}
        </div>
      ),
    },
    {
      title: 'Gender',
      key: 'Gender',
      dataIndex: 'Gender',
      render: (text: string) => {
        if (!text) return 'N/A';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      },
    },
    {
      title: 'Email',
      key: 'Email',
      width: 280,
      dataIndex: 'Email',
      render: (text: any, record: any) => record.user?.Email || '',
    },
    // {
    //   title: 'Role',
    //   key: 'Permission',
    //   dataIndex: 'Permission',
    //   render: (text: string) => {
    //     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    //   },
    // },
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
          {/* <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} /> */}
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="pageHeader">
        <Row>
          <Col lg={24} xs={24}>
            <PageHeader ghost={false} title="Travelers" subTitle=""></PageHeader>
          </Col>
        </Row>
      </div>
      <section className="pageContent">
        <Card>
          {/* <Row justify="end" style={{ marginBottom: '16px' }}>
            <Col>
              <Button type="primary" icon={<PlusOutlined />}>
                New User
              </Button>
            </Col>
          </Row> */}
          <Row justify="end" style={{ marginBottom: '16px' }}>
            <Col>
              <Button type="primary" icon={<ExportOutlined />} onClick={exportToExcel}>
                Export to Excel
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

      {/* View Modal */}
      <Modal
        title="Traveler Details"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedTraveler(null);
        }}
        footer={null}
      >
        <p>
          <strong>Traveler ID:</strong> {selectedTraveler?.TravelerID}
        </p>
        <p>
          <strong>First Name:</strong> {selectedTraveler?.FirstName}
        </p>
        <p>
          <strong>Last Name:</strong> {selectedTraveler?.LastName}
        </p>
        <p>
          <strong>Country:</strong> {selectedTraveler?.Country}
        </p>
        <p>
          <strong>Gender:</strong>{' '}
          {selectedTraveler?.Gender?.charAt(0).toUpperCase() + selectedTraveler?.Gender?.slice(1).toLowerCase()}
        </p>
        <p>
          <strong>Email:</strong> {selectedTraveler?.user?.Email}
        </p>
        {/* <p>
          <strong>Longitude:</strong> {selectedUser?.CityLongitude}
        </p> */}
      </Modal>
    </div>
  );
};
