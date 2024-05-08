
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table, message, Input, Button } from 'antd';
import type { TableProps } from 'antd';
import Link from "antd/es/typography/Link";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/transfer/search";
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
  
      
    const AllForm: React.FC = () =>{

        let api = localStorage.getItem("api");
        let token = localStorage.getItem("token");
        const navigate = useNavigate();
        const [getData, setGetData] = useState<DataFormProps[]>([]);
        const [messageApi, contextHolder] = message.useMessage();
        const [originalData, setOriginalData] = useState<DataFormProps[]>([]);
        const [search, setSearch] = useState<string>("");
        useEffect(() => {
          axios.get(`http://192.168.5.240/api/v1/builder/form`, {
              headers: {
                'API-Key': api,
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res.data.status == true) {
                setGetData(res.data.data);
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
            title: 'Folder',
            dataIndex: ['folder', 'name'],
            key: 'folder',
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
                <a className='red-color' href="" onClick={(e) =>{ e.preventDefault(); handleDelete(record?.id)}}>Delete</a>
                <a onClick={(e) =>{ e.preventDefault(); navigate('/editform/'+ record?.id)}} href={"/editform/" + record?.id}>Edit</a>
              </Space>
            ),
          },
        ];

        const handleDelete = (idForm : number) => {
          axios.delete(`http://192.168.5.240/api/v1/builder/form`,
            {
              headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
              },
              data: [idForm]
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
              setGetData(prevData => prevData.filter(form => form.id !== idForm));
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
        
    return(
      <div className="table-style">
        {contextHolder}
        <h1>Form <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
        <div className="s-c">
          <p className="create"><Link href="/create-form" onClick={(e) => {e.preventDefault();navigate("/create-form")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Thêm mới</Link></p>
          <p className='search'>
            <Space.Compact>
              <Input placeholder='Search by code ' value={search} onChange={handleSearchChange}/>
              <Button onClick={handleSearch}  type="primary">Search</Button>
            </Space.Compact>
          </p>
          <p className="filter"><Link href="/filterform" onClick={(e) => {e.preventDefault();navigate("/filterform")}}><i className="fa fa-filter" aria-hidden="true"></i> Filter</Link></p>
        </div>
        <Table columns={columns} dataSource={getData} />
      </div>
    );
      
    }
  
  export default AllForm;
  