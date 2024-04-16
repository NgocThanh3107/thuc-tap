
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const navigate = useNavigate();

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

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
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877"
        }
      })
      .then((res) => {
        if (res.data.status == false) {
          console.log(res.data.message)
        } else {
          localStorage.setItem("check", res.data.status)
          let token = res.data.data.token;
          localStorage.setItem("token", token)
          navigate("/")
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <div>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true, username: "abc" }}
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
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    <p><Link href="/register">Create an Account</Link></p>
  </div>
}

export default Login;