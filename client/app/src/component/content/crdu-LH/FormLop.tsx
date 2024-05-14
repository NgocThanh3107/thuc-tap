import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Form, Input, Button } from 'antd';
import LopProps from '.';

interface MyFormProps {
    isEdit: boolean;
    data?: LopProps;
    id?: string; // Thêm trường id vào props
}

const FormLop: React.FC<MyFormProps> = ({ isEdit, data, id }) => {
    const navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");

    const onFinish = (values: LopProps) => {
        const newData = {
            id: parseInt(id || '0'),
            maLop: values.maLop,
            tenLop: values.tenLop,
            moTa: values.moTa
        }
        console.log("newData:", newData);
        const apiEndpoint = isEdit ? `http://192.168.5.240/api/v1/builder/form/lop-hoc/data` : 'http://192.168.5.240/api/v1/builder/form/lop-hoc/data';
        const requestMethod = isEdit ? axios.put : axios.post;

        requestMethod(apiEndpoint, isEdit ? newData : values, {
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res)
            if (res.data.status === true) {
                message.success('Thành công !');
                navigate('/administrator/builder/data/lop-hoc.html');
            } else {
                message.error('Operation failed!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            message.error('Operation failed!');
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="read">
            <h1>{isEdit ? "Edit and Update Class" : "Create New Class"}</h1>
            <div className="edit-lop">
                <Form
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
                    <Form.Item
                        label="Tên Lớp"
                        name="tenLop"
                        rules={[{ required: true, message: 'Please input your ten lop!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mã Lớp"
                        name="maLop"
                        rules={[{ required: true, message: 'Please input your ma lop!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô Tả"
                        name="moTa"
                        // rules={[{ required: true, message: 'Please input your mo ta!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default FormLop;
