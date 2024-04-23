import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import './_header.scss'
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';


interface HeaderProps{
  pageTitle ?: string;
  url ?: string;
  iconClass ?: string;
  name ?: string;
}

const Menu_header: React.FC = () => {
  let navigate = useNavigate();
  let api = localStorage.getItem("api");
  const token = localStorage.getItem("token")
  const [data, setData] = useState<HeaderProps[]>([]);
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
        setData(res.data.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  const handleNavigation = (url: string) => {
    navigate(url);
  };
  const RenderData = () => {
    if (data.length > 0) {
      return data.map((value, key) => {
        if (value.url) {
          return (
            <Link onClick={() => handleNavigation(value.url!)} key={key}>
              <i className={value.iconClass}></i> {value.pageTitle}
            </Link>
          );
        }
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