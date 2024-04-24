import React from 'react';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { error } from 'console';


interface DataType {
    key: string;
    tenLop: string;
    id?: string;
    maLop: string;
    moTa: string;
    tags: string[];
}
interface PaginationProps {
    pageSize? : number;
    totalPage?: number;
    total ?: number;
    page?: number;
  }


const { Column } = Table;

const LopHoc: React.FC = () => {
   
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    
    const [originalData, setOriginalData] = useState<DataType[]>([]);

    const [pagination, setPagination] = useState<PaginationProps>()
    
    const [getdata, setgetData] = useState<DataType[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    const [search, setSearch] = useState<string>("");

    // console.log(search)
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
          const key = 'updatable';
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
          }, 300);

          const newData = getdata.filter(item => item.id != getId);
          setgetData(newData);
        } else{
              console.log(res.data.message)
          }
    })
    .catch(error=>{
      if(error.response.status == 401){
        navigate("/login");
      }else{
        console.log(error)
      }
    })
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
            // console.log(res)
            if (res.data.status == true) {
              setgetData(res.data.data);
              setOriginalData(res.data.data);
              setPagination(res.data.pagination);
            } else {
              console.log(res.data.message);
            }
          })
          .catch(error=>{
            if(error.response.status == 401){
              navigate("/login");
            }else{
              console.log(error)
            }
          })
      };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        if(value ===""){
          setgetData(originalData);
          fetchData(1,10)
        }
        
      }
      const handleSearch = () => {
            axios
                .get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10&maLop=${search}`, {
                    headers: {
                        'API-Key': api,
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    console.log(res.data.pagination.total)
                    if (res.data.pagination.total > 0) {
                        setgetData(res.data.data);
                        setPagination(res.data.pagination);
                    } else {   
                        setgetData([]);      
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
                
                // axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10&tenLop=${search}`, {
                //     headers: {
                //         'API-Key': api,
                //         Authorization: `Bearer ${token}`,
                //     },
                // })
                // .then((res) => {
                //     console.log(res.data.pagination.total)
                //     if (res.data.pagination.total > 0) {
                //         setgetData(res.data.data);
                //         setPagination(res.data.pagination);
                //     } else {   
                //         setgetData([]);      
                //     }
                // })
                // .catch((error) => {
                //     console.log(error);
                // });  
      }

      const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        fetchData(current, pageSize);
      };

    return (
        <div>
            {contextHolder}
            <div className='create'>
                <Link href="/create_lophoc" onClick={(e) => { e.preventDefault(); navigate("/create_lophoc"); }}>
                    <i className="fa fa-plus" aria-hidden="true"></i> Create
                </Link>
            </div>
            <div className='search'>
              <input type="text" placeholder='Search by class name or class code' value={search} onChange={handleSearchChange}/>
              <button type='submit' onClick={handleSearch}><i className="fa fa-search" aria-hidden="true"></i></button>
            </div>
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
            
        </div>
    )
    
}
export default LopHoc;
