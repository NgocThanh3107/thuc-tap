import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Space, Input, Button, Table, message } from "antd";
import type { TableProps } from 'antd';
import  { useContext, useLayoutEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, ConfigProvider, Modal} from 'antd';
import Link from "antd/es/typography/Link";

interface FormFieldProps{
    id: number;
    name: string;
    description: string;
    apiKey: string;
    type: string;
}

const FormField = () => {

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const navigate = useNavigate();
    const params = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [getData, setgetData] = useState<FormFieldProps[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [originalData, setOriginalData] = useState<FormFieldProps[]>([]);
    const [loading,setLoading] = useState(true);

      useEffect(()=>{
        axios.get('http://192.168.5.240/api/v1/builder/form/' + params.id + '/field',
        {
          headers: {
              "API-Key" : api,
              "Authorization": `Bearer ${token}`
          }
        }
        )
        .then(res =>{
          if(res.data.status === true){
              setgetData(res.data.data)
              setOriginalData(res.data.data)
          }
          setLoading(false)
        }
        )
        .catch(error=>{
          if(error.response.status === 401){
            navigate("/login");
          }else{
            console.log(error)
          }
          setLoading(false)
        })

        if (params.id) {
          localStorage.setItem('idFormField', params.id);
        }
      },[])

    const handleDelete = () => {
      Modal.confirm({
        title: `Do you want to delete ${selectedRowKeys.length} items?`,
        icon: <ExclamationCircleFilled />,
        content: 'This action cannot be undone.',

        onOk(){
          axios.delete('http://192.168.5.240/api/v1/builder/form/'+ params.id + '/field',
            {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            },
            data: selectedRowKeys
            })
            .then(res=>{
              console.log(res)
              if(res.data.status=== true){
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

                  const updatedData = getData.filter(item => !selectedRowKeys.includes(item.id as React.Key));
                  setgetData(updatedData);
                  setSelectedRowKeys([]);
              }else{
                console.log(res)
              }
            })
            .catch(error =>{
              if(error.response.status === 401){
                navigate("/login");
              }else{
                console.log(error)
              }
            });
        },
        onCancel(){
          console.log('Cancel');
        }
      })
        
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if(value ===""){
        setgetData(originalData);
      }else{
        const filteredData = originalData.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.apiKey.toLowerCase().includes(value.toLowerCase())
        );
        setgetData(filteredData);
      }
    }


    const columns: TableProps<FormFieldProps>['columns'] = [
        {
          title: 'STT',
          dataIndex: '',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'ApiKey',
          dataIndex: 'apiKey',
          key: 'apiKey',
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
              <Link href={'/administrator/internship/builder/formfield/edit/'+ record?.id + '.html'} className="ac-edit" onClick={(e) =>{ e.preventDefault(); navigate('/administrator/internship/builder/formfield/edit/'+ record?.id + '.html')}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</Link>
            </Space>
          ),
        },
    ];


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
        <div className="main-style">
            {contextHolder}
            <h1>Form Fields <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
            <div className="form-style">
              <div className="table-main">
                <div className="delete"> 
                  <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected} >
                    <i className="fa fa-trash-o" aria-hidden="true"> </i> Delete
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                  </span>
                </div>
                <div className="action"> 
                  <p className="create"><Button type="primary" onClick={() => { navigate('/administrator/internship/builder/formfield/create')}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add New</Button></p>
                  <p className='search'>
                    <Space.Compact>
                      <Input onChange={handleSearchChange} type="text" placeholder="&#xf002; Search..." style={{fontFamily: 'FontAwesome', marginLeft : 10}}/>
                    </Space.Compact>
                  </p>
                </div>
                <Table loading={loading} rowSelection={rowSelection} className="table" rowKey={'id'} columns={columns} dataSource={getData} />
              </div>
            </div>  
        </div>
    )
}
export default FormField;