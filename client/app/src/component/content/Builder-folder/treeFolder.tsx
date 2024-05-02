import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useNavigate } from "react-router-dom";
import Link from "antd/es/typography/Link";
import './style.scss';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;

interface DataFolderProps {
  name: string;
  id: number;
  sort: number;
  children:DataFolderProps[];
  parent: DataFolderProps[];
}


const TreeFolder = () => {
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [data, setData] = useState<DataFolderProps[]>([]);
    // let params = useParams();
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
                setData(res.data.data);
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

    const treeData: TreeDataNode[] = convertData(data);

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        console.log('Trigger Select', keys, info);
        info.selectedNodes.map((v)=>{
            if(v.isLeaf == true){
              navigate('/http://192.168.5.240/api/v1/folder/' + keys)
            }
        })
    };

    return (
      <div className="folder-main">
          <div className="c-c">
            <ul>
              <li><p><Link href="/create-folder" onClick={(e) => {e.preventDefault();navigate("/create-folder")}}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add new Folder</Link></p></li>
              <li><p><Link href="/choosefolder" onClick={(e) => {e.preventDefault();navigate("/choosefolder")}}>Choose</Link></p></li>
            </ul>
          </div>
          <DirectoryTree
            className="folder-style"
            multiple
            defaultExpandAll
            onSelect={onSelect}
            // onExpand={onExpand}
            treeData={treeData}
          />
      </div>   
    );
}

export default TreeFolder;

