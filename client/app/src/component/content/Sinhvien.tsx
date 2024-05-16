import React from 'react';
import { Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
import LopProps from './crdu-LH';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Button, Input} from 'antd';
import  { useContext, useLayoutEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, ConfigProvider, Modal} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
interface DataType {
    key: string;
    tenSinhVien: string;
    id?: string;
    maSinhVien: string;
    moTa : string;
    tags: string[];
    lop : LopProps;
  }
  interface paginationProps {
    pageSize? : number;
    totalPage?: number;
    total ?: number;
    page?: number;
  }

const {Column} = Table;
const SinhVien: React.FC = () =>{
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [data, setData] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState<paginationProps>()
    const [messageApi, contextHolder] = message.useMessage();
    const [originalData, setOriginalData] = useState<DataType[]>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
        useEffect(() => {
            fetchData(1, 10); 
          }, []);
        
          const fetchData = (page: number, pageSize: number) => {
            axios
              .get(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data?page=${page}&pageSize=${pageSize}`, {
                headers: {
                  'API-Key': api,
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                if (res.data.status === true) {
                  setData(res.data.data);
                  setPagination(res.data.pagination);
                  setOriginalData(res.data.data);
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
            if(value===""){
              setData(originalData)
              fetchData(1,10)
            }
          };

        // tim theo ma
        const handleSearch = () =>{
            axios.get(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data?page=1&pageSize=10&maSinhVien=${search}`, {
              headers: {
                  'API-Key': api,
                  Authorization: `Bearer ${token}`,
              },
          })
          .then((res) => {
              // console.log(res.data.pagination.total)
              if (res.data.pagination.total > 0) {
                  setData(res.data.data);
                  setPagination(res.data.pagination);
              } else {   
                  setData([]);  
                  setPagination(undefined); 
              }
          })
          .catch(error=>{
            if(error.response.status == 401){
              navigate("/login");
            }else{
              console.log(error)
            }
          })  

        // tim theo ten
          // axios.get(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data?page=1&pageSize=10&tenSinhVien=${search}`, {
          //     headers: {
          //         'API-Key': api,
          //         Authorization: `Bearer ${token}`,
          //     },
          // })
          // .then((res) => {
          //     console.log(res.data.pagination.total)
          //     if (res.data.pagination.total > 0) {
          //         setData(res.data.data);
          //         setPagination(res.data.pagination);
          //     } else {   
          //         setData([]);      
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
         
          const handleDelete = () => { 
            
            Modal.confirm({
              title: `Do you want to delete ${selectedRowKeys.length} items?`,
              icon: <ExclamationCircleFilled />,
              content: 'This action cannot be undone.',
              onOk() {
                axios.delete("http://192.168.5.240/api/v1/builder/form/sinh-vien/data",
                {
                    headers: {
                        "API-Key" : api,
                        "Authorization": `Bearer ${token}`
                    },
                    data : selectedRowKeys
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

                      const newData = data.filter(item => item.id && !selectedRowKeys.includes(item.id));
                      setData(newData);
                      setSelectedRowKeys([]);
                    }else{
                        console.log(res.data.message)
                    }
                })
              },
              onCancel() {
                console.log('Cancel');
              },
            });
    };   


    const onSelectChange = (selectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      setSelectedRowKeys(selectedRowKeys);
    };
  
    const rowSelection = {
      onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
        console.log(selectedRowKeys)


    const { locale, theme } = useContext(ConfigProvider.ConfigContext);

    useLayoutEffect(() => {
      ConfigProvider.config({
        holderRender: (children) => (
          <StyleProvider hashPriority="high">
            <ConfigProvider prefixCls="static" iconPrefixCls="icon" locale={locale} theme={theme}>
              <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
                {children}
              </App>
            </ConfigProvider>
          </StyleProvider>
        ),
      });
    }, [locale, theme]);
    return (
        <div className='table-style'>
          <h1>Quản lý sinh viên <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{pagination?.total}</span></h1>
            {contextHolder}
            <div className='s-c'>
              <p className='create'>
                  <Link href="/create_sinhvien" 
                      onClick={(e) => {e.preventDefault();
                      navigate("/create_sinhvien");
                      }}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new students
                  </Link>
              </p>
              <p className='search'>
                <Space.Compact>
                  <Input placeholder='Search by Students ID' value={search} onChange={handleSearchChange}/>
                  <Button onClick={handleSearch} type="primary" icon={<SearchOutlined />}>
                      Search
                  </Button>
                </Space.Compact>
              </p>
            </div>
            <div className='table-main'>
              <div className="del-f">
                <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected}>
                  <i className="fa fa-trash-o" aria-hidden="true"> </i> Delete
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table  dataSource={data}
                  pagination={pagination}
                  onChange={handleTableChange}
                  rowSelection={rowSelection}
                  rowKey='id'
              >
                  <Column title="STT" dataIndex='' render={(text, record,index)=> index +1} /> 
                  <Column title="Ma Sinh Vien" dataIndex="maSinhVien" key="maSinhVien" />
                  <Column title="Ten Sinh Vien" dataIndex="tenSinhVien" key="tenSinhVien" />
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
                  />
                  <Column title="Mo Ta" dataIndex="moTa" key="moTa" />
                  <Column
                  title="Action"
                  key="action"
                  render={( data: DataType) => (
                      <Space size="middle" className='style_a'>
                      <a href={"/read_sinhvien/" + data?.id} onClick={(e) => {e.preventDefault();navigate("/read_sinhvien/" + data?.id)}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a>
                      {/* <a className='red-color' onClick={del} id = {data?.id} ><i className="fa fa-trash" aria-hidden="true"></i> Delete</a> */}
                      </Space>
                  )}
                  />
              </Table>
            </div>
        </div>
    )
}
export default SinhVien;
