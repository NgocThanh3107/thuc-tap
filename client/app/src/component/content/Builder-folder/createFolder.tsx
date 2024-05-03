import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Select, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DataFolderProps {
  name: string;
  id: number;
  sort: number;
  children:DataFolderProps[];
  parent: DataFolderProps[];
  description: string;
}

const CreateFolder: React.FC = () => {

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [getdata, setGetData] = useState<DataFolderProps[]>([]);
    const [idParent, setIdParent] = useState<Number>();
    const [nameError, setNameError] = useState<string>("");
    const [sortError, setSortError] = useState<string>("");
    useEffect(()=>{
      axios.get(`http://192.168.5.240/api/v1/folder?page=1&pageSize=10`, {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
      })
      .then(res  =>{
        console.log(res)
        if(res.data.status === true){
          setGetData(res.data.data)
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

const onFinish: FormProps<DataFolderProps>['onFinish'] = (values) => {
  console.log('Success:', values);
    const data = {
        name : values.name,
        sort: values.sort,
        ...(idParent && { parent: { id: idParent } }),
        ...(values.description && { description: values.description })
    }
        axios.post('http://192.168.5.240/api/v1/folder',
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
                alert("Finish")
                navigate("/administrator/internship/builder/folder.html")
            }
        })
        .catch((error: any) => {
          if(error.response.status === 401){
            navigate("/login");
          }else{
          console.log(error)
          const errorDescription = error.response.data.errorDescription;
          const sortError = errorDescription.find((errorItem: any) => errorItem.field === "sort");
          const nameError = errorDescription.find((errorItem: any) => errorItem.field === "name");
      
          if (sortError) {
            setSortError(error.response.data.message); 
          } else {
              setSortError(""); 
          }
          if (nameError) {
              setNameError(error.response.data.message); 
          } else {
              setNameError("");
          }
        }
      });
    
};

const onFinishFailed: FormProps<DataFolderProps>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

  const handleChange = (value : number) => {
    setIdParent(value)
    console.log(value)
  };

    return (
    <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item<DataFolderProps>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
        validateStatus={nameError ? "error" : ""}
        help={nameError ? nameError : ""}
        >
        <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
        label="Sort"
        name="sort"
        rules={[{ required: true, message: 'Please input your sort!' }]}
        validateStatus={sortError ? "error" : ""}
        help={sortError ? sortError : ""}
        >
        <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
        label="Description"
        name="description"
        >
        <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
        label="Parent"
        name="parent"
        >
          <Select
            onChange={handleChange}
            style={{ width: 190 , textAlign: "left" }} 
            options={
              getdata.map((v, key) => {
                return {
                  value: v.id,
                  label: v.name,
                }
              })
            }
          >
          </Select>
            
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
        </Form.Item>
    </Form>
    );
}

export default CreateFolder;