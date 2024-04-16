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

const Menu_header: React.FC = () => {
  const token = localStorage.getItem("token")
  const [data, setData] = useState([]);
  // console.log(data)
  useEffect(() => {
    axios.get("http://192.168.5.240/api/v2/menu/my-menu",
      {
        headers: {
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877",
          "locale": "en",
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        // console.log(res.data.data)
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
          <p><Link style={a} href={value["url"]}><i className={data[key]["iconClass"]}></i> {data[key]["pageTitle"]}</Link></p>
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