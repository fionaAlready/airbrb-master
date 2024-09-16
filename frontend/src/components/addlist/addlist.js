import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Upload, message } from 'antd';
import axios from 'axios';
import {withRouter} from "../../withRouter";

class AddList extends React.Component {
  constructor (props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      thumbnail: '',
      checkUpload: false,
      listingId: -1,
    }
  }

  beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    this.setState({
      checkUpload: isJpgOrPng,
    })
    return false;
  }

  handleChange (info) {
    if (this.state.checkUpload) {
      console.log(info.file);
      this.getBase64(info.file, (url) => {
        this.setState( {
          thumbnail: url
        });

      });
    }
  }

  onFinish = async (values) => {
    console.log('Success:', values);
    values.thumbnail = this.state.thumbnail;
    values.metadata = {
      type: values.type,
      numberOfBathrooms: values['number of bathrooms'],
      numberOfBedrooms: values['number of bedrooms'],
      propertyAmenities: values['property amenities'],
    };

    const token = localStorage.getItem('token');
    const { data } = await axios.post('http://localhost:5005/listings/new', values, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    this.setState({
      listingId: data.listingId
    })
    this.props.navigate('/listing')
  }

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

   getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  render () {
    return (
        <div >
          <h1 >Hosted Listing Create</h1>
          <Form
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
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
          >
            <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Please input your title!',
                  },
                ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Please input your address!',
                  },
                ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Please input your type!',
                  },
                ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Number of bathrooms"
                name="number of bathrooms"
                rules={[
                  {
                    required: true,
                    message: 'Please input your number of bathrooms!',
                  },
                ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Number of bedrooms"
                name="number of bedrooms"
                rules={[
                  {
                    required: true,
                    message: 'Please input your number of bedrooms!',
                  },
                ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Property amenities"
                name="property amenities"
                rules={[
                  {
                    required: true,
                    message: 'Please input your property amenities!',
                  },
                ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Price (per night)"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Please input your price!',
                  },
                ]}
            >
              <InputNumber min={1} max={999999} />
            </Form.Item>

            <Form.Item
                label="Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={this.normFile}
                rules={[
                  {
                    required: true,
                    message: 'Please input your price!',
                  },
                ]}
            >
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
export default withRouter(AddList);
