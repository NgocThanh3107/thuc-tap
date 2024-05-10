import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useNavigate } from "react-router-dom";
import Link from "antd/es/typography/Link";
import './style.scss';
import { Divider, Menu, Space, Table, Dropdown, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { Button, Input} from 'antd';
import { normalize } from "path";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;

interface DataFolderProps {
  name: string;
  id: number;
  sort: number;
  children:DataFolderProps[];
  parent: DataFolderProps[];
}
interface DataType {
  key?: React.Key;
  name?: string;
  description?: string;
  id?: number;
  parent?: DataType[];
  
}
interface PaginationProps {
  pageSize? : number;
  totalPage?: number;
  total ?: number;
  page?: number;
}


const TreeFolder = () => {

  const columns: TableColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: '',
      render: (text, record, index) => index + 1,
      width: '5%',
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Action',
      dataIndex: '',
      render: (record) => (
        <div>
          <a onClick={() => navigate('/editfolder/'+ record?.id)} key="2">Edit</a>
        </div>
      )
    }
  ];


    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getData, setGetData] = useState<DataFolderProps[]>([]);
    const [getData1, setGetData1] = useState<DataType[]>([]);
    const [originalData, setOriginalData] = useState<DataFolderProps[]>([]);
    const [pagination, setPagination] = useState<PaginationProps>();
    const [IdParent, setIdParent] = useState<number | undefined>();  
    const [messageApi, contextHolder] = message.useMessage();
    const [search, setSearch] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    console.log(selectedRowKeys)
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://192.168.5.240/api/v1/folder/tree`, {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
          // console.log(res)
            if(res.data.status === true) {
              setGetData(res.data.data);
              setOriginalData(res.data.data);
            }
        })
        .catch(error=>{
          if(error.response.status == 401){
            navigate("/login");
          }else{
            console.log(error)
          }
        })

        fetchData(1, 10, undefined);
    }, []);

    const fetchData = (page: number, pageSize: number,parent: number | undefined) => {
      axios
        .get(`http://192.168.5.240/api/v1/folder?page=${page}&pageSize=${pageSize}&parent=${parent}`, {
          headers: {
            'API-Key': api,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res)
          if (res.data.pagination.total > 0) {
            setGetData1(res.data.data);
            setPagination(res.data.pagination);
        } else {   
            setGetData1([]);      
            setPagination(undefined);
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
    const convertData = (data: DataFolderProps[]): TreeDataNode[] => {
      return data.map((item) => ({
        title: (
          item.name
        ),
          key: item.id,
          isLeaf: !item.children || item.children.length === 0,
          children: item.children ? convertData(item.children) : undefined,
      }));
  };

    const treeData: TreeDataNode[] = convertData(getData);

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        console.log('Trigger Select', keys, info);
        info.selectedNodes.map((v)=>{
            setIdParent(keys[0] as number);  
            fetchData(1,10, keys[0] as number)
        })
    }
    
    const deleteFolderTreeData = (id: number) => {
      const findAndDelete = (data: DataFolderProps[], targetId: number) => {
        return data.filter(item => {
          if (item.id === targetId) {
            return false;
          }
          if (item.children && item.children.length > 0) {
            item.children = findAndDelete(item.children, targetId);
          }
          return true;
        });
      };
      setGetData(findAndDelete(getData, id));
    };
    
    const handleDelete = () => {
      axios.delete(`http://192.168.5.240/api/v1/folder`,
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

            const updatedData = getData1.filter(item => !selectedRowKeys.includes(item.id as React.Key));
            setGetData1(updatedData);
            selectedRowKeys.forEach(key => {
            deleteFolderTreeData(key as number);
          });
          setSelectedRowKeys([]);
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if(value===""){
        setGetData(originalData)
      }
    }

    const handleSearch = () =>{
      axios.get(`http://192.168.5.240/api/v1/folder?page=1&pageSize=10&name=${search}`, {
        headers: {
            'API-Key': api,
            Authorization: `Bearer ${token}`,
        },
      })
      .then(res=>{
        console.log(res)
        if (res.data.status === true) { 
          setGetData(res.data.data);
      } else {
          setGetData([]);
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


    const handleTableChange = (pagination: any) => {
      const { current, pageSize, parent } = pagination;
      fetchData(current, pageSize, IdParent);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className="folder-main">
        <h1>Folder <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
          <div className="c-c">
            <p className="add"><Link href="/create-folder" onClick={(e) => {e.preventDefault();navigate("/create-folder")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add new Folder</Link></p>
            <p className="search-form">
              <Space.Compact>
                <Input placeholder='Search folder' value={search} onChange={handleSearchChange}/>
                <Button onClick={handleSearch} type="primary">Search</Button>
              </Space.Compact>
            </p>
          </div>
          <div className="tree-table">
            <div className="tree-folder">
              <DirectoryTree
                className="folder-style"
                multiple
                defaultExpandAll
                onSelect={onSelect}
                treeData={treeData}
              />
            </div>
            {contextHolder}
            <div className="table-folder">
              <div className="del-f" style={{ marginBottom: 16 }}>
                {hasSelected && (
                <Button type="primary" danger onClick={handleDelete}>
                  Delete
                </Button>
                )}
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table   
                rowKey={"id"}             
                onChange={handleTableChange}
                pagination={pagination}
                columns={columns}
                dataSource={getData1}
                rowSelection={rowSelection}
              />
            </div>
          </div>
      </div>   
    );
}

export default TreeFolder;








