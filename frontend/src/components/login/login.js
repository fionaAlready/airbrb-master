import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { withRouter } from "../../withRouter";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  onFinish = async (values) => {

    console.log("Success:", values);
    try {
      const {data} = await axios.post("http://localhost:5005/user/auth/login", values);
      console.log(data);
      // save token
      localStorage.setItem("token", data.token);
      localStorage.setItem('email', values.email);

      this.props.navigate("/");
    } catch (error) {
      console.log(error);
      // fail
      message.error("Incorrect email or password");
    }
  };
  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
        <div>
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
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
          >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
            >
              <Input.Password/>
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
    );
  }
}
export default withRouter(Login);
