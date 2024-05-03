
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
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
        const [getData, setGetData] = useState<DataFormProps[]>([]);
        useEffect(()=>{
            axios.get(`http://192.168.5.240/api/v1/builder/form`,
                {
                    headers: {
                        "API-Key" : api,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            .then(res =>{
                console.log(res)
                if(res.data.status===true){
                    setGetData(res.data.data)
                }
            })
            .catch(error => {
                console.log(error);
            });
        }, []);
        
        interface DataType {
          key: string;
          name: string;
          age: number;
          address: string;
          tags: string[];
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
            title: 'Foldel',
            dataIndex: 'folder',
            key: 'folder',
          },
        //   {
        //     title: 'Tags',
        //     key: 'tags',
        //     dataIndex: 'tags',
        //     render: (_, { tags }) => (
        //       <>
        //         {tags.map((tag) => {
        //           let color = tag.length > 5 ? 'geekblue' : 'green';
        //           if (tag === 'loser') {
        //             color = 'volcano';
        //           }
        //           return (
        //             <Tag color={color} key={tag}>
        //               {tag.toUpperCase()}
        //             </Tag>
        //           );
        //         })}
        //       </>
        //     ),
        //   },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
              </Space>
            ),
          },
        ];
        
    return(<Table columns={columns} dataSource={getData} />);
      
    }
  
  export default AllForm;
  