import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Upload, message, Switch, DatePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const normFile = (e) => {
  console.log('normFile');
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
class UpdateList extends React.Component {
  constructor (props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.obj = JSON.parse(sessionStorage.getItem(props.listingId));
    this.token = localStorage.getItem('token');
    console.log( this.obj)
    this.state = {
      thumbnail: '',
      checkUpload: false,
      listingId: this.obj.id,
      title: this.obj.title,
      address:this.obj.address,
      price: this.obj.price,
      published: this.obj.published ? 'checked' : '',
      availability: this.obj.availability,
      url: this.obj.thumbnail,
      metadata:this.obj.metadata,
      isShow: true
    };
  }


  beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    this.setState({
      checkUpload: isJpgOrPng ,
    })
    return false;
  }

  handleChange (info) {
    this.setState({
      isShow: false
    })
    if (this.state.checkUpload) {
      getBase64(info.file, (url) => {
        this.setState({
          thumbnail: url
        })
      });
    }
  }

  handleSwitchSwitch = (status) => {
    if(status){
      this.onPublish()
      return
    }
    this.unPublish()
  }


  unPublish = async (id) => {
    try {
      const { listingId } = this.state
      await axios.put(`http://localhost:5005/listings/unpublish/${listingId}`, {}, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.obj.published = false
      sessionStorage.setItem(this.props.listingId,JSON.stringify(this.obj))
      message.success('Listing unpublished successfully!');
    } catch (error) {
      message.error('This listing is already unpublished');
    }
  };

  onPublish = async () => {
    try {
      const { listingId } = this.state
      await axios.put(`http://localhost:5005/listings/publish/${listingId}`, { availability: new Date() }, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.obj.published = true
      sessionStorage.setItem(this.props.listingId,JSON.stringify(this.obj))
      message.success('Listing published successfully!');
    } catch (error) {
      message.error('This listing is already published');
    }
  };

  onFinish = async (values) => {
    if (!values.title) {
      values.title = this.state.title
    }
    if (!values.address) {
      values.address = this.state.address
    }
    if (!values.price) {
      values.price = this.state.price
    }
    if (!values.published) {
      values.published = this.state.published
    }
    if (!values.availability) {
      values.availability = this.state.availability
    }
    if (!values.thumbnail) {
      values.thumbnail = this.state.thumbnail
    }

    values.metadata = {
      numberOfBathrooms:values.numberOfBathrooms,
      numberOfBedrooms:values.numberOfBedrooms,
      propertyAmenities:values.propertyAmenities,
      type:values.type
    }
    if(!values.numberOfBathrooms){
      values.metadata.numberOfBathrooms = this.state.metadata.numberOfBathrooms
    }

    if(!values.numberOfBedrooms){
      values.metadata.numberOfBedrooms = this.state.metadata.numberOfBedrooms
    }

    if(!values.propertyAmenities){
      values.metadata.propertyAmenities = this.state.metadata.propertyAmenities
    }

    if(!values.type){
      values.metadata.type = this.state.metadata.type
    }


    delete values.numberOfBathrooms
    delete values.numberOfBedrooms
    delete values.propertyAmenities
    delete values.type

   

    const token = localStorage.getItem('token');
    await axios.put('http://localhost:5005/listings/' + this.state.listingId, values, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    this.props.navigate('/listing')
    location.href = '/listing'
  }

  render () {
    return (
      <div >
        <h1 >UpdateList</h1>
        <Form
          form={this.form}
          name="basic"
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
            label="Title"
            name="title"
          >
            <Input defaultValue={this.state.title} />
          </Form.Item>

          <Form.Item
            label="type"
            name="type"
          >
            <Input defaultValue={this.state.metadata.type}/>
          </Form.Item>
          
          <Form.Item
            label="Number of bathrooms"
            name="numberOfBathrooms"
          >
            <Input defaultValue={this.state.metadata.numberOfBathrooms}/>
          </Form.Item>

          <Form.Item
            label="Number of bedrooms"
            name="numberOfBedrooms"
          >
            <Input defaultValue={this.state.metadata.numberOfBedrooms}/>
          </Form.Item>


          <Form.Item
            label="Property amenities"
            name="propertyAmenities"
          >
            <Input defaultValue={this.state.metadata.propertyAmenities}/>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input defaultValue={this.state.address}/>
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
          >
            <InputNumber min={1} max={999999} defaultValue={this.state.price}/>
          </Form.Item>

          <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            { this.state.isShow ? <img src={this.state.url} alt=''/> : '' }
            <Upload
              listType="picture-card"
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default UpdateList;
