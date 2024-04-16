import React, { useEffect } from 'react';
import Link from 'antd/es/typography/Link';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import './_header.scss'

// const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';
const Header: React.FC = () => {

  const navigate = useNavigate();
  const check = localStorage.getItem("check");
  const token = localStorage.getItem("token");
  function CheckLogin(){
    if(check != null){
      return (
        <p><a onClick={Logout} href="">Logout</a></p>
      )
      
    }else{
      axios.post("http://192.168.5.240/api/v2/auth/logout",
      {
        headers : {
          "API-Key": "0177e09f564ea6fb08fbe969b6c70877",
          "Authorization": `Bearer ${token}`
        }
      }
      )
      .then(res=>{
        console.log(res)
        navigate("/login")
      })

    return(
      <p><Link href="/login">Login</Link></p>
    )

    }
  }
  function Logout(){
    localStorage.removeItem("check");
  }

  return (
    <div className='header'>  
      <h3><Link href="/"><i className="fa fa-home" aria-hidden="true"></i>HOME</Link></h3>
      {CheckLogin()}
      <p><Link href='/account'><Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /></Link></p>
    </div>
  );
};

export default Header;



