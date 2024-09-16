import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Popconfirm, DatePicker, message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { SendOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { withRouter } from '../../withRouter';
import Logout from '../hoc/logOut';

const Listing = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [dateStr,setDateStr] = useState([])

  useEffect(() => {
    getListing();
  }, []);

  const getListing = async () => {
    try {
      let arr = []
      const response = await axios.get('http://localhost:5005/listings');
      const {listings} = response.data
      for(let i = 0; i<listings.length;i++){
        const res = await axios.get('http://localhost:5005/listings/' + listings[i].id)
        arr.push({...res.data.listing,...listings[i]})
      }
      setListings(arr);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const confirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5005/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Listing deleted successfully!');
      getListing(); // Update the listing after deletion
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const toUpdate = (record) => {
    sessionStorage.setItem(record.id,JSON.stringify(record))
    navigate(`/updatelist/${record.id}`);
  };

  const onPublish = async (id, date) => {
    try {
      if(dateStr.length !== 0){
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5005/listings/publish/${id}`, { availability: dateStr }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDateStr([])
        message.success('Listing published successfully!');
        getListing(); // Update the listing after publishing
      }else{
        message.warning('Please select a time!');
      }
    } catch (error) {
      message.error('This listing is already published');
    }
  };

  const unPublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5005/listings/unpublish/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Listing unpublished successfully!');
      getListing(); // Update the listing after unpublishing
    } catch (error) {
      message.error('This listing is already unpublished');
    }
  };

  const availabilityChange = (date, dateString, id, record, index) => {
    setDateStr(dateString)
  };

  const email = localStorage.getItem('email');
  const checkIn = '2023-12-07';
  const checkOut = '2023-12-08';

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text, record) => (
          <Link to={`/listing/${record.id}?${checkIn ? `check_in=${checkIn}&check_out=${checkOut}` : ''}`}>{text}</Link>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      render: (text) => <img className='listImg' src={text} alt="Thumbnail" />,
    },
    {
      title: 'availability',
      dataIndex: 'availability',
      render: (_, record, index) => (
          <DatePicker.RangePicker onChange={(date, dateString) => {
            availabilityChange(date, dateString, record.id,record ,index);
          }} />
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
          <Space size="middle">
            <span className='a' onClick={() => toUpdate(record)}>Update</span>
            <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => confirm(record.id)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
            <Button 
               onClick={() => onPublish(record.id,new Date())} 
               className='publish' 
               type="primary" 
               shape="round" 
               disabled={record.published}
               icon={<SendOutlined />}>
                Publish
              </Button>
            <Button 
              onClick={() => unPublish(record.id)} 
              type="primary" 
              shape="round" 
              icon={<ArrowLeftOutlined />}
              disabled={!record.published}
              danger>Unpublish</Button>
            {record.owner === email
                ? (
                    <Link to={`/listing/${record.id}/booking`}>
                      <EyeOutlined />
                    </Link>
                )
                : null}
          </Space>
      ),
    },
  ];

  return (
      <div>
        <h1>Listing Management</h1>
        <Button href='/addlist' type='primary'>Create Listing</Button>
        <Button className='btn' href='/' type='primary' danger>Back</Button>
        <Logout/>
        <Table rowKey="id" columns={columns} dataSource={listings} />
      </div>
  );
};

export default withRouter(Listing);
