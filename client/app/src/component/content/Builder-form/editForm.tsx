import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { TreeSelect, Select } from 'antd';
import type { SyntheticEvent } from 'react';
  interface DataFormProps {
    name?: string;
    id: number;
    code?: number;
    description: string;
    key?: number;
    checkAccess: boolean;
    showView: boolean;
    folder: DataFolderProps
  }
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
  interface DataFolderProps1 {
    value: string;
    title: string | JSX.Element;
    children?: DataFolderProps1[];
  }

function EditForm(){

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getdata, setGetData] = useState<DataFormProps>();
    const idFolderCu = (getdata?.folder?.id);
    const [treeData, setTreeData] = useState<DataFolderProps1[]>([]);
    const [value, setValue] = useState<string[]>();
    let params = useParams();
    let navigate = useNavigate();
    const [check, setCheck] = useState<boolean>();
    const [show, setShow] = useState<boolean>();

    useEffect(()=>{
        axios.get('http://192.168.5.240//api/v1/builder/form/'+ params.id,{
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

          axios.get(`http://192.168.5.240/api/v1/folder/tree`, {
            headers: {
              "API-Key": api,
              "Authorization": `Bearer ${token}`
            }
          })
            .then(res => {
              console.log(res);
              if (res.data.status === true) {
                const formattedData = formatTreeData(res.data.data);
                setTreeData(formattedData);
              }
            })
            .catch(error=>{
              if(error.response.status === 401){
                navigate("/login");
              }else{
              console.error("Error fetching data:", error);
              }
            });
      },[])

    const formatTreeData = (data: any[]): DataFolderProps1[] => {
    
      return data.map(item => ({
        value: item.id,
        title: item.name,
        children: item.children ? formatTreeData(item.children) : undefined
      }));
    };
  
    const onFinish: FormProps<DataFormProps>['onFinish'] = (values) => {
        console.log('Success:', values);
          const data = {
            id: getdata?.id,
            name: values.name,
            code: values.code,
            ...(values.description && { description: values.description }),
            folder: {
                id: value !== undefined ? value : idFolderCu
            },
            checkAccess: check,
            showView: show
            
          }
        axios.put(`http://192.168.5.240/api/v1/builder/form`,
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
            navigate("/administrator/internship/builder/form.html")
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
      
      const onFinishFailed: FormProps<DataFormProps>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      const onChange = (newValue: string[]) => {
        setValue(newValue); 
      };
      
      const onPopupScroll = (e: SyntheticEvent) => {
        console.log('onPopupScroll', e);
      };
      const handleCheckChange = (value: { value: boolean; label: React.ReactNode }) => {
        console.log(value.value);
        setCheck(value.value);
    };
    
    const handleShowChange = (value: { value: boolean; label: React.ReactNode }) => {
        console.log(value.value);
        setShow(value.value);
    };
    return(
      <div className="edit-folder">
        <h1>Edit and Update folder</h1>
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

          <Form.Item<DataFormProps>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataFormProps>
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your sort!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataFormProps>
            label="Description"
            name="description"
          >
            <Input />
          </Form.Item>

          <Form.Item<DataFormProps>
              label="Folder"
              name={['folder', 'name']}
              
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={onChange}
              treeData={treeData}
              onPopupScroll={onPopupScroll}
            //   defaultValue={getdata && getdata.folder && getdata.folder.name ? [getdata.folder.name] : undefined}
            />
          </Form.Item>

          <Form.Item<DataFormProps>
                label="CheckAccess"
                name="checkAccess"
                rules={[{ required: true, message: 'Please choose your checkAccess!' }]}
                >
                <Select
                    labelInValue
                    placeholder='Please Select'
                    style={{ width: '100%' }}
                    onChange={handleCheckChange}
                    options={[
                    {
                        value: true,
                        label: "True",
                    },
                    {
                        value: false,
                        label: "False",
                    },
                    ]}
                />
                </Form.Item>

                <Form.Item<DataFormProps>
                label="ShowView"
                name="showView"
                rules={[{ required: true, message: 'Please choose your showView!' }]}
                >
                <Select
                    labelInValue
                    placeholder='Please Select'
                    style={{ width: '100%' }}
                    onChange={handleShowChange}
                    options={[
                    {
                        value: true,
                        label: "True",
                    },
                    {
                        value: false,
                        label: "False",
                    },
                    ]}
                />
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
export default EditForm;


