import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Form, Input,Select } from 'antd';

  interface DataformFieldProps {
    name?: string;
    id: number;
    apiKey?: string;
    type?: string;
  }

function EditFormField(){

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getdata, setGetData] = useState<DataformFieldProps>();
    const params = useParams();
    let navigate = useNavigate();
    const idFFieldFrom = localStorage.getItem("idFormField");

    useEffect(()=>{
        axios.get('http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom + '/field/'+ params.id,{
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
        }
        )
        .then(res =>{
            console.log(res)
            if(res.data.status == true){
              setGetData(res.data.data);
            }
           
        })
        .catch(error =>{
            if(error.response.status === 401){
              navigate("/login");
            }else{
              console.log(error)
            }
          })

      },[])
  
    const onFinish: FormProps<DataformFieldProps>['onFinish'] = (values) => {
        console.log('Success:', values);
          const data = {
            id: getdata?.id,
            name: values.name,
            apiKey: values.apiKey,
            type: values.type      
          }

        axios.put('http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom + '/field',
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
          if(res.data.status === true){
            alert("Xong")
            navigate("/formfield/" + idFFieldFrom)
          }
        })
        .catch(error =>{
          if(error.response.status === 401){
            navigate("/login");
          }else{
            console.log(error)
          }
        })
    };
      
    const onFinishFailed: FormProps<DataformFieldProps>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return(
      <div className="edit-folder">
        <h1>Edit and Update FormField</h1>
        <br />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues= {getdata} 
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          key={getdata ? "1" : "0"}
        >

          <Form.Item<DataformFieldProps>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="ApiKey"
            name="apiKey"
            rules={[{ required: true, message: 'Please input your apikey!' }]}
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
);
    
}
export default EditFormField;


