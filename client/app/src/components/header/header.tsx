import React from 'react';
import Link from 'antd/es/typography/Link';
import { UserOutlined } from '@ant-design/icons';
import { Avatar} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './_header.scss'


const Headers: React.FC = () => {

  let api = localStorage.getItem("api");
  const navigate = useNavigate();
  const check = localStorage.getItem("check");
  // console.log(check)

  let token = localStorage.getItem("token");

  function CheckLogin(){
    if (check) {
      return <p><Link onClick={Logout}>Logout</Link></p>;
    } else {
      return <p><Link href="/login">Login</Link></p>;
    }
    }
  
  function Logout(){
      axios.post("http://192.168.5.240/api/v2/auth/logout", null,
       {
        headers: {
          "API-Key": api,
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        console.log(res);
        localStorage.removeItem("check");
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }
  
  return (
    <div className='header'>  
      <h3><Link href="/"><i className="fa fa-home" aria-hidden="true"></i>HOME</Link></h3>
        {CheckLogin()}
      <p><Link href='/account'><Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /></Link></p>
    </div>
  );
};

export default Headers;



