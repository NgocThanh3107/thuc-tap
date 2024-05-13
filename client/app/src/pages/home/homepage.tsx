import React, { useEffect, useState } from 'react';
import Menu_header from '../../components/header/menu-header';
import { Outlet } from 'react-router-dom';
import './_home.scss';
import Headers from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nopage from './Nopage';
import Footer from './footer';


const Homepage = () =>{

  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let [check, setCheck] = useState<boolean>();
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
        if(res.data.status == true){
          setCheck(res.data.status)
        }else{
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
            console.log("Token không hợp lệ");
            navigate("/login");
        } else {
            console.log(error);
        }
    });
    },[]);

  if(check == true){
    return (
        <div className='app'>
          <Headers />
          <div className='container'>
            <div className='sider_style'>
              <Menu_header />
            </div>
            <div className='content_style'>
              <Outlet />    
            </div>
          </div>
          <Footer/>
        </div> 
    )
  }else{
    return(
      <Nopage />
    )
  }
  }

export default Homepage;




