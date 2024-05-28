import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, Flex, Spin, message } from 'antd';
import React from 'react';
import LopProps from "../../LopHoc";

type FieldType = {
  tenSinhVien?: string;
  maSinhVien: string;
  id?: number;
  lop?: LopProps;
  moTa?: string;
};

const SharedFormSinhVien: React.FC<{ isEdit: boolean }> = ({ isEdit }) => {
  const api = localStorage.getItem("api");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [idLop, setIdLop] = useState<number>();
  const [formData, setFormData] = useState<FieldType>();
  const [classData, setClassData] = useState<LopProps[]>([]);
  const [codeError, setcodeError] = useState<string>('');
  const [loading,setLoading] = useState(true);
  

  useEffect(() => {
    if (isEdit && id) {
      axios.get(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data/${id}`, {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.status === true) {
          setFormData(res.data.data);
          setIdLop(res.data.data.lop?.id);
        } else {
          console.log(res.data.message);
        }
        setLoading(false)
      })
      .catch(error => {
        if(error.response.status == 401){
          navigate("/login");
        }else{
          console.log(error)
        }
        setLoading(false)
      });
    }else{
      setLoading(false)
    }
   

    axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data`, {
      headers: {
        'API-Key': api,
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(res => {
      if (res.data.status === true) {
        setClassData(res.data.data);
      } else {
        console.log(res.data.message);
      }
    })
    .catch(error => {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.log(error);
      }
    });
  }, []);
  

  const handleSubmit = (values: FieldType) => {
    const data = {
      ...values,
      id: formData?.id,
      lop: {
        id: idLop !== undefined ? idLop : formData?.lop?.id
      },
    };
    console.log(data)

    const request = isEdit
      ? axios.put(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data`, data, {
          headers: {
            "API-Key": api,
            "Authorization": `Bearer ${token}`
          }
        })
      : axios.post(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data`, data, {
          headers: {
            "API-Key": api,
            "Authorization": `Bearer ${token}`
          }
        });

    request.then(res => {
      if (res.data.status === true) {
        isEdit ? message.success('Updated successfully !') : message.success('Created successfully !');
        navigate("/administrator/builder/data/sinh-vien.html");
      } else {
        console.log(res.data.message);
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        navigate("/login");
      } else {
          const errorDescription = error.response.data.errorDescription;
          const codeError = errorDescription.find((errorItem: any) => errorItem.field === "maSinhVien");
          if(codeError) {
            setcodeError(error.response.data.message);
          } else{
              setcodeError("")
          }
        }
    });
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleClassChange = (value: number) => {
    setIdLop(value);
  };

  if(loading){
    return (
      <Flex vertical style={{ height: '50vh' }} align="center" justify="center">
        <Spin tip="Loading..." size="large" />
      </Flex>
    );
  }

  
  return (
      <div className="edit-create">
        <h1>{isEdit ? "Edit and Update Students" : "Create New Students"}</h1>
        <Form<FieldType>
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={formData}
          onFinish={handleSubmit}
          onFinishFailed={handleFinishFailed}
          autoComplete="off"
          key={formData ? "1" : "0"}
        >
          <Form.Item<FieldType>
            label="Tên Sinh Viên"
            name="tenSinhVien"
            rules={[{ required: true, message: "Vui lòng nhập tên sinh viên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mã Sinh Viên"
            name="maSinhVien"
            rules={[{ required: true, message: "Vui lòng nhập mã sinh viên!" }]}
            validateStatus={codeError ? "error" : undefined}
            help={codeError || undefined}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô Tả "
            name="moTa"
            // rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Lớp"
            name={["lop", "id"]}
            rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
          >
            <Select
              showSearch
              style={{ textAlign: 'left' }}
              placeholder="Chọn lớp"
              optionFilterProp="children"
              allowClear
              onChange={handleClassChange}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={
                classData.map((v) => ({
                  value: v.id,
                  label: v.tenLop,
                }))
              }
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default SharedFormSinhVien;
