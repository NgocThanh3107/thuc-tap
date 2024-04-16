

import React from 'react';
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Location } from 'react-router-dom';

const Create: React.FC = () =>{ 

  const navigate = useNavigate();
    let token = localStorage.getItem("token");
    type FieldType = {
        tenLop?: string;
        maLop?: string;
        moTa?: null
      };
      
      const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log('Success:', values);
      
        const data = {
              maLop: values.maLop,
              tenLop: values.tenLop,
              moTa: null
          }
          axios.post("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
          data,
          {
              headers: {
                  "API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                  "Authorization": `Bearer ${token}`
              }
          }
          )
          .then(res=>{
            console.log(res)
              if(res.data.status == true){
                navigate("/administrator/builder/data/lop-hoc.html")
              }
              else{
                console.log(res.data.message)
              }
          })
      
      };
      
      const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

       const a= useOutletContext();
       console.log(a)
return(
  <Form className='create'
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    // autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Ten Lop"
      name="tenLop"
      rules={[{ required: true, message: 'Nhap ten lop!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Ma Lop"
      name="maLop"
      rules={[{ required: true, message: 'Nhap ma lop!' }]}
    >
      <Input/>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form.Item>
  </Form>
);
}

export default Create;