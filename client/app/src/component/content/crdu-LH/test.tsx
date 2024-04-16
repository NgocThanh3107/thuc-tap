import React from 'react';
import { Space} from 'antd';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select} from 'antd';

interface DataType {
    key: string;
    tenLop: string;
    id: number;
    maLop: string;
    tags: string[];
  }

const Test: React.FC = () =>{
   
    let token = localStorage.getItem("token");
    const [getdata, setData] = useState([]);
    console.log(getdata)
    useEffect(()=>{
        axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res=>{
            // console.log(res)
            setData(res.data.data)
        })
    },[])

    const del = (e: React.MouseEvent<HTMLElement>) => { 
      e.preventDefault();
      let getId = e.currentTarget.id;
      console.log(getId)
      axios.delete("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
      {
          headers: {
              "API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
              "Authorization": `Bearer ${token}`
          },
          data : [getId]
      }        
      )
      .then(res =>{
          if(res.data.status == true){
              console.log(res.data.message)
          }
          else{
            console.log(res.data.message)
          }
      })
    }

    

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };

  return (
    <Form<DataType>
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="note" label="Note" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select
          placeholder="Select a option and change input text above"
          onChange={onGenderChange}
          allowClear
          options={
            getdata.map((v,key)=>{
              return {
                value: v
              }
            })
          }
        >

          
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({ getFieldValue }) =>
          getFieldValue('gender') === 'other' ? (
            <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

}
export default Test;



