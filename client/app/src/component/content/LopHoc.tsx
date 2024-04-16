import React from 'react';
import { Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import { Outlet } from 'react-router-dom';

interface DataType {
    key: string;
    tenLop: string;
    id?: string;
    maLop: string;
    tags: string[];
  }
const { Column } = Table;
const LopHoc: React.FC = () =>{
   
    let token = localStorage.getItem("token");
    const [getdata, setData] = useState<DataType[]>([]);
   
    useEffect(()=>{
        axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res=>{
            // console.log(res.data.data)
            setData(res.data.data)
        })
    },[])

    const del = (e: React.MouseEvent<HTMLElement>) => { 
      e.preventDefault();
      const getId = e.currentTarget.id;
      axios.delete("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
      {
          headers: {
              "API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
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
    <div className='table-style'>
        <Table style={{width:1800 , position:'absolute', top:100, left: 250}} dataSource={getdata}>
            <Column title={"Ten Lop"} dataIndex="tenLop" key="tenLop" />
            <Column title="Ma lop" dataIndex="maLop" key="maLop" />
            {/* <Column title="Id" dataIndex="id" key="id" /> */}
            <Column
            title="Action"
            key="action"
            render={( getdata: DataType) => (
                <Space size="middle" className='style_a'>
                {/* <Link href={"/create/" + getdata?.id}><i className="fa fa-plus" aria-hidden="true"></i> Create</Link> */}
                <Link href={"/read/" + getdata?.id}><i className="fa fa-book" aria-hidden="true"></i> Read</Link>
                <a onClick={del} id = {getdata?.id} ><i className="fa fa-trash" aria-hidden="true"></i> Delete</a>
                </Space>
            )}
            />
        </Table>
        <p><Link href='/create_lophoc'><i className="fa fa-plus" aria-hidden="true"></i> Create</Link></p>
    
    </div>
)
}

export default LopHoc;

