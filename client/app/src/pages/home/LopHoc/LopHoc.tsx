import React from 'react';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Button, Input} from 'antd';
import  { useContext, useLayoutEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, ConfigProvider, Modal} from 'antd';
import '../_pages.scss';

interface DataType {
    key: string;
    tenLop: string;
    id?: string;
    maLop: string;
    moTa: string;
    tags: string[];
    tenQuocGia: string;
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
    // const [pagination, setPagination] = useState<PaginationProps>();
    const [getData, setGetData] = useState<DataType[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    // const [search, setSearch] = useState<string>("");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [startSTT, setStartSTT] = useState(0);
      useEffect(() => {
        fetchData(1, 10);
      }, []);

        const fetchData = (page: number, pageSize: number) => {  
          const start = (page - 1) * pageSize + 1;
            setStartSTT(start);
            
          axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data`, {
            headers: {
              'API-Key': api,
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status == true) {
              setGetData(res.data.data);
              setOriginalData(res.data.data);
              // setPagination(res.data.pagination);
            } else {
              console.log(res.data.message);
            }
            setLoading(false)
          })
          .catch(error=>{
            if(error.response.status == 401){
              navigate("/login");
            }else{
              console.log(error)
            }
            setLoading(false)
          })
      };

      const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // setSearch(value);
        if (value === "") {
            setGetData(originalData);
        } else {
            const filteredData = originalData.filter(item => 
              item.maLop.toLowerCase().includes(value.toLowerCase()) ||
              item.tenLop.toLowerCase().includes(value.toLowerCase())
            );
            setGetData(filteredData);
          }
      };

      // const handleSearch = () => {
      //   if (search.trim() === "") {
      //     setGetData(originalData);
      //     // setPagination(undefined);
      //   } else {
      //       axios
      //         .get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data?maLop=${search}`, {
      //             headers: {
      //               'API-Key': api,
      //               Authorization: `Bearer ${token}`,
      //             },
      //         })
      //         .then((res) => {
      //           if (res.data.status === true) {
      //             setGetData(res.data.data);
      //             // setPagination(res.data.pagination);
      //           } else {   
      //               setGetData([]);      
      //               // setPagination(undefined);
      //           }
      //         })
      //         .catch(error=>{
      //           if(error.response.status == 401){
      //             navigate("/login");
      //           }else{
      //             console.log(error)
      //           }
      //         })
      //     }
      // }

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
            })     
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
      
                const newData = getData.filter(item => item.id && !selectedRowKeys.includes(item.id));
                setGetData(newData);
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
            });
          },
            onCancel() {
              console.log('Cancel');
            }
        });
      };

    const onSelectChange = (selectedRowKey: React.Key[]) => {
      setSelectedRowKeys(selectedRowKey);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

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
          <h1>Quản lý lớp học <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
            {contextHolder}
            <div className='table-main'>
              <div className="delete">
                <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected}>
                 <i className="fa fa-trash-o" aria-hidden="true"> </i> Delete
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <div className='action'>
                <p className='create'>
                  <Button onClick={() => { navigate("/administrator/builder/data/lop-hoc/create.html"); }}>
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new 
                  </Button>
                </p>
                <p className='search'>
                  <Space.Compact>
                  <Input onChange={handleSearchChange} type="text" placeholder="&#xf002; Search..." style={{fontFamily: 'FontAwesome', marginLeft : 10}}/>
                    {/* <Button onClick={handleSearch} type="primary">
                      Search
                    </Button> */}
                  </Space.Compact>
                </p>
              </div>
              <Table
                dataSource={getData}
                // pagination={pagination}
                onChange={handleTableChange}
                rowSelection={rowSelection}
                rowKey='id'
                loading={loading}
              >
                  <Column title="STT" dataIndex='' render={(text, record,index)=> startSTT + index} />
                  <Column title="Mã lớp" dataIndex="maLop" key="maLop" />
                  <Column title="Tên Lớp" dataIndex="tenLop" key="tenLop" />
                  <Column title="Mô Tả" dataIndex="moTa" key="moTa" />
                  <Column
                    title="Action"
                    key="action"
                    render={(getdata: DataType) => (
                      <Space size="middle">
                        <Link onClick={(e) => { e.preventDefault(); navigate("/administrator/builder/data/lop-hoc/edit/" + getdata?.id + ".html"); }}>
                          <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                        </Link>
                      </Space>
                    )}
                  />
              </Table>
            </div>   
        </div>
    );
    
}
export default LopHoc;
