import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Form, Input,Select } from 'antd';

  interface DataformFieldProps {
    name?: string;
    id: number;
    apiKey?: string;
    type?: string;
    sort?: number;
    description: string;
    isRequired: boolean;
    isUnique: boolean;
    isParent: boolean;
    isMultiple: boolean;
    displayOnList: boolean;
    displayOnListDefault: boolean;
    formCol: number;
    formHidden: boolean;
    min: string;
    max: string;
    defaultValue: string;
    referenceId: string;
    labelKey: string;
    relationship: string;
    sqlWhere: string;
  }
  interface MyFormProps {
    isEdit: boolean;
    data?: DataformFieldProps;
  }

const SharedFormField: React.FC<MyFormProps> = ({ isEdit, data }) => {

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    const idFFieldFrom = localStorage.getItem("idFormField");
    const [apiKeyErr, setApiKeyErr] = useState<string>("");
    const [sortErr, setSortErr] = useState<string>("");
    const [minErr, setMinErr] = useState<string>("");
    const [maxErr, setMaxErr] = useState<string>("");
    const [formColErr, setFormColErr] = useState<string>("");


    const onFinish: FormProps<DataformFieldProps>['onFinish'] = (values) => {
        const newdata = {
          ...values,
          id: data?.id    
        }
        const apiEndpoint = isEdit ? 'http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom + '/field' : 'http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom + '/field';
        const requestMethod = isEdit ? axios.put : axios.post;

        requestMethod(apiEndpoint, newdata, {
          headers: {
            "API-Key": api,
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => {
          if (res.data.status === true) {
            isEdit ? alert("Updated successfully") : alert("Created successfully");
            navigate("/administrator/internship/builder/formfield/" + idFFieldFrom + ".html");
          }
        })
        .catch(error => {
          console.log(error.response.data.errorDescription)
          if (error.response.status === 401) {
            navigate("/login");
          } else {
              const FilterErr = error.response.data.errorDescription;
              const errorDescription = error.response.data.errorDescription;
              const apiKeyErr = errorDescription.find((item: any) => item.fields && item.fields.includes("apiKey"));             
              const sortErr = FilterErr.find((item : any)=> item.field === "sort");
              const minErr = FilterErr.find((item : any)=> item.field === "min");
              const maxErr = FilterErr.find((item : any)=> item.field === "max");
              const formColErr = FilterErr.find((item : any)=> item.field === "formCol"); 
                if(apiKeyErr){
                  setApiKeyErr(error.response.data.message)
                }else{
                  setApiKeyErr('')
                }
                if(sortErr){
                  setSortErr(sortErr.message)
                }else{
                  setSortErr('')
                }
                if(minErr){
                  setMinErr(minErr.message)
                }else{
                  setMinErr('')
                }
                if(maxErr){
                  setMaxErr(maxErr.message)
                }else{
                  setMaxErr('')
                }
                if(formColErr){
                  setFormColErr(formColErr.message)
                }else{
                  setFormColErr('')
                }
          }
        });
        };
      
    const onFinishFailed: FormProps<DataformFieldProps>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);

    };

    return(
      <div className="edit-create">
        <h1>{isEdit ? "Edit and Update FormField" : "Create FormField"}</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues= {data} 
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          key={data ? "1" : "0"}
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
            validateStatus={apiKeyErr ? "error" : ""}
            help = {apiKeyErr ? apiKeyErr : "" }
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
                    {value: 'reference',label: 'Reference'},
                    {value: 'date',label: 'Date'},
                    {value: 'integer',label: 'Integer'}
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="Sort"
            name="sort"
            rules={[{ required: true, message: 'Please input your sort!' }]}
            validateStatus={sortErr ? "error" : ""}
            help={sortErr ? sortErr : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="Description"
            name="description"
            // rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="IsRequired"
            name="isRequired"
            rules={[{ required: true, message: 'Please input your isRequired!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="IsUnique"
            name="isUnique"
            rules={[{ required: true, message: 'Please input your isUnique!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="IsParent"
            name="isParent"
            rules={[{ required: true, message: 'Please input your isParent!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="IsMultiple"
            name="isMultiple"
            rules={[{ required: true, message: 'Please input your isMultiple!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="DisplayOnList"
            name="displayOnList"
            rules={[{ required: true, message: 'Please input your displayOnList!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="DisplayOnListDefault"
            name="displayOnListDefault"
            rules={[{ required: true, message: 'Please input your displayOnListDefault!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="FormHidden"
            name="formHidden"
            rules={[{ required: true, message: 'Please input your formHidden!' }]}
          >
            <Select options={
                [
                    {value: true ,label: 'True'},
                    {value: false,label: 'False'},
                ]
            }>
            </Select>
          </Form.Item>

            
          <Form.Item<DataformFieldProps>
            label="FormCol"
            name="formCol"
            rules={[{ required: true, message: 'Please input your formCol!' }]}
            validateStatus={formColErr ? "error" : ""}
            help={formColErr ? formColErr : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="Min"
            name="min"
            // rules={[{ required: true, message: 'Please input your min!' }]}
            validateStatus={minErr ? "error" : ""}
            help={minErr ? minErr : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="Max"
            name="max"
            // rules={[{ required: true, message: 'Please input your max!' }]}
            validateStatus={maxErr ? "error" : ""}
            help={maxErr ? maxErr : ""}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="DefaultValue"
            name="defaultValue"
            // rules={[{ required: true, message: 'Please input your defaultValue!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="ReferenceId"
            name="referenceId"
            // rules={[{ required: true, message: 'Please input your referenceId!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="LabelKey"
            name="labelKey"
            // rules={[{ required: true, message: 'Please input your labelKey!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="Relationship"
            name="relationship"
            // rules={[{ required: true, message: 'Please input your relationship!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataformFieldProps>
            label="SqlWhere"
            name="sqlWhere"
            // rules={[{ required: true, message: 'Please input your sqlWhere!' }]}
          >
            <Input />
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
export default SharedFormField;


