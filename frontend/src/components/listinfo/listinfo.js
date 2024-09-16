import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button, Form, DatePicker } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import Logout from '../hoc/logOut';

class Listinfo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      info: [],
      orderShow: true
    }
    this.onFinish = this.onFinish.bind(this);
    const obj = JSON.parse(localStorage.getItem('getListInfo'))
    this.state.info = obj;
  }

  onFinish (values) {
    console.log(values);
    if (values.dateTime != null) {
      this.setState({
        orderShow: false
      })
      const token = localStorage.getItem('token');
      const price = this.state.info.price;
      const start = dayjs(values.dateTime[0], 'YYYY-MM-DD');
      const end = dayjs(values.dateTime[1], 'YYYY-MM-DD');
      const dr = { start, end }
      const obj = {
        totalPrice: price,
        dateRange: dr
      }
      axios.post('http://localhost:5005/bookings/new/' + this.state.info.id, obj, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
    }
  }

  render () {
    return (
        <div >
          <img src='/img/logo.jpg' alt=''></img>
          <br></br>
          <Button className='btn' href='/' type='primary' danger>back</Button>
          <Logout/>
          <div className='indexlist'>
            <div>
              <img src={this.state.info.thumbnail} alt=''/>
              <br></br>
              <h3>{this.state.info.title}</h3>
              <p>{this.state.info.address}</p>
              <p>${this.state.info.price}</p>
              <p>{this.state.info.owner}</p>
              <Form name="basic" onFinish={this.onFinish}>
                <Form.Item
                    name="dateTime"
                >
                  <DatePicker.RangePicker
                      style={{
                        width: '15%',
                      }}
                  />
                </Form.Item>
                <Form.Item
                >
                  <Button
                      style={{
                        position: 'absolute',
                        top: '-3.7rem',
                        left: '17.5rem'
                      }} type='link' htmlType="submit">
                    { this.state.orderShow ? <HeartOutlined style={{ fontSize: '25px', color: 'red' }} /> : <HeartFilled style={{ fontSize: '25px', color: 'red' }} /> }
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
    )
  }
}
export default Listinfo;
