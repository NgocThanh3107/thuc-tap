
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table, message, Input, Button } from 'antd';
import type { TableProps } from 'antd';
import { useNavigate } from "react-router-dom";
import  { useContext, useLayoutEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, ConfigProvider, Modal} from 'antd';

interface DataFormProps{
    id: number;
    folder: DataFolderProps;
    name: string;
    code: string;
    description: string;
}
interface DataFolderProps {
    name: string;
    id: number;
    sort: number;
    children:DataFolderProps[];
    parent: DataFolderProps[];
  }
  
      
    const Form: React.FC = () =>{

        let api = localStorage.getItem("api");
        let token = localStorage.getItem("token");
        const navigate = useNavigate();
        const [getData, setGetData] = useState<DataFormProps[]>([]);
        const [messageApi, contextHolder] = message.useMessage();
        const [originalData, setOriginalData] = useState<DataFormProps[]>([]);
        const [search, setSearch] = useState<string>("");
        const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
        const [loading, setLoading] = useState(true);
          useEffect(() => {
            axios.get(`http://192.168.5.240/api/v1/builder/form`, {
              headers: {
                'API-Key': api,
                Authorization: `Bearer ${token}`,
              },
              })
              .then((res) => {
                console.log(res)
                if (res.data.status == true) {
                  setGetData(res.data.data);
                  setOriginalData(res.data.data);
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
              });
          }, []);
      

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        if(value ===""){
          setGetData(originalData);
        }
      }

      const handleSearch = () => {
        if (search.trim() === "") {
          setGetData(originalData);
        } else {
            axios
              .get(`http://192.168.5.240/api/v1/builder/form?code=${search}`, {
                  headers: {
                      'API-Key': api,
                      Authorization: `Bearer ${token}`,
                  },
              })
              .then((res) => {
                if(res.data.status===true){
                  setGetData(res.data.data)
                }else{
                  setGetData([]);
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
      }
        
        const columns: TableProps<DataFormProps>['columns'] = [
          {
            title: 'STT',
            dataIndex: '',
            render: (text, record, index) => index + 1
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
          },
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Action',
            key: 'action',
            render: (record) => (
              <Space size="middle">
                <a onClick={(e) =>{ e.preventDefault(); navigate('/administrator/internship/builder/form/edit/'+ record?.id + '.html')}} >Edit</a>
                <a onClick={(e) =>{ e.preventDefault(); navigate('/administrator/internship/builder/formfield/'+ record?.id + '.html')}} >Form Field</a>
              </Space>
            ),
          },
        ];

    const handleDelete = () => {
      Modal.confirm({
        title: `Do you want to delete ${selectedRowKeys.length} items?`,
        icon: <ExclamationCircleFilled />,
        content: 'This action cannot be undone.',
        onOk() {
          axios.delete(`http://192.168.5.240/api/v1/builder/form`, {
            headers: {
              "API-Key": api,
              "Authorization": `Bearer ${token}`
            },
            data: selectedRowKeys
            })
            .then(res => {
              if (res.data.status === true) {
                const key = 'updatable';
                messageApi.open({
                  key,
                  type: 'loading',
                  content: 'Deleting...',
                });
                setTimeout(() => {
                  messageApi.open({
                    key,
                    type: 'success',
                    content: 'Deleted successfully!',
                    duration: 2,
                  });
                }, 300);
  
                const updatedData = getData.filter(item => !selectedRowKeys.includes(item.id as React.Key));
                setGetData(updatedData);
  
                setSelectedRowKeys([]);
              } else {
                console.log(res)
              }
            })
            .catch(error => {
              if (error.response.status === 401) {
                navigate("/login");
              } else {
                console.log(error)
              }
            });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
          
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
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
  
    return(
      <div className="table-style">
        {contextHolder}
        <h1>Form <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
        <div className="form-style">
          <div className="table-main">
            <div className="delete">     
              <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected} ><i className="fa fa-trash-o" aria-hidden="true"> </i> Delete</Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
            </div>
            <div className="action">
              <p className="create"><Button onClick={() => {navigate("/administrator/internship/builder/form/create.html")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add new Form</Button></p>
              <p className='search'>
                <Space.Compact>
                  <Input placeholder='Search by code ' value={search} onChange={handleSearchChange}/>
                  <Button onClick={handleSearch} type="primary" >
                    Search
                  </Button>
                </Space.Compact>
              </p>
            </div>
          <Table loading={loading} className="table" rowKey={'id'} rowSelection={rowSelection} columns={columns} dataSource={getData} />
          </div>
        </div>
      </div>
    );
      
    }
  
  export default Form;
  

  
  

