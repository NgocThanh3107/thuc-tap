import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import LopProps from "../crdu-LH";

const FormSinhVien: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  const api = localStorage.getItem("api");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  type FieldType = {
    tenSinhVien?: string;
    maSinhVien: string;
    id?: number;
    lop?: LopProps;
    moTa?: string;
  };

  const [idLop, setIdLop] = useState<number>();
  const [formData, setFormData] = useState<FieldType>();
  const [classData, setClassData] = useState<LopProps[]>([]);
  const [codeError, setcodeError] = useState<string>('');
  useEffect(() => {
    if (isEditing && id) {
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
      })
      .catch(error => {
        console.log(error);
      });
    }
    fetchClassData(1, 100);
  }, [id, isEditing]);

  const fetchClassData = (page: number, pageSize: number) => {
    axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=${page}&pageSize=${pageSize}`, {
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
  };

  const handleSubmit = (values: FieldType) => {
    const data = {
      id: formData?.id,
      maSinhVien: values.maSinhVien,
      tenSinhVien: values.tenSinhVien,
      lop: {
        id: idLop !== undefined ? idLop : formData?.lop?.id
      },
      moTa: values.moTa || null
    };

    const request = isEditing
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
        isEditing ? alert("Updated successfully") : alert("Created successfully");
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

  return (
      <div className="edit-create">
        <h1>{isEditing ? "Edit and Update Students" : "Create New Students"}</h1>
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
            validateStatus={codeError ? "error" : ""}
            help={codeError ? codeError : ""}
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
          >
            <Select
              style={{ textAlign: 'left' }}
              onChange={handleClassChange}
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
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default FormSinhVien;
