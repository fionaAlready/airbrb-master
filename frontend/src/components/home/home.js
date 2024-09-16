import React from 'react';
import dayjs from 'dayjs';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Button, Col, Row, Image, Input, Form, DatePicker, Drawer, InputNumber, Result } from 'antd';
import { withRouter } from "../../withRouter";
import Logout from '../hoc/logOut';
import './styles.css'
const { Search } = Input;


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const toInfo = (id,_this) => {
  axios.get('http://localhost:5005/listings/' + id).then(res => {
    // save id
    res.data.listing.id = id;
    localStorage.setItem('getListInfo', JSON.stringify(res.data.listing));
    // _this.props.navigate('/listinfo')
    _this.props.navigate('/listing/'+ id)
  })
};

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.token = localStorage.getItem('token')
    this.state = {
      showElem:  this.token === '' ||  this.token === null ? true : false,
      drawerShow: false,
      listings: [],
      searchArr: [],
      title: '',
      address: '',
      price: '',
      dateTime: [],
      delShow: false,
      resultShow: false
    }
  }
  componentDidMount() {
    this.getLists();
  }

  async getLists () {
    const { data } = await axios.get('http://localhost:5005/listings');
    const lists = data.listings;
    const arr = [];
    for (let i = 0; i < lists.length; i++) {
      const res = await axios.get('http://localhost:5005/listings/' + lists[i].id)
      // Background interface has no id, and can only be judged according to title and published.
      if (res.data.listing.title === lists[i].title && res.data.listing.published) {
        // save id
        res.data.listing.id = lists[i].id;
        arr.push(res.data.listing)
      }
    }
    this.setState({
      listings: arr,
      searchArr: arr
    })
  }

  onSearch = (value) => {
    // just search title and address
    if (value) { // 有值
      value = value.toLowerCase();
      const arr = this.state.searchArr;
      const newArr = arr.filter((item) => {
        return item.title === value || item.address === value;
      })
      this.setState({
        listings: newArr
      })
    } else {
      this.setState({
        listings: this.state.searchArr
      })
    }
  }

  showDrawer = () => {
    this.setState({
      drawerShow: true,
      title: '',
      address: '',
      price: '',
      dateTime: []
    })
  };

  onClose = () => {
    this.setState({
      drawerShow: false
    })
  };

  hideBtn = () => {
    this.setState({
      listings: this.state.searchArr,
      delShow: false,
      resultShow: false
    })
  }

  onFinish = async (values) => {
    // Compound query
    const arr = this.state.searchArr;
    const newArr = arr.filter((item) => {
      let startTime = ''
      let endTime = ''
      let availabilityStartTime = ''
      let availabilityEndtTime = ''

      if(values.dateTime){
        startTime = values.dateTime[0]
        endTime = values.dateTime[1]
      }

      if(item.availability instanceof Array && item.availability.length === 2){
        availabilityStartTime = item.availability[0]
        availabilityEndtTime = item.availability[1]
      }

      return item.title === values.title || item.address === values.address || item.price === values.price || (startTime >= dayjs(availabilityStartTime, 'YYYY-MM-DD') && endTime <= dayjs(availabilityEndtTime, 'YYYY-MM-DD'));
    })
    if (newArr.length !== 0) {
      this.setState({
        listings: newArr,
        delShow: true
      })
    } else if (!values.title && !values.address && !values.price && !values.dateTime) {
      // nothing search
      this.setState({
        listings: arr
      })
    } else {
      // no result
      this.setState({
        listings: newArr,
        delShow: true,
        resultShow: true
      })
    }
    this.onClose()
  }


  /**
   * to register page
   */
  registerHandle = ()=>{
    this.props.navigate('/register')
  }


  render () {
    const arr = [];
    for (let i = 0; i < this.state.listings.length; i++) {
      const item = (
        <Col className='ll' xs={12} lg={6} key={i}>
          <Image
              width="100%"
              alt={'Default picture'}
              height={280}
                src={this.state.listings[i].thumbnail}
              />
              <span className='a' onClick={() => {
                toInfo(this.state.listings[i].id,this);
              }}>{this.state.listings[i].title}</span>
              <p>{this.state.listings[i].address}</p>
              <p><b>￥{this.state.listings[i].price} </b>night</p>
        </Col>
      )
      arr.push(item)
    }
    return (
      <div >
        <div>
        <img src='/img/logo.jpg' alt=''></img>
        <Form
          name="basic1"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label=""
            name="search"
          >
            <Search allowClear placeholder="input search text" onSearch={this.onSearch} enterButton />
          </Form.Item>
        </Form>
        </div>

        <div className='header'>
          <Logout/>
          {
            this.state.showElem ?  <Button onClick={this.registerHandle} type='link'>register</Button>  : <></>
          }

          <span className='btn'>
          { this.state.showElem ? <></> : <Button href='/listing' type="primary">Listing</Button> }
          </span>
          <span className='btn'>
          {/* { this.state.showElem ? <></> : <Button href='/booking' type="primary" danger>Booking</Button> } */}
          </span>

          <Button type="primary" onClick={this.showDrawer} icon={<PlusOutlined />}>
          Compound Query
        </Button>
        { this.state.delShow ? <Button type="text" onClick={this.hideBtn} danger><DeleteOutlined /></Button> : <></>}
        </div>

      <Drawer
        title="Compound Query"
        width={720}
        onClose={this.onClose}
        open={this.state.drawerShow}
        destroyOnClose={true}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form layout="vertical" name="basic" onFinish={this.onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
              >
                <Input placeholder="Please enter user title" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="address"
                label="Address"
              >
                <Input placeholder="Please enter user address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="dateTime"
                label="DateTime"
              >
                <DatePicker.RangePicker
                  style={{
                    width: '100%',
                  }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="price"
                label="Price"
              >
                <InputNumber min={1} max={999999} />
              </Form.Item>
            </Col>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </Drawer>
        <div className='indexlist'>
          <div>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            {arr}
          </Row>
          { this.state.listings.length === 0 ? <Result status="500" title="No records" subTitle="Sorry, there were no results from the query."/> : <></>}
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);
