  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Form, Input, Button, TreeSelect, Select, message } from "antd";

  interface DataFormProps {
    name?: string;
    id?: number;
    code?: number;
    description?: string;
    checkAccess?: boolean;
    showView?: boolean;
    folder?: DataFolderProps;
  }

  interface DataFolderProps {
    name?: string;
    id: number;
    sort?: number;
    children?: DataFolderProps[];
    parent?: ParentProps;
    description?: string;
  }

  interface ParentProps {
    name?: string;
    id: number;
    sort?: number;
    description?: string;
  }

  interface MyFormProps {
    isEdit: boolean;
    data?: DataFormProps;
  }

  const SharedForm: React.FC<MyFormProps> = ({ isEdit, data }) => {
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [treeData, setTreeData] = useState<DataFolderProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nameError, setNameError] = useState<string>("");
    const [codeError, setCodeError] = useState<string>("");

      useEffect(() => {
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
            setLoading(false);
          })
          .catch(error => {
            if (error.response.status === 401) {
              navigate("/login");
            } else {
              console.error("Error fetching data:", error);
            }
            setLoading(false);
          });
      }, []);

    const formatTreeData = (data: any[]): DataFolderProps[] => {
      return data.map(item => ({
        id: item.id,
        name: item.name,
        title: item.name,
        value: item.id.toString(), 
        children: item.children ? formatTreeData(item.children) : undefined
      }));
    };

    const onFinish = (values: DataFormProps) => {
      const newData = {
        ...values,
        id: data ? data.id : undefined,    
      };

      const apiEndpoint = isEdit ? `http://192.168.5.240/api/v1/builder/form` : `http://192.168.5.240/api/v1/builder/form`;
      const requestMethod = isEdit ? axios.put : axios.post;

      requestMethod(apiEndpoint, newData, {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.status === true) {
          isEdit ? message.success('Updated successfully !') : message.success('Created successfully !');
          navigate("/administrator/internship/builder/form.html");
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          navigate("/login");
        } else {
          const errorDescription = error.response.data.errorDescription;
          const nameError = errorDescription.find((errorItem: any) => errorItem.field === "name");
          const codeError = errorDescription.find((errorItem: any) => errorItem.field === "code");
          if(nameError){
            setNameError(error.response.data.message)
          } else {
            setNameError("")
          }
          if(codeError) {
            setCodeError(error.response.data.message)
          } else {
            setCodeError("")
          }
        }
      });
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const handleInputName = () => {
      setNameError('')
    }
    const handleInputCode = () => {
      setCodeError('')
    }
    return (
      <div className="edit-create">
        <h1>{isEdit ? "Edit and Update form" : "Create New Form"}</h1>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={data}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            validateStatus={nameError ? "error" : undefined}
            help={nameError || undefined}
          >
            <Input onChange={handleInputName}/>
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }]}
            validateStatus={codeError ? "error" : undefined}
            help={codeError || undefined}
          >
            <Input onChange={handleInputCode}/>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Folder"
            name={['folder', 'id']}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              treeData={treeData}
              loading={loading}
              treeNodeFilterProp="title"
            />
          </Form.Item>

          <Form.Item
            label="CheckAccess"
            name="checkAccess"
            rules={[{ required: true, message: 'Please choose your checkAccess!' }]}
          >
            <Select
              placeholder='Please Select'
              style={{ width: '100%' }}
              options={[
                { value: true, label: "True" },
                { value: false, label: "False" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="ShowView"
            name="showView"
            rules={[{ required: true, message: 'Please choose your showView!' }]}
          >
            <Select
              placeholder='Please Select'
              style={{ width: '100%' }}
              options={[
                { value: true, label: "True" },
                { value: false, label: "False" }
              ]}
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
  };

  export default SharedForm;
