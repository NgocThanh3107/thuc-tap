import React from 'react';
import { Space, Table} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LopProps from '../LopHoc';
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
    tenSinhVien: string;
    id: string;
    maSinhVien: string;
    moTa : string;
    tags: string[];
    lop : LopProps;
}

const {Column} = Table;

  const SinhVien: React.FC = () =>{

      let navigate = useNavigate();
      let api = localStorage.getItem("api");
      let token = localStorage.getItem("token");
      const [getData, setGetData] = useState<DataType[]>([]);
      const [messageApi, contextHolder] = message.useMessage();
      const [originalData, setOriginalData] = useState<DataType[]>([]);
      const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
      const [loading, setLoading] = useState(true);
      const [startSTT, setStartSTT] = useState(0);

        useEffect(() => {
            fetchData(1, 10);
          }, []);
        
          const fetchData = (page: number, pageSize: number) => {
            const start = (page - 1) * pageSize + 1;
              setStartSTT(start);
            axios
              .get(`http://192.168.5.240/api/v1/builder/form/sinh-vien/data`, {
                headers: {
                  'API-Key': api,
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                if (res.data.status === true) {
                  setGetData(res.data.data);
                  setOriginalData(res.data.data);
                } else {
                  console.log(res.data.message);
                }
                setLoading(false)
              })
              .catch(error=>{
                if(error.response.status === 401){
                  navigate("/login");
                }else{
                  console.log(error)
                }
                setLoading(false)
              });
          };
        
          const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if(value===""){
              setGetData(originalData)
            }else {
              const filteredData = originalData.filter(item =>
                item.maSinhVien.toLowerCase().includes(value.toLowerCase()) ||
                item.tenSinhVien.toLowerCase().includes(value.toLowerCase()) ||
                (item.lop && item.lop.tenLop && item.lop.tenLop.toLowerCase().includes(value.toLowerCase()))
              );
              setGetData(filteredData);
            }
          };
        
  
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
                })      
                .then(res=>{
                  if(res.data.status === true){
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
                  if(error.response.status === 401){
                    navigate("/login");
                  }else{
                    console.log(error)
                  }
                });
              },
              onCancel() {
                console.log('Cancel');
              },
            });
        };   

        const onSelectChange = (selectedRowKeys: React.Key[]) => {
          setSelectedRowKeys(selectedRowKeys);
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
        <div className='main-style'>
          <h1>Quản lý sinh viên <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
            {contextHolder}
            <div className='table-main'>
              <div className='action'>
                <div className="delete">
                  <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i> Delete
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                  </span>
                </div>
                <p className='create'>
                  <Button type="primary" onClick={() => { navigate("/administrator/builder/data/sinh-vien/create.html");}}>
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new 
                  </Button>
                </p>
                <p className='search'>
                  <Space.Compact>
                    <Input onChange={handleSearchChange} type="text" placeholder="&#xf002; Search..." style={{fontFamily: 'FontAwesome', marginLeft : 10}}/>
                  </Space.Compact>
                </p>
              </div>
              <Table  
                dataSource={getData}
                onChange={handleTableChange}
                rowSelection={rowSelection}
                rowKey='id'
                loading={loading}
              >
                <Column title="STT" dataIndex='' render={(text, record, index) => startSTT + index} /> 
                <Column title="Mã Sinh Viên" dataIndex="maSinhVien" key="maSinhVien" />
                <Column title="Tên Sinh Viên" dataIndex="tenSinhVien" key="tenSinhVien" />
                <Column title="Lớp" dataIndex="lop" key = "lop" 
                  render={(lop: LopProps) => (
                    <span>
                      {lop && lop.tenLop ? (
                          <span key={lop.id}>
                              {lop.tenLop}
                          </span> 
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
                    <Space size="middle">
                      <a className='ac-edit' href={"/administrator/builder/data/sinh-vien/edit/" + data?.id + ".html"} onClick={(e) => {e.preventDefault();navigate("/administrator/builder/data/sinh-vien/edit/" + data?.id + ".html")}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a>
                    </Space>
                  )}
                />
              </Table>
            </div>
        </div>
    )
}
export default SinhVien;
