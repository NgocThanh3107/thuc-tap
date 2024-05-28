import React, { useEffect, useState } from 'react';
import MenuHeader from './MenuHeader';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './footer/Footer';
import '../layout/_layout.scss';
import PageNotFound from './PageNotFound';
import { Flex, Spin } from 'antd';


const HomePage = () =>{

  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [check, setCheck] = useState<boolean>();
  let api = localStorage.getItem("api");
  const [loading, setLoading] = useState<boolean>(true);

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
        if(res.data.status == true){
          setCheck(res.data.status)
        }else{
          localStorage.removeItem("token");
          navigate("/login");
        }
        setLoading(false)
      })
      .catch(error => {
        if (error.response.status === 401) {
            navigate("/login");
        } else {
            console.log(error);
        }
        setLoading(false)
    });
    },[]);

    if (loading) {
      return (
        <Flex vertical style={{ height: '50vh' }} align="center" justify="center">
          <Spin tip="Loading..." size="large" />
        </Flex>
      );
    }

  return (
    <div className='app'>
      <Header />
      <div className='container'>
        <div className='sider'>
          <MenuHeader />
        </div>
        <div className='content'>
          {check ? <Outlet /> : <PageNotFound />}
          <Footer />
        </div>
      </div>
    </div>
  )
  
}

export default HomePage;




