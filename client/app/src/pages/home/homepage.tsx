import React, { useEffect, useState } from 'react';
import { Layout, Flex } from 'antd';
import Menu_header from '../../components/header/menu-header';
import { Outlet } from 'react-router-dom';
import './_home.scss';
import Headers from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nopage from './Nopage';


const Homepage: React.FC = () =>{

  const { Footer, Content } = Layout;

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let [check, setCheck] = useState<boolean>();
  console.log(check)
  let api = localStorage.getItem("api");

    useEffect(()=>{
      axios.get("http://192.168.5.240/api/v2/auth/check",
        {
          headers: {
            "API-Key" : api,
            "Authorization": `Bearer ${token}`
          }
        }
      )
      .then(res =>{
        console.log(res)
        if(res.data.status == true){
          setCheck(res.data.status)
        }else{
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
    },[]);

  if(check == true){
    return (
      // <Flex gap="middle" wrap="wrap">
        <Layout className='style_layout'>
          <Headers />
            <Content  className='content_style'>
              <div className='sider_style' >
                <Menu_header />
              </div>
              <div className='Outlet'>
                <Outlet />
              </div>        
            </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      // </Flex>
    )
  }else{
    return(
      <Nopage />
    )
  }
  }

export default Homepage;




