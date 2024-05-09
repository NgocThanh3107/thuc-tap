import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, TreeSelect } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { SyntheticEvent } from 'react';

interface DataFolderProps {
  name: string;
  id: number;
  sort: number;
  children:DataFolderProps[];
  parent: DataFolderProps[];
  description: string;
}
interface DataFolderProps1 {
  value: string;
  title: string | JSX.Element;
  children?: DataFolderProps1[];
}

const CreateFolder: React.FC = () => {

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [treeData, setTreeData] = useState<DataFolderProps1[]>([]);
    const [value, setValue] = useState<string[]>();
    const [nameError, setNameError] = useState<string>("");
    const [sortError, setSortError] = useState<string>("");
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

    const formatTreeData = (data: any[]): DataFolderProps1[] => {
    
      return data.map(item => ({
        value: item.id,
        title: item.name,
        children: item.children ? formatTreeData(item.children) : undefined
      }));
    };

const onFinish: FormProps<DataFolderProps>['onFinish'] = (values) => {
  console.log('Success:', values);
    const data = {
        name : values.name,
        sort: values.sort,
        ...(value && { parent: { id: value } }),
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

    const onChange = (newValue: string[]) => {
      setValue(newValue); 
    };

    const onPopupScroll = (e: SyntheticEvent) => {
      console.log('onPopupScroll', e);
    };

    return (
      <div className='edit-folder'>
        <h1>Create Folder</h1>
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
            rules={[{ required: true, message: 'Please input your username!' , validateTrigger: 'onChange' }]}
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            </Form.Item>
        </Form>
    </div>
    );
}

export default CreateFolder;