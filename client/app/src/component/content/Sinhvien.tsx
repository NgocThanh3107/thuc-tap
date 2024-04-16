import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import LopProps from './crdu-LH';
interface DataType {
    // key: string;
    tenSinhVien: string;
    id?: string;
    maSinhVien: string;
    tags: string[];
    lop : LopProps;
  }
const { Column } = Table;
const SinhVien: React.FC = () =>{
   
    let token = localStorage.getItem("token");
    const [data, setData] = useState<DataType[]>([]);
    // console.log(data)
    
    useEffect(()=>{
        axios.get("http://192.168.5.240//api/v1/builder/form/sinh-vien/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res=>{
            console.log(res.data.data)
            setData(res.data.data)
        });
     
    },[])
    // console.log(tenLop)

    
    const del = (e: React.MouseEvent<HTMLElement>) => { 
      e.preventDefault();
      let getId = e.currentTarget.id;
    //   console.log(getId)
      axios.delete("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
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
            const newData = data.filter(item => item.id != getId);
            setData(newData);
            console.log(res.data.message)
            }else{
                console.log(res.data.message)
            }
      })
    }
    

return (
    <div className='table-style'>
        <Table style={{width:1800 , position:'absolute', top:100, left: 250}} dataSource={data}>
            <Column title={"Ten Sinh Vien"} dataIndex="tenSinhVien" key="tenSinhVien" />
            <Column title="Ma Sinh Vien" dataIndex="maSinhVien" key="maSinhVien" />
        <Column title="Lop" dataIndex="lop" key = "lop" 
            render={(lop: LopProps) => (
                <span>
                    {lop && lop.tenLop ? (
                        <Tag color="blue" key={lop.id}>
                            {lop.tenLop}
                        </Tag>
                    ) : (
                        <span>Không có lớp</span>
                    )}
                </span>
            )}
         ></Column>
        <Column
        title="Action"
        key="action"
        render={( data: DataType) => (
            <Space size="middle" className='style_a'>
            {/* <Link href={"/create_sinhvien/" + data?.id}><i className="fa fa-plus" aria-hidden="true"></i> Create</Link> */}
            <Link href={"/read_sinhvien/" + data?.id}><i className="fa fa-book" aria-hidden="true"></i> Read</Link>
            <a onClick={del} id = {data?.id} ><i className="fa fa-trash" aria-hidden="true"></i> Delete</a>
            </Space>
        )}
        />
        </Table>
        <p><Link href={"/create_sinhvien"}><i className="fa fa-plus" aria-hidden="true"></i> Create</Link></p>
    </div>
)
}

export default SinhVien;