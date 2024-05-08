import React, { useState, useEffect } from "react";
import { Select } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { message } from 'antd';

const { Option } = Select;

const FilterForm: React.FC = () => {
  const api = localStorage.getItem("api");
  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://192.168.5.240/api/v1/builder/form`, {
      headers: {
        "API-Key": api,
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res);
      if (res.data.status === true) {
        const formattedOptions = res.data.data.map((item: any) => ({
          value: item.id,
          label: item.name
        }));
        setOptions(formattedOptions);
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching data:", error);
      }
    });
  }, []);

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
      const res = await axios.delete(`http://192.168.5.240/api/v1/builder/form`, {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        },
        data: value
      });

      if (res.data.status === true) {
        messageApi.success("Folders deleted successfully.");
        const updatedOptions = options.filter(option => !value.includes(option.value));
        setOptions(updatedOptions);
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

  return (
    <div className="choose">
      {contextHolder}
      <Select
        style={{ width: '20%', float: 'left', marginTop: 50 }}
        value={value}
        placeholder="Please select"
        allowClear
        mode="multiple"
        onChange={onChange}
      >
        {options.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      <p style={{float :'left',marginTop: 55 }}><a onClick={del} href=""><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></p>
    </div>
  );
};

export default FilterForm;
