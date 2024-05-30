import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, TreeSelect, message } from 'antd';
import type { FormProps } from 'antd';
import type { SyntheticEvent } from 'react';

interface DataFolderProps {
  name?: string;
  id: number;
  sort?: number;
  children: DataFolderProps[];
  parent?: ParentProps;
  description: string;
  key?: number;
}

interface ParentProps {
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
interface MyFormProps {
    isEdit: boolean;
    data?: DataFolderProps;
  }

const FolderForm: React.FC<MyFormProps> = ({ isEdit, data }) => {

  let api = localStorage.getItem("api");
  let token = localStorage.getItem("token");
  const [parentError, setParentError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [sortError, setSortError] = useState<string>("");
  const [treeData, setTreeData] = useState<DataFolderProps1[]>([]);
  const [value, setValue] = useState<string | number | null>(null);
  let navigate = useNavigate();

    useEffect(()=>{
      axios.get(`http://192.168.5.240/api/v1/folder/tree`, {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
        })
        .then(res => {
        if (res.data.status === true) {
          const formattedData = formatTreeData(res.data.data);
          setTreeData(formattedData);
        }
        })
        .catch(error => {
        if (error.response.status === 401) {
          navigate("/login");
        } else {
            console.error("Error fetching data:", error);
        }
        });
    }, []);

  const formatTreeData = (data: any[]): DataFolderProps1[] => {
    return data.map(item => ({
      value: item.id,
      title: item.name,
      children: item.children ? formatTreeData(item.children) : undefined
    }));
  };

  const onFinish: FormProps<DataFolderProps>['onFinish'] = (values) => {
    let parentValue = value;
    if (parentValue === null && data?.parent) {
      parentValue = data.parent.id;
    }

    const newdata = {
      id: data?.id,
      name: values.name,
      sort: values.sort,
      description: values?.description,
      parent: parentValue ? { id: parentValue } : null 
    };
  console.log(newdata)
    const apiEndpoint = `http://192.168.5.240/api/v1/folder`;
    const requestMethod = isEdit ? axios.put : axios.post;

    requestMethod(apiEndpoint, newdata, {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.status === true) {
          isEdit ? message.success('Updated successfully !') : message.success('Created successfully !');
          navigate("/administrator/internship/builder/folder.html");
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          navigate("/login");
        } else {
          const errorDescription = error.response.data.errorDescription;
          const parentError = errorDescription.find((errorItem: any) => errorItem.field === "parent");
          const sortError = errorDescription.find((errorItem: any) => errorItem.field === "sort");
          const nameError = errorDescription.find((errorItem: any) => errorItem.field === "name");

          setParentError(parentError ? error.response.data.message : "");
          setSortError(sortError ? error.response.data.message : "");
          setNameError(nameError ? error.response.data.message : "");
        }
      })
  };

  const onFinishFailed: FormProps<DataFolderProps>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (newValue: string | number | null) => {
    setValue(newValue);
  };

  const onPopupScroll = (e: SyntheticEvent) => {
    console.log('onPopupScroll', e);
  };

  const handleInputName = () => {
    setNameError('');
  }
  const handleInputSort = () => {
    setSortError('');
  }

  return (
    <div className="edit-create">
      <h1>{isEdit ? "Edit Folder" : "Create Folder"}</h1>
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
        <Form.Item<DataFolderProps>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
          validateStatus={nameError ? "error" : undefined}
          help={nameError || undefined }
        >
          <Input onChange={handleInputName}/>
        </Form.Item>

        <Form.Item<DataFolderProps>
          label="Sort"
          name="sort"
          rules={[{ required: true, message: 'Please input your sort!' }]}
          validateStatus={sortError ? "error" : undefined}
          help={sortError || undefined}
        >
          <Input onChange={handleInputSort}/>
        </Form.Item>

        <Form.Item<DataFolderProps>
          label="Description"
          name="description"
        >
          <Input />
        </Form.Item>

        <Form.Item<DataFolderProps>
          label="Parent"
          name={["parent", "name"]}
          validateStatus={parentError ? "error" : undefined}
          help={parentError || undefined}
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
            treeNodeFilterProp= 'title'
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FolderForm;
