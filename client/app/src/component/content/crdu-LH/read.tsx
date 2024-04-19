import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import React from "react";

const Read: React.FC = () => {

  let navigate = useNavigate()
  type FieldType = {
    tenLop?: string;
    maLop?: string;
    id?: number;
  };

  let api = localStorage.getItem("api");
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log('Success:', values);

      const data = {
        id: values.id,
        maLop: values.maLop,
        tenLop: values.tenLop,
        moTa: null
      }
      axios.put("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
        data,
        {
          headers: {
            "API-Key": api,
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(res=>{
        console.log(res)
        if(res.data.status == true){
          navigate("/administrator/builder/data/lop-hoc.html")
          alert("Ok")
        }
        else{
          console.log(res.data.message)
          alert("Ma Lop da ton tai ")
        }
      })

  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  let token = localStorage.getItem("token");
  const [data, setData] = useState<FieldType>();
  // console.log(data)
  const params = useParams()
  useEffect(() => {
    axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data/" + params.id,
      {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        console.log(res.data.data)
        setData(res.data.data)
      },)
  }, []);
  console.log(data?.id)

  return (
    <div className="read">
      <h1>Edit and Update</h1>
      <Form<FieldType>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          tenLop: data?.tenLop,
          maLop: data?.maLop,
          id: data?.id
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        key={data ? "1" : "0"}
      >
        <Form.Item<FieldType>
          label="Ten Lop"
          name="tenLop"
          rules={[{ required: true, message: 'Please input your ten lop!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ma lop"
          name="maLop"
          rules={[{ required: true, message: 'Please input your ma lop!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="ID"
          name="id"
          rules={[{ required: true, message: 'Please input your id!' }]}  
        >
          <Input readOnly/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
    
  )

}
export default Read;



