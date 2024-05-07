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
  key: React.Key;
  name: string;
  description: string;
  id: number;
  parent: DataType[];
}
interface PaginationProps {
  pageSize? : number;
  totalPage?: number;
  total ?: number;
  page?: number;
}


const TreeFolder = () => {

  // const menu = (
  //   <Menu>
  //     <Menu.Item onClick={() => handleDelete(record.id)} key="1">Delete</Menu.Item>
  //     <Menu.Item key="2">Edit</Menu.Item>
  //   </Menu>
  // );
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
      // render: (text: string) => <a>{text}</a>,
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
          <Dropdown overlay={
            <Menu>
              <Menu.Item onClick={() => handleDelete(record?.id)} key="1">Delete</Menu.Item>
              <Menu.Item onClick={() => navigate('/editfolder/'+ record?.id)} key="2">Edit</Menu.Item>
            </Menu>
          } trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <i className="fa fa-bars" aria-hidden="true"></i>
            </a>
          </Dropdown>
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

    // console.log(IdParent)
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://192.168.5.240/api/v1/folder/tree`, {
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
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
        // info.selectedNodes.map((v)=>{
              setIdParent(keys[0] as number);  
            fetchData(1,10, keys[0] as number)
        // })
    }
    

    const removeNode = (treeData: DataFolderProps[], id: number): DataFolderProps[] => {
      return treeData.map(node => {
        if (node.id === id) {
          return [];
        }
        if (node.children) {
          return {
            ...node,
            children: removeNode(node.children, id)
          };
        }
        return node;
      }).flat();
    };
    
    const handleDelete = (folderId: number) => {
      console.log(folderId)
      axios.delete(`http://192.168.5.240/api/v1/folder`,
        {
          headers: {
            "API-Key" : api,
            "Authorization": `Bearer ${token}`
          },
          data: [folderId]
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

          setGetData1(prevData => prevData.filter(folder => folder.id !== folderId));
          setGetData(prevTreeData => {
            const newTreeData = removeNode(prevTreeData, folderId);
            return newTreeData;
          });
          
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
      fetchData(current, pageSize, parent);
    };

    return (
      <div className="folder-main">
        <h1>Folder</h1>
          <div className="c-c">
            <p className="filter"><Link href="/create-folder" onClick={(e) => {e.preventDefault();navigate("/create-folder")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add new Folder</Link></p>
            <p className="filter"><Link href="/choosefolder" onClick={(e) => {e.preventDefault();navigate("/choosefolder")}}><i className="fa fa-filter" aria-hidden="true"></i> Filter</Link></p>
            <p className='search-table'>
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
              <Table 
                onChange={handleTableChange}
                pagination={pagination}
                columns={columns}
                dataSource={getData1}
              />
            </div>
          </div>
      </div>   
    );
}

export default TreeFolder;









