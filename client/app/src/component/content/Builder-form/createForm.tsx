import React from 'react';
import type { FormProps } from 'antd';
import { Button, TreeSelect, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import type { SyntheticEvent } from 'react';
import { access } from 'fs';
type FieldType = {
  name?: string;
  code?: string;
  checkAccess?: boolean;
  showView?: boolean;
  folder?: DataFolderProps
};
interface DataFolderProps {
    value: string;
    title: string | JSX.Element;
    children?: DataFolderProps[];
  }



const CreateForm: React.FC = () =>{ 

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [treeData, setTreeData] = useState<DataFolderProps[]>([]);
    const [value, setValue] = useState<string[]>();
    // console.log(value)
    const [check, setCheck] = useState<boolean>();
    const [show, setShow] = useState<boolean>();
    const [nameError, setNameError] = useState<string>("");
    const [codeError, setCodeError] = useState<string>("");

    useEffect(()=>{
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

    const formatTreeData = (data: any[]): DataFolderProps[] => {
    
      return data.map(item => ({
        value: item.id,
        title: item.name,
        children: item.children ? formatTreeData(item.children) : undefined
      }));
    };

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
    const data = {
        name : values.name,
        code : values.code,
        folder: {
            id: value
        },
        checkAccess: check,
        showView: show
        
    }
    console.log(data)
        axios.post('http://192.168.5.240/api/v1/builder/form',
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
                navigate("/administrator/internship/builder/form.html")
            }
        })
        .catch((error: any) => {
            if(error.response.status === 401){
                navigate("/login");
            }else{
            console.log(error)
            const errorDescription = error.response.data.errorDescription;
            const nameError = errorDescription.find((errorItem: any) => errorItem.field === "name");
            const codeError = errorDescription.find((errorItem: any) => errorItem.field === "code");
        
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

      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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
                <Form.Item<FieldType>
                label="Folder"
                name="folder"
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
                    />
                </Form.Item>

                <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
                validateStatus={nameError ? "error" : ""}
                help={nameError ? nameError : ""}
                >
                <Input />
                </Form.Item>

                <Form.Item<FieldType>
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please input your code!' }]}
                validateStatus={codeError ? "error" : ""}
                help={codeError ? codeError : ""}
                >
                <Input />
                </Form.Item>

                <Form.Item<FieldType>
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

                <Form.Item<FieldType>
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
                    Create
                </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default CreateForm;