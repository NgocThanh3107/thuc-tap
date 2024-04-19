import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import './_header.scss'
import Link from 'antd/es/typography/Link';
const a: React.CSSProperties = {
  color: '#333',
  margin: "7px",
};
interface HeaderProps{
  pageTitle ?: string;
  url ?: string;
  iconClass ?: string;
  name ?: string;
}

const Menu_header: React.FC = () => {
  let api = localStorage.getItem("api");
  // const token = localStorage.getItem("token")
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [data, setData] = useState<HeaderProps[]>([]);
  // console.log(data)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    axios.get("http://192.168.5.240/api/v2/menu/my-menu",
      {
        headers: {
          "API-Key": api,
          "locale": "en",
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        console.log(res)
        setData(res.data.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  const RenderData = () => {
    if (data.length > 0) {
      return data.map((value, key) => {
        return (
          <Link style={a} href={value.url}><i className={value.iconClass}></i> {value.pageTitle}</Link>
        )
      })
    }
  }
  return (
    <div className='menu-header'>
      {RenderData()}
    </div>
  )
};

export default Menu_header;