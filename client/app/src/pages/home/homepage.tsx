import React from 'react';
import { Layout, Flex } from 'antd';
import Menu_header from '../../components/header/menu-header';
import { Outlet } from 'react-router-dom';
import './_home.scss';
import Header from '../../components/header/header';
import { Content } from 'antd/es/layout/layout';

const {  Footer } = Layout;



const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};


const Homepage: React.FC = () =>{


return (
  <Layout>
    <Header />
      <Layout>
        <Content className='content'>
          <Menu_header />
            <Outlet />  
        </Content>
      </Layout>
    <Footer style={footerStyle}>Footer</Footer>
  </Layout>

)
}

export default Homepage;



