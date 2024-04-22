import React from 'react';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import type { GetProp} from 'antd';

interface DataType {
    key: string;
    tenLop: string;
    id?: string;
    maLop: string;
    moTa: string;
    tags: string[];
}

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

interface paginationProps {
    pageSize? : number;
    totalPage?: number;
    total ?: number;
    page?: number;
  }


const { Column } = Table;

const LopHoc: React.FC = () => {
   
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token =localStorage.getItem("token");
    
    const [pagination, setPagination] = useState<paginationProps>()
    console.log(pagination)
    const [getdata, setgetData] = useState<DataType[]>([]);
   
    // useEffect(()=>{
    //     axios.get("http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10",
    //         {headers:
    //             {"API-Key" : api,
    //             "Authorization": `Bearer ${token}`
    //             }
    //         }
    //     )
    //     .then(res=>{
    //         console.log(res)
    //         if(res.data.status == true){
    //             setgetData(res.data.data)
    //             // setLoading(false);
    //             setPagination(res.data.pagination)
    //         }else{
    //             console.log(res.data.message);
    //         }
    //     })
    //     .catch(function (error){
    //         console.log(error)
    //     });
    // },[]);

const [messageApi, contextHolder] = message.useMessage();
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
          const key = 'updatable';
          setgetData(newData);
          console.log(res.data.message)
          messageApi.open({
            key,
            type: 'loading',
            content: 'Đang xóa...',
          });
          setTimeout(() => {
            messageApi.open({
              key,
              type: 'success',
              content: 'Đã xóa!',
              duration: 2,
            });
          }, 1000);
       
          }else{
              console.log(res.data.message)
          }
    });
};
    
    useEffect(() => {
        fetchData(1, 10);
      }, []);
    
      const fetchData = (page: number, pageSize: number) => {
        axios
          .get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=${page}&pageSize=${pageSize}`, {
            headers: {
              'API-Key': api,
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status === true) {
              setgetData(res.data.data);
              setPagination(res.data.pagination);
            } else {
              console.log(res.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };
    
      const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        fetchData(current, pageSize);
      };
        return (
            <div>
                {contextHolder}
                <Table  dataSource={getdata}
                        pagination={pagination}
                        onChange={handleTableChange}
                >
                    <Column title="Ten Lop" dataIndex="tenLop" key="tenLop" />
                    <Column title="Ma lop" dataIndex="maLop" key="maLop" />
                    <Column title="Mo Ta" dataIndex="moTa" key="moTa" />
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
