import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import LopProps from './crdu-LH';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import type { GetProp} from 'antd';
interface DataType {
    // key: string;
    tenSinhVien: string;
    id?: string;
    maSinhVien: string;
    moTa : string;
    tags: string[];
    lop : LopProps;
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
const { Column } = Table;
const SinhVien: React.FC = () =>{
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [data, setData] = useState<DataType[]>([]);

    const [messageApi, contextHolder] = message.useMessage();
    // console.log(data)
    
    useEffect(()=>{
        axios.get("http://192.168.5.240//api/v1/builder/form/sinh-vien/data?page=1&pageSize=10",
            {headers:
                {"API-Key" : api,
                "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(res =>{
            if(res.data.status == true){
                setData(res.data.data);
                setTableParams({
                    ...tableParams,
                    pagination: {
                     ...tableParams.pagination,
                     total: 20,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
            }else{
                console.log(res.data.message)
            }   
        });
     
    },[])

    
    const del = (e: React.MouseEvent<HTMLElement>) => { 
      e.preventDefault();
      let getId = e.currentTarget.id;
    //   console.log(getId)
      axios.delete("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
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
            const newData = data.filter(item => item.id != getId);
            setData(newData);
            console.log(res.data.message)
            }else{
                console.log(res.data.message)
            }
      })

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
        }, 1000);
        };


        const [tableParams, setTableParams] = useState<TableParams>({
            pagination: {
              current: 1,
              pageSize: 7,
            },
          });
        
          const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
            setTableParams({
              pagination,
              filters,
              ...sorter,
            });
        
            if (pagination.pageSize !== tableParams.pagination?.pageSize) {
              setData([]);
            }
          };

return (
    <div>
        {contextHolder}
        <Table  dataSource={data}  
                // rowKey={(data) => data.id}
                pagination={tableParams.pagination}
                // loading={loading}
                onChange={handleTableChange}>
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
            <Column title="Mo Ta" dataIndex="moTa" key="moTa" />
            <Column
            title="Action"
            key="action"
            render={( data: DataType) => (
                <Space size="middle" className='style_a'>
                {/* <Link href={"/create_sinhvien/" + data?.id}><i className="fa fa-plus" aria-hidden="true"></i> Create</Link> */}
                <a href={"/read_sinhvien/" + data?.id} onClick={(e) => {e.preventDefault();navigate("/read_sinhvien/" + data?.id)}}><i className="fa fa-book" aria-hidden="true" ></i> Edit</a>
                <a onClick={del} id = {data?.id} ><i className="fa fa-trash" aria-hidden="true"></i> Delete</a>
                </Space>
            )}
            />
        </Table>
        <div className='create'>
            <Link href="/create_sinhvien" 
                onClick={(e) => {e.preventDefault();
                navigate("/create_sinhvien");
                }}>
                <i className="fa fa-plus" aria-hidden="true"></i> Create
            </Link>
        </div>
    </div>
)
}

export default SinhVien;