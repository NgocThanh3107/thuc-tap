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
      return <Link onClick={Logout}><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</Link>
    } else {
      return <Link href="/login">Login</Link>
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
      <div className='nav_icon'><Link href="/"><i className="fa fa-home" aria-hidden="true"></i>Home</Link></div>
      <div className='nav_center'>
          <ul>
            <li><a href="">About</a></li>
            <li><a href="">Services</a></li>
            <li><a href="">Contact</a></li>
          </ul>
      </div>
      <div className='nav_right'>
        <ul>
          <li><Link href='/account'><i className="fa fa-user-o" aria-hidden="true"></i> Account</Link></li>
          <li>{CheckLogin()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Headers;



