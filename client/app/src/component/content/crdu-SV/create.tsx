
import React, { useEffect,useState } from 'react';
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LopProps from '../crdu-LH';
import { Select, Space } from 'antd';
import { Value } from 'sass';
const Create_sv: React.FC = () =>{ 

    const navigate = useNavigate();
      let token = localStorage.getItem("token");
      type FieldType = {
          tenSinhvien?: string;
          maSinhvien?: string;
          moTa?: null,
          lop?: LopProps,
          id: number
        };

        const [data1, setData1] = useState<LopProps[]>([]);
        const [lop, setLop]= useState("")

        useEffect(()=>{
          axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res=>{
            console.log(res.data.data)
            setData1(res.data.data)
        })
        },[])
        const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
          // console.log('Success:', values);
        
          const data = {
                maSinhVien: values.maSinhvien,
                tenSinhVien: values.tenSinhvien,
                lop: {
                  id: lop
                },
                moTa: null
            }

          console.log(data)

            axios.post("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
            data,
            {
                headers: {
                    "API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                    "Authorization": `Bearer ${token}`
                }
            }
            )
            .then(res=>{
              console.log(res)
                if(res.data.status == true){
                  navigate("/administrator/builder/data/sinh-vien.html")
                }
                else{
                  console.log(res.data.message)
                }
            })
        
        };
        
        const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
          console.log('Failed:', errorInfo);
        };

        const handleChange = (value: string) => {
          // console.log(`selected ${value}`);
         setLop(value)
      
        };
      
  
  return(
    <Form className='create'
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      // autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Ten Sinh Vien"
        name="tenSinhvien"
        rules={[{ required: true, message: 'Nhap ten lop!' }]}
      >
        <Input />
      </Form.Item>
  
      <Form.Item<FieldType>
        label="Ma Sinh Vien"
        name="maSinhvien"
        rules={[{ required: true, message: 'Nhap ma lop!' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item<FieldType> 
        label = " ID"
        name="id"
        // rules={[{ required: true, message: 'Chon id lop!' }]}
        >
            <Space wrap>
                <Select
                    style={{ width: 195 }}
                    onChange={handleChange}
                    defaultValue={"Chon Lop"}
                    options={
                      data1.map((v,key)=>{
                        return {
                          value: v.id,
                          label: v.tenLop
                        }
                      })
                    }
                >
                </Select>
            </Space>
        </Form.Item>
  
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
  }
  
  export default Create_sv;