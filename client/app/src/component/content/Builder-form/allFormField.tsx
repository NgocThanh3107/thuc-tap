import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Space, Input, Button, Table, message } from "antd";
import Link from "antd/es/typography/Link";
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface FormFieldProps{
    id: number;
    name: string;
    description: string;
    apiKey: string;
    type: string;
}
const AllFormField = () => {

        let api = localStorage.getItem("api");
        let token = localStorage.getItem("token");
        const navigate = useNavigate();
        const params = useParams();
        const [messageApi, contextHolder] = message.useMessage();
        const [getData, setgetData] = useState<FormFieldProps[]>([])
        const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
        const [search, setSearch] = useState<string>("");
        const [originalData, setOriginalData] = useState<FormFieldProps[]>([]);
        
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
        }
        )

        if (params.id) {
            localStorage.setItem('idFormField', params.id);
        }
    },[])

    const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        axios.delete('http://192.168.5.240/api/v1/builder/form/'+ params.id + '/field',
            {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            },
            data: selectedRowKeys
            }
        )
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
            setSearch(value);
            if(value ===""){
                setgetData(originalData);
            }
        }

        const handleSearch = () => {
            if (search.trim() === "") {
                setgetData(originalData);
            } else {
                axios
                    .get(`http://192.168.5.240/api/v1/builder/form/`+ params.id +`/field?apiKey=${search}`, {
                        headers: {
                            'API-Key': api,
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                      if(res.data.status===true){
                        setgetData(res.data.data)
                      }else{
                        setgetData([]);
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
              render: (text) => <a>{text}</a>,
            },
            {
              title: 'ApiKey',
              dataIndex: 'apiKey',
              key: 'apiKey',
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
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
                <Space className="style_a" size="middle">
                  <a onClick={(e) =>{ e.preventDefault(); navigate('/editformfield/'+ record?.id)}} href={"/editformfield/" + record?.id}>Edit</a>
                </Space>
              ),
            },
          ];

    return(
        <div className="table-style">
            {contextHolder}
            <h1>Form Fields <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
            <div className="c-c">
                <p className='search-form'>
                    <Space.Compact>
                    <Input placeholder='Search by apiKey ' value={search} onChange={handleSearchChange}/>
                    <Button onClick={handleSearch} type="primary" icon={<SearchOutlined />}>
                      Search
                    </Button>
                    </Space.Compact>
                </p>
                <p className="add"><Link href="/create-formfield" onClick={(e) => {e.preventDefault();navigate("/create-formfield")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add New</Link></p>
            </div>
            <div className="form-style">
                <div className="table-main">
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
                <Table rowSelection={rowSelection} className="table" rowKey={'id'} columns={columns} dataSource={getData} />
                </div>
            </div>  
        </div>
    )
}
export default AllFormField;