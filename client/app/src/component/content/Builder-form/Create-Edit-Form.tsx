import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, TreeSelect, Select } from "antd";
import { useNavigate } from "react-router-dom";

interface DataFolderProps1 {
    value: string;
    title: string | JSX.Element;
    children?: DataFolderProps1[];
}

interface FormProps {
    isEdit: boolean;
    data?: any;
}

const Create_Edit_Form: React.FC<FormProps> = ({ isEdit, data }) => {
    const [treeData, setTreeData] = useState<DataFolderProps1[]>([]);
    const [value, setValue] = useState<string[]>();
    const [check, setCheck] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");

    useEffect(() => {
        if (isEdit && data) {
            setValue([data.folder.id]);
            setCheck(data.checkAccess);
            setShow(data.showView);
        }

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
    }, [isEdit, data]);

    const formatTreeData = (data: any[]): DataFolderProps1[] => {
        return data.map(item => ({
            value: item.id,
            title: item.name,
            children: item.children ? formatTreeData(item.children) : undefined
        }));
    };

    const onFinish = (values: any) => {
        const formData = {
            id: isEdit ? data.id : undefined,
            name: values.name,
            code: values.code,
            description: values.description,
            folder: {
                id: value ? value : data.folder.id
            },
            checkAccess: check,
            showView: show
        };

        const apiUrl = isEdit ? `http://192.168.5.240/api/v1/builder/form` : `http://192.168.5.240/api/v1/builder/form`;
        const method = isEdit ? 'put' : 'post';

        axios({
            method: method,
            url: apiUrl,
            data: formData,
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.data.status === true) {
                alert(isEdit ? "Updated successfully" : "Created successfully");
                navigate("/administrator/internship/builder/form.html");
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                navigate("/login");
            } else {
                console.log(error);
            }
        });
    };

    const onChange = (newValue: string[]) => {
        setValue(newValue);
    };

    const handleCheckChange = (value: { value: boolean; label: React.ReactNode }) => {
        setCheck(value.value);
    };

    const handleShowChange = (value: { value: boolean; label: React.ReactNode }) => {
        setShow(value.value);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={isEdit ? data : {}}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please input your code!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <Input />
            </Form.Item>

            <Form.Item
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
                />
            </Form.Item>

            <Form.Item
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
                        { value: true, label: "True" },
                        { value: false, label: "False" },
                    ]}
                />
            </Form.Item>

            <Form.Item
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
                        { value: true, label: "True" },
                        { value: false, label: "False" },
                    ]}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    {isEdit ? "Update" : "Create"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Create_Edit_Form;
