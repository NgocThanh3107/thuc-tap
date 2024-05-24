import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useNavigate } from "react-router-dom";
import { Space, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { Button, Input} from 'antd';
import  { useContext, useLayoutEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, ConfigProvider, Modal, Empty } from 'antd';
import '../_pages.scss';

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
  name: string;
  description?: string;
  id?: number;
  parent: DataType[];
  
}
// interface PaginationProps {
//   pageSize? : number;
//   totalPage?: number;
//   total ?: number;
//   page?: number;
// }

const Folder = () => {

  const columns: TableColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: '',
      render: (text, record, index) => startSTT + index ,
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
          <a onClick={(e) =>{e.preventDefault(); navigate('/administrator/internship/builder/folder/edit/'+ record?.id + '.html')}}>Edit</a>
        </div>
      )
    }
  ];

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [getData, setGetData] = useState<DataFolderProps[]>([]);
    const [getData1, setGetData1] = useState<DataType[]>([]);
    const [originalData, setOriginalData] = useState<DataType[]>([]);
    // const [originalData1, setOriginalData1] = useState<DataType[]>([]);
    // const [pagination, setPagination] = useState<PaginationProps>();
    const [IdParent, setIdParent] = useState<number | undefined>();  
    const [messageApi, contextHolder] = message.useMessage();
    const [search, setSearch] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading,setLoading] = useState(true);
    const [startSTT, setStartSTT] = useState(0);
    const [allSelectedIds, setAllSelectedIds] = useState<number[]>([]);
    // console.log(allSelectedIds)
    // console.log(selectedRowKeys)
    
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
      const start = (page - 1) * pageSize + 1;
        setStartSTT(start);

      axios
        .get(`http://192.168.5.240/api/v1/folder?parent=${parent}`, {
          headers: {
            'API-Key': api,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.status === true) {
            setGetData1(res.data.data);
            setOriginalData(res.data.data)
            // setPagination(res.data.pagination);
        } else {   
            setGetData1([]);      
            setOriginalData([])
            // setPagination(undefined);
        }
        setLoading(false)
        })
        .catch(error =>{
          if(error.response.status === 401){
            navigate("/login");
          }else{
            console.log(error)
          }
          setLoading(false)
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

    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
      info.selectedNodes.map((v)=>{
          if ('title' in info.node) {
              setSelectedFolderName(info.node.title as string);
              setIdParent(keys[0] as number);
              fetchData(1,10, keys[0] as number);
          }
          console.log(keys)
      });
    }
    
    const deleteFolderTreeData = (id: number, data: DataFolderProps[]): DataFolderProps[] => {
      return data.filter(item => {
        if (item.id === id) {
          return false;
        }
        if (item.children && item.children.length > 0) {
          item.children = deleteFolderTreeData(id, item.children);
        }
        return true;
      });
    };
    
    const handleDelete = () => {
      Modal.confirm({
        title: `Do you want to delete ${selectedRowKeys.length} items?`,
        icon: <ExclamationCircleFilled />,
        content: 'This action cannot be undone.',
        onOk() {
          const idsToDelete = allSelectedIds.length > 0 ? allSelectedIds : selectedRowKeys;
          axios.delete(`http://192.168.5.240/api/v1/folder`,
            {
              headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
              },
              data: idsToDelete
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

                const updatedTreeData = selectedRowKeys.reduce((acc, key) => {
                  return deleteFolderTreeData(key as number, acc);
                }, [...getData]);
                setGetData(updatedTreeData);
        
                const updatedData = getData1.filter(
                  (item) => item.id !== undefined && !selectedRowKeys.includes(item.id)
                );
                setGetData1(updatedData);
        
                setSelectedRowKeys([]);
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
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if(value===""){
        setGetData1(originalData)
      }else {
        const filteredData1 = originalData.filter(item => item.name?.toLowerCase().includes(value.toLowerCase()));
        setGetData1(filteredData1);
      }
    }

    // const handleSearch = () =>{
    //   if(search == ""){
    //     setGetData(originalData)
    //   }else {
    //     axios.get(`http://192.168.5.240/api/v1/folder?parent=${IdParent}&name=${search}`, {
    //       headers: {
    //           'API-Key': api,
    //           Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then(res=>{
    //       console.log(res)
    //       if (res.data.status === true) { 
    //         setGetData(res.data.data);
    //         setGetData1(res.data.data)
    //     } else {
    //         setGetData([]);
    //         setGetData1([]);
    //     }
    //     })
    //     .catch(error =>{
    //       if(error.response.status === 401){
    //         navigate("/login");
    //       }else{
    //         console.log(error)
    //       }
    //     })
    //   }
    // }

    const handleTableChange = (pagination: any) => {
      const { current, pageSize } = pagination;
        fetchData(current, pageSize, IdParent);
    };
    
    
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    
      const folderIds: number[] = [];
    
      const findAllChildrenIds = (folder: DataFolderProps) => {
        folderIds.push(folder.id); 
        if (folder.children && folder.children.length > 0) {
          folder.children.forEach(child => {
            findAllChildrenIds(child);
          });
        }
      };
    
      getData.forEach(folder => {
        if (newSelectedRowKeys.includes(folder.id)) {
          findAllChildrenIds(folder);
        } else {
          if (folder.children && folder.children.length > 0) {
            folder.children.forEach(child => {
              if (newSelectedRowKeys.includes(child.id)) {
                findAllChildrenIds(child);
              }
            });
          }
        }
      });
      setAllSelectedIds(folderIds);
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

    const handleTree = () => {
      if(getData.length > 0){
        return (
          <DirectoryTree
            className="folder-style"
            onSelect={onSelect}
            treeData={treeData} 
          />
        )
      }else{
        return (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        )
      }
    }
    
    return (
      <div className="folder-main">
        {contextHolder}
        <h1>Folder <span style={{fontSize: 14, color: "rgb(147, 147, 147)"}}>{getData.length}</span></h1>
        <div className="action">
          <p className="create"><Button type="primary" onClick={() => {navigate("/administrator/internship/builder/folder/create.html")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add new </Button></p>
          <p className="search">
            <Space.Compact>
              <Input type="text" placeholder={`Search ${selectedFolderName ? selectedFolderName : 'folder'}` } value={search} style={{fontFamily: 'FontAwesome'}} onChange={handleSearchChange}/>
              {/* <Button onClick={handleSearch} type="primary">
                Search
              </Button> */}
            </Space.Compact>
          </p>
        </div>
        <div className="tree-table">
          <div className="tree-folder">
            {handleTree()}
          </div>
          <div className="table-folder">
            <div className="delete" >
              <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected}>
                <i className="fa fa-trash-o" aria-hidden="true"> </i> Delete
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
            </div>
            <Table
              rowKey={"id"}             
              onChange={handleTableChange}
              // pagination={pagination}
              columns={columns}
              dataSource={getData1}
              rowSelection={rowSelection}
              loading={loading}
            />
          </div>
        </div>
      </div>   
    );
}

export default Folder;
