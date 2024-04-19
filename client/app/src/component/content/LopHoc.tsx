import React from 'react';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import { useNavigate } from 'react-router-dom';


interface DataType {
    key: string;
    tenLop: string;
    id?: string;
    maLop: string;
    tags: string[];
}

const { Column } = Table;

const LopHoc: React.FC = () => {
   
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token =localStorage.getItem("token");

    const check = !! token;
    console.log(check)

    
    const [getdata, setData] = useState<DataType[]>([]);
   
    useEffect(()=>{
       
        axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : api,
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res=>{
            console.log(res)
            if(res.data.status == true){
                setData(res.data.data)
            }else{
                console.log(res.data.message);
            }
        })
        .catch(function (error){
            console.log(error)
        });
    },[])


const del = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const getId = e.currentTarget.id;
    axios.delete("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
    {
        headers: {
            "API-Key" : api,
            "Authorization": `Bearer ${token}`
        },
        data : [getId]
    }        
    )
    .then(res=>{
        if(res.data.status == true){
          const newData = getdata.filter(item => item.id != getId);
          setData(newData);
          console.log(res.data.message)
          }else{
              console.log(res.data.message)
          }
    })
  }
  
        return (
            <div>
                <Table dataSource={getdata}>
                    <Column title={"Ten Lop"} dataIndex="tenLop" key="tenLop" />
                    <Column title="Ma lop" dataIndex="maLop" key="maLop" />
                    <Column
                        title="Action"
                        key="action"
                        render={(getdata: DataType) => (
                            <Space size="middle" className='style_a'>
                                <Link href={"/read/" + getdata?.id} onClick={(e) => { e.preventDefault(); navigate("/read/" + getdata?.id); }}>
                                    <i className="fa fa-book" aria-hidden="true"></i> Edit
                                </Link>
                                <a onClick={del} id={getdata?.id}><i className="fa fa-trash" aria-hidden="true"></i> Delete</a>
                            </Space>
                        )}
                    />
                </Table>
                <div className='create'>
                    <Link href="/create_lophoc" onClick={(e) => { e.preventDefault(); navigate("/create_lophoc"); }}>
                        <i className="fa fa-plus" aria-hidden="true"></i> Create
                    </Link>
                </div>
            </div>
        )
    
}
export default LopHoc;

