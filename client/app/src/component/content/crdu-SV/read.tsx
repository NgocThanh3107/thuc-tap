import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import LopProps from "../crdu-LH";
import React from 'react';
import { Select, Space } from 'antd';
// import { Value } from "sass";

const Read_sv: React.FC = () => {

  const navigate = useNavigate()
  type FieldType = {
    tenSinhVien?: string;
    maSinhVien: string;
    id?: number;
    lop?: LopProps;
  };
  const [idLop, setIdLop] = useState<Number>();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // console.log('Success:', values);

    const data = {
      id: values.id,
      maSinhVien: values.maSinhVien,
      tenSinhVien: values.tenSinhVien,
      lop: {
        id: idLop
      }
    };
    // console.log(data)

    axios.put("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
      data,
      {
        headers: {
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877",
          "Authorization": `Bearer ${token}`
        },
      }
    )
      .then(res => {
        console.log(res)
        if (res.data.status == true) {
          navigate("/administrator/builder/data/sinh-vien.html")
        } else {
          console.log(res.data.message)
        }
      })

  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  let token = localStorage.getItem("token");
  const [data, setData] = useState<FieldType>();
  const [data1, setData1] = useState<LopProps[]>([]);

  const params = useParams()
  useEffect(() => {
    axios.get("http://192.168.5.240/api/v1/builder/form/sinh-vien/data/" + params.id,
      {
        headers: {
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877",
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        // console.log(res)
        setData(res.data.data)

      },);

    axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
      {
        headers:
        {
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877",
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        // console.log(res)
        setData1(res.data.data)
      })
  }, []);



  const handleChange = (value : number) => {
    setIdLop(value)
  };
    
  return (
    <div className="read">
      <Form<FieldType>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={data}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        key={data ? "1" : "0"}
      >
        <Form.Item<FieldType>
          label="Ten Sinh Vien"
          name="tenSinhVien"
          rules={[{ required: true, message: 'Please input your ten sinh vien!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ma Sinh Vien"
          name="maSinhVien"
          rules={[{ required: true, message: 'Please input your ma sinh vien!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="ID"
          name="id"
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Lop"
          name={["lop", "id"]}
          
        >
          <Select
            onChange={handleChange}
            style={{ width: 240 }} 
            options={
              data1.map((v, key) => {
                return {
                  value: v.id,
                  label: v.tenLop,
                }
              })
            }
          >
          </Select>
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
export default Read_sv;










