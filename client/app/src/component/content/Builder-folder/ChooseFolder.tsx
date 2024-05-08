import React, { useState, useEffect } from "react";
import { TreeSelect } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import './style.scss';
interface DataFolderProps {
  value: string;
  title: string | JSX.Element;
  children?: DataFolderProps[];
}

const ChooseFolder: React.FC = () => {
  const api = localStorage.getItem("api");
  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();
  const [treeData, setTreeData] = useState<DataFolderProps[]>([]);
  const [value, setValue] = useState<string[]>();
  console.log(value)
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://192.168.5.240/api/v1/folder/tree`, {
      headers: {
        "API-Key": api,
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res);
        if (res.data.status === true) {
          const formattedData = formatTreeData(res.data.data);
          setTreeData(formattedData);
        }
      })
      .catch(error=>{
        if(error.response.status === 401){
          navigate("/login");
        }else{
        console.error("Error fetching data:", error);
        }
      });
  }, []);

  const formatTreeData = (data: any[]): DataFolderProps[] => {
    
    return data.map(item => ({
      value: item.id,
      title: item.name,
      children: item.children ? formatTreeData(item.children) : undefined
    }));
  };

  const onChange = (newValue: string[]) => {
    setValue(newValue);
  };

  const del = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!value || value.length === 0) {
        messageApi.error("Please select folder(s) to delete.");
        return;
    }

    try {
        const res = await axios.delete(`http://192.168.5.240/api/v1/folder`, {
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            },
            data: value
        });

        if (res.data.status === true) {
            const updatedTreeData = removeFoldersFromTree(treeData, value);
            setTreeData(updatedTreeData);

            messageApi.success("Folders deleted successfully.");
            setValue([]);
        } else {
            messageApi.error(res.data.message || "Error deleting folders.");
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
        } else {
            console.log("Error deleting folders:", error);
            messageApi.error("Error deleting folders. Please try again later.");
        }
    }
};

const removeFoldersFromTree = (tree: DataFolderProps[], folderIds: string[]): DataFolderProps[] => {
    return tree.map((node) => {
        if (node.children && node.children.length > 0) {
            node.children = removeFoldersFromTree(node.children, folderIds);
        }
        node.children = node.children?.filter((child) => !folderIds.includes(child.value));
        return node;
    }).filter((node) => !folderIds.includes(node.value));
};
 

  return (
    <div className="choose">
      <h1>Filter Folder</h1>
        {contextHolder}
        <TreeSelect
        showSearch
        style={{ width: '20%', float: 'left', marginTop: 50 }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        multiple
        treeDefaultExpandAll
        onChange={onChange}
        treeData={treeData}
        />
        <p style={{float :'left',marginTop: 55 }}><a onClick={del}  href=""><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></p>
    </div>
  );
};

export default ChooseFolder;