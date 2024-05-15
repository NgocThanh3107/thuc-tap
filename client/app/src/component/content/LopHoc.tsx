import React from 'react';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import './_content.scss'
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
    console.log(pagination)
    const [getdata, setgetData] = useState<DataType[]>([]);
    console.log(getdata)

    const [messageApi, contextHolder] = message.useMessage();

    const [search, setSearch] = useState<string>("");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    useEffect(() => {
      fetchData(1, 10);
    }, []);

      const fetchData = (page: number, pageSize: number) => {
        axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=${page}&pageSize=${pageSize}`, {
            headers: {
              'API-Key': api,
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
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
        if (search.trim() === "") {
          setgetData(originalData);
          setPagination(undefined);
        } else {
            axios
                .get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?page=1&pageSize=10&maLop=${search}`, {
                    headers: {
                        'API-Key': api,
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    if (res.data.pagination.total > 0) {
                        setgetData(res.data.data);
                        setPagination(res.data.pagination);
                    } else {   
                        setgetData([]);      
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
              }
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

      const handleDelete = () => {
        Modal.confirm({
          title: `Do you want to delete ${selectedRowKeys.length} items?`,
          icon: <ExclamationCircleFilled />,
          content: 'This action cannot be undone.',
          onOk() {
            axios.delete("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
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
        
                  const newData = getdata.filter(item => item.id && !selectedRowKeys.includes(item.id));
                  setgetData(newData);
                  setSelectedRowKeys([]);
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
          },
            onCancel() {
              console.log('Cancel');
            }
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
          <h1>Quản lý lớp học <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{pagination?.total}</span></h1>
          <div className='s-c'>
                <p className='create'>
                    <Link href="/create_lophoc" onClick={(e) => { e.preventDefault(); navigate("/create_lophoc"); }}>
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new Class
                    </Link>
                </p>
                <p className='search'>
                  <Space.Compact>
                    <Input placeholder='Search by Class ID' value={search} onChange={handleSearchChange} />
                    <Button onClick={handleSearch} type="primary" icon={<SearchOutlined />}>
                      Search
                    </Button>
                  </Space.Compact>
                </p>
          </div>
            {contextHolder}
            <div className='table-main'>
              <div className="del-f">
                {hasSelected && (
                <Button type="primary" danger onClick={handleDelete} >
                 <i className="fa fa-trash-o" aria-hidden="true"> </i> Delete
                </Button>
                )}
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table  dataSource={getdata}
                      pagination={pagination}
                      onChange={handleTableChange}
                      rowSelection={rowSelection}
                      rowKey='id'
              >
                  <Column title="STT" dataIndex='' render={(text, record,index)=> index +1} />
                  <Column title="Ten Lop" dataIndex="tenLop" key="tenLop" />
                  <Column title="Ma lop" dataIndex="maLop" key="maLop" />
                  <Column title="Mo Ta" dataIndex="moTa" key="moTa" />
                  <Column
                      title="Action"
                      key="action"
                      render={(getdata: DataType) => (
                          <Space size="middle" className='style_a'>
                              <Link href={"/read/" + getdata?.id} onClick={(e) => { e.preventDefault(); navigate("/read/" + getdata?.id); }}>
                              <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                              </Link>
                              {/* <a className='red-color' onClick={del} id={getdata?.id}><i className="fa fa-trash" aria-hidden="true"></i> Delete</a> */}
                          </Space>
                      )}
                  />
              </Table>
            </div>   
        </div>
    )
    
}
export default LopHoc;
