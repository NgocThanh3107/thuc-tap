
import React, { useEffect,useState } from 'react';
import { Button, Form, type FormProps, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LopProps from '../crdu-LH';
import { Select, Space } from 'antd';
const Create_sv: React.FC = () =>{ 

    const navigate = useNavigate();
    let api = localStorage.getItem("api");
      let token = localStorage.getItem("token");
      type FieldType = {
          tenSinhvien?: string;
          maSinhvien?: string;
          moTa?: string,
          lop?: LopProps,
          id: number
        };

        const [data1, setData1] = useState<LopProps[]>([]);
        const [lop, setLop]= useState<string>()

        useEffect(()=>{
          fetchData(1, 100);
        },[])
        const fetchData = (page : Number, pageSize: Number) => {
            axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=${page}&pageSize=${pageSize}`,
            {headers:
                {"API-Key" : api,
                "Authorization": `Bearer ${token}`
                }
            }
            )
            .then(res=>{
                console.log(res.data.data)
                setData1(res.data.data)
            })
        };
        
        const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
          if(!lop){
            alert("vui long chon lop")
          }
          else{
            const data = {
                  maSinhVien: values.maSinhvien,
                  tenSinhVien: values.tenSinhvien,
                  lop: {
                    id: lop
                  },
                  moTa: values.moTa
              }

              axios.post("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
              data,
              {
                  headers: {
                      "API-Key" : api,
                      "Authorization": `Bearer ${token}`
                  }
              }
              )
              .then(res=>{
                  if(res.data.status == true){
                    alert("Ok")
                    navigate('/administrator/builder/data/sinh-vien.html')
                  }else{
                    alert("Ma sinh vien da ton tai")
                  }
                  
              })
              .catch(error => {
                if (error.response.status === 401) {
                    console.log("Token không hợp lệ");
                    navigate("/login");
                } else {
                    console.log(error);
                }
            });
          }
        };

        const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
          console.log('Failed:', errorInfo);
        };

        const handleChange = (value: string) => {
          setLop(value)
        };
      
      
  return(
    <Form
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
        rules={[{ required: true, message: "Enter student's name!" }]}
      >
        <Input />
      </Form.Item>
  
      <Form.Item<FieldType>
        label="Ma Sinh Vien"
        name="maSinhvien"
        rules={[{ required: true, message: "Enter student's code!" }]}
      >
        <Input/>
      </Form.Item>

      {/* <Form.Item<FieldType>
        label="Mo Ta"
        name="moTa"
        rules={[{ required: true, message: "Enter mo ta!" }]}
      >
        <Input/>
      </Form.Item> */}

      <Form.Item<FieldType> 
        label = " ID"
        name="id"
        >
            <Space wrap>
                <Select
                    style={{ width: 400 , textAlign: 'left' }}
                    onChange={handleChange}
                    defaultValue={"Choose Class"}
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


