
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { message } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  let api = localStorage.getItem("api");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log('Success:', values);
    const data = {
      username: values.username,
      password: values.password,
      remember: values.remember
    }
    axios.post(
      "http://192.168.5.240/api/v2/auth/login",
      data,
      {
        headers: {
          "API-Key": api
        }
      })
      .then((res) => {
        console.log(res)
        if (res.data.status === true) {
          localStorage.setItem("check", res.data.status)
          let token = res.data.data.token;
          localStorage.setItem("token", token);
          message.success('Đăng nhập thành công')
          navigate("/")
        } else {
          alert("Username or Password incorrect")
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='login'>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
          <p><Link href="/register">Create an Account</Link></p>
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login;