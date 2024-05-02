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
  useEffect(() => {
    axios.get(`http://192.168.5.240/api/v1/folder?page=1&pageSize=10`, {
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
      .catch(error => {
        console.error("Error fetching data:", error);
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

  const del = () => {
        axios.delete(`http://192.168.5.240/api/v1/folder`, 
          {
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            },
            data :value     
          }
        )
        .then(res  =>{
            console.log(res)
            if(res.data.status == true){
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

                const newData = treeData.filter((item) => !value?.includes(item.value));
                setTreeData(newData);
                setValue([])
              }else{
                  console.log(res.data.message)
              }
        })
        .catch((error) => {
            console.error("Error deleting folder:", error);
            messageApi.error("Error deleting folder. Select folder to delete ."); 
          });
  } 

  return (
    <div className="choose">
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
        <p style={{float :'left',marginTop: 50 }}><button type="submit" onClick={del}><i className="fa fa-trash" aria-hidden="true"></i> Delete</button></p>
    </div>
  );
};

export default ChooseFolder;