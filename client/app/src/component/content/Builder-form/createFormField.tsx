import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, TreeSelect, Form, Input, Select } from 'antd';
import axios from "axios";

interface DataformFieldProps {
    name: string;
    apiKey: string;
    type: string;
}
const CreateFormField = () => {

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    
    const [getData, setGetData] = useState<DataformFieldProps[]>([])
    const [nameError, setNameError] = useState<string>("");
    const [codeError, setCodeError] = useState<string>("");
    const idFFieldFrom = localStorage.getItem("idFormField");

    console.log(idFFieldFrom)
    const onFinish: FormProps<DataformFieldProps>['onFinish'] = (values) => {
        console.log('Success:', values);
          const data = {
              name : values.name,
              apiKey : values.apiKey,
              type: values.type
              
          }
          console.log(getData)
              axios.post('http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom +'/field',
              data,
              {
                  headers: {
                      "API-Key" : api,
                      "Authorization": `Bearer ${token}`
                  }
              }
              )
              .then(res =>{
                  console.log(res)
                  if(res.data.status == true){
                      alert("Thanh cong")
                      navigate("/formfield/" + idFFieldFrom)
                  }
              })
              .catch((error: any) => {
                  if(error.response.status === 401){
                      navigate("/login");
                  }else{
                  console.log(error)
                  const errorDescription = error.response.data.errorDescription;
                  const nameError = errorDescription.find((errorItem: any) => errorItem.field === "form");
                  const codeError = errorDescription.find((errorItem: any) => errorItem.field === "apiKey");
                  
              
                  if (nameError) {
                      setNameError(error.response.data.message); 
                  } else {
                      setNameError("");
                  }
                  if (codeError) {
                      setCodeError(error.response.data.message); 
                  } else {
                      setNameError("");
                  }
                  }
            });
          
      };
    const onFinishFailed: FormProps<DataformFieldProps>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    return(
        <div className='edit-folder'>
            <h1>Create Form</h1>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<DataformFieldProps>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
                validateStatus={nameError ? "error" : ""}
                help={nameError ? nameError : ""}
                >
                <Input />
                </Form.Item>

                <Form.Item<DataformFieldProps>
                label="ApiKey"
                name="apiKey"
                rules={[{ required: true, message: 'Please input your apikey!' }]}
                validateStatus={codeError ? "error" : ""}
                help={codeError ? codeError : ""}
                >
                <Input />
                </Form.Item>

                <Form.Item<DataformFieldProps>
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please input your type!' }]}

                >
                    <Select options={
                        [
                            {value: 'text',label: 'Text'},
                            {value: 'boolean',label: 'Boolean'},
                            {value: 'reference',label: 'Reference'}
                        ]
                    }>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Create
                </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default CreateFormField;