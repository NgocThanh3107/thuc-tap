
import React from 'react';
import { Button, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create: React.FC = () =>{ 

  const navigate = useNavigate();
  let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    type FieldType = {
        tenLop?: string;
        maLop?: string;
        moTa?: string
      };
      
      const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log('Success:', values);
      
        const data = {
              maLop: values.maLop,
              tenLop: values.tenLop,
              moTa: values.moTa
          }
          // console.log(data)
          axios.post("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
          data,
          {
              headers: {
                  "API-Key" : api,
                  "Authorization": `Bearer ${token}`
              }
          }
          )
          .then(res=>{
            console.log(res)
              if(res.data.status == true){
                navigate("/administrator/builder/data/lop-hoc.html")
                alert("Thành công")
              }
              else{
                console.log(res.data.message)
                alert("Mã lớp đã tồn tại")
              }
          })
          .catch(error=>{
            if(error.response.status == 401){
              navigate("/login");
            }else{
              console.log(error)
            }
          })
      
      };
      
      const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

return(
  <div className='add-new'>
    <h1>Add new Class</h1>
    <Form className=''
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
        rules={[{ required: true, message: 'Enter a class name !' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Ma Lop"
        name="maLop"
        rules={[{ required: true, message: 'Enter the class code !' }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<FieldType>
        label="Mo Ta"
        name="moTa"
        rules={[{ required: true, message: 'Enter the mo ta !' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  </div>
);
}

export default Create;