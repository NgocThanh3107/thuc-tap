import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { Select } from 'antd';
  interface DataFolderProps {
    name?: string;
    id: number;
    sort?: number;
    children:DataFolderProps[];
    parent?: ParentProps;
    description: string;
    key?: number;
  }
  interface ParentProps{
    name?: string;
    id: number;
    sort?: number;
    description?: string;
  }

function EditFolder(){
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getdata, setGetData] = useState<DataFolderProps>();
    const [getdata1, setGetData1] = useState<DataFolderProps[]>([]);
    const [idParent,setIdParent] = useState<number | undefined>(undefined);
    // const [parent, setParent] = useState<ParentProps>();
    console.log(getdata)
    let params = useParams();
    let navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://192.168.5.240/api/v1/folder/'+ params.id,{
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
              // setParent(res.data.data.parent);
            }
           
        })
        .catch(error=>{
            if(error.response.status === 401){
              navigate("/login");
            }else{
              console.log(error)
            }
          })

          axios.get(`http://192.168.5.240/api/v1/folder?page=1&pageSize=10`, {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
          })
          .then(res  =>{
            console.log(res)
            if(res.data.status === true){
              setGetData1(res.data.data)
            }
          })
    },[])
  
    const onFinish: FormProps<DataFolderProps>['onFinish'] = (values) => {
        console.log('Success:', values);
          const data = {
            id: getdata?.id,
            name: values.name,
            sort: values.sort,
            description: values.description,
            ...(idParent && { parent: { id: idParent } })
          }
        axios.put(`http://192.168.5.240/api/v1/folder`,
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
            navigate("/administrator/internship/builder/folder.html")
          }
        })
        .catch(error=>{
          if(error.response.status === 401){
            navigate("/login");
          }else{
            console.log(error)
          }
        })
    };
      
      const onFinishFailed: FormProps<DataFolderProps>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      const handleChange = (value : number) => {
        setIdParent(value)
        // console.log(value)
      };
    return(
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

        <Form.Item<DataFolderProps>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
          label="Sort"
          name="sort"
          rules={[{ required: true, message: 'Please input your sort!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your description!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
            label="Parent"
            name={["parent", "id"]}
            
        >
          <Select
            onChange={handleChange}
            style={{ width: 265, textAlign: "left" }}
            options={
              getdata1.map((v, key) => {
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
            Update
          </Button>
        </Form.Item>
      </Form>
);
    
}
export default EditFolder;


