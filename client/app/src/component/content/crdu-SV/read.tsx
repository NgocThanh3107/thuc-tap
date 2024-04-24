import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, type FormProps, Input } from 'antd';
import LopProps from "../crdu-LH";
import React from 'react';
import { Select } from 'antd';

const Read_sv: React.FC = () => {
  let api = localStorage.getItem("api")
  const navigate = useNavigate()
  type FieldType = {
    tenSinhVien?: string;
    maSinhVien: string;
    id?: number;
    lop?: LopProps;
    moTa?: string;
  };
  const [idLop, setIdLop] = useState<Number>();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const data = {
      id: getdata?.id,
      maSinhVien: values.maSinhVien,
      tenSinhVien: values.tenSinhVien,
      lop: {
        id: idLop
      }
    };
    
    axios.put("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
      data,
      {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        },
      }
    )
      .then(res => {
        console.log(res)
        if (res.data.status == true) {
          navigate("/administrator/builder/data/sinh-vien.html")
          alert("ok")
        } else {
          console.log(res.data.message)
          alert("Mã sinh viên đã tồn tại")
        }
      })

  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  let token = localStorage.getItem("token");
  const [getdata, setData] = useState<FieldType>();
  const [data1, setData1] = useState<LopProps[]>([]);
  const params = useParams();

  useEffect(() => {
    axios.get("http://192.168.5.240/api/v1/builder/form/sinh-vien/data/" + params.id,
      {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      }
    )
        .then(res=> {
          console.log(res)
          if(res.data.status == true){
            setData(res.data.data)
          }else{
            console.log(res.data.message)
          }
        },)
        .catch(error =>{
          console.log(error)
        });

    fetchData(1, 100);
  }, []);

  const fetchData = (page: number, pageSize: number) => {
    axios
      .get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'API-Key': api,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          setData1(res.data.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch(error=> {
        if(error.response.status==401){
          navigate("/login")
        }else{
          console.log(error)
        }
      });
  };

  const handleChange = (value : number) => {
    setIdLop(value)
  };
    
  return (
    <div className="read">
      <h1>Edit and Update</h1>
      <Form<FieldType>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={getdata}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        key={getdata ? "1" : "0"}
      >
        <Form.Item<FieldType>
          label="Ten Sinh Vien"
          name="tenSinhVien"
          rules={[{ required: true, message: "Please enter the student's name !" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ma Sinh Vien"
          name="maSinhVien"
          rules={[{ required: true, message: "Please enter the studen't code!" }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item<FieldType>
          label="Mo Ta"
          name="moTa"
          rules={[{ required: true, message: "Please enter the mo ta!" }]}
        >
          <Input />
        </Form.Item> */}
        
        <Form.Item<FieldType>
          label="Lop"
          name={["lop", "id"]}
        >
          <Select
            onChange={handleChange}
            style={{ width: 265 , textAlign: "left" }} 
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










