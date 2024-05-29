import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import LopProps from '..';

interface MyFormProps {
    isEdit: boolean;
    data?: LopProps;
    id?: string; 
}

const SharedFormLop: React.FC<MyFormProps> = ({ isEdit, data, id }) => {
    const navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [codeError, setcodeError] = useState<string>('');
    
    const onFinish = (values: LopProps) => {
        const newData = {
            ...values,
            id: parseInt(id || '0')
        }
        console.log(newData)
        const apiEndpoint = isEdit ? `http://192.168.5.240/api/v1/builder/form/lop-hoc/data` : 'http://192.168.5.240/api/v1/builder/form/lop-hoc/data';
        const requestMethod = isEdit ? axios.put : axios.post;

        requestMethod(apiEndpoint, isEdit ? newData : values, {
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.data.status === true) {
                isEdit ? message.success('Updated successfully !') : message.success('Created successfully !');
                navigate('/administrator/builder/data/lop-hoc.html');
            } else {
                console.log(res.data.message)
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                navigate("/login");
            } else {
                const errorDescription = error.response.data.errorDescription;
                const codeError = errorDescription.find((errorItem: any) => errorItem.field === "maLop");
                if(codeError) {
                    setcodeError(error.response.data.message);
                } else{
                    setcodeError("")
                }
              }
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleInputChange = () => {
        setcodeError('');
    };
    

    return (    
        <div className="edit-create">
            <h1>{isEdit ? "Edit and Update Class" : "Create New Class"}</h1>
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
                    rules={[{ required: true, message: 'Please input your ten lop !' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mã Lớp"
                    name="maLop"
                    rules={[{ required: true, message: 'Please input your ma lop!' }]}
                    validateStatus={codeError ? "error" : undefined}
                    help={codeError || undefined}
                >
                    <Input onChange={handleInputChange}/>
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
        
    );
};

export default SharedFormLop;