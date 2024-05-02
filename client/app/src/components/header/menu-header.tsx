
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';

// interface ChildItemProps {
//     id: number;
//     pageTitle: string;
//     name: string;
//     url: string;
//     iconClass: string;
//     children: ChildItemProps[];
// }
interface MenuItemProps {
    id: number;
    name: string;
    children: MenuItemProps[];
    url: string;
    pageTitle: string;
    iconClass: string;
}

const { SubMenu, Item } = Menu;
const Menu_header: React.FC = () => {
    const [data, setData] = useState<MenuItemProps[]>([]);
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    useEffect(() => {
      axios.get("http://192.168.5.240/api/v2/menu/my-menu", {
            headers: {
                "API-Key": api,
                "locale": "en",
                "Authorization": `Bearer ${token}`
            }
            })
            .then(res=>{
              if (res.data.status === true) {
                  setData(res.data.data);
              }
            })
            .catch (error =>{
                console.error('Error fetching menu data:', error)
            })
    },[])

      const handleNavigation = (url: string) => {
        navigate(url);
      };

      const renderMenuItems = (menuItems: MenuItemProps[]) => {
        return menuItems.map(menuItem => {
            if (menuItem.children.length > 0) {
                return (
                    <SubMenu className='SubMenu1' key={menuItem.id} title={menuItem.pageTitle}>
                        {renderMenuItems(menuItem.children)}
                    </SubMenu>
                );
            } else {
                return (
                    <Item className='Menu-header' key={menuItem.id}>
                        <Link onClick={() => handleNavigation(menuItem.url)}>
                            <i className={menuItem.iconClass}></i> {menuItem.pageTitle}
                        </Link>
                    </Item>
                );
            }
        });
      };

      return (
          <Menu className='Menu-header' mode="inline" style={{ width: 256 }}>
              {renderMenuItems(data)}
          </Menu>
      );

        // return (
        //     <Menu className='Menu-header' mode="inline" style={{ width: 256 }}>
        //         {data.map((menuItem) => {
        //             if(menuItem.children.length > 0){
        //                 return(    
        //                   <SubMenu className='SubMenu' key={menuItem.id} title={menuItem.pageTitle}>                    
        //                     {menuItem.children.map((childItem) =>{
        //                       if(childItem.children.length > 0){
        //                         return (
        //                           <SubMenu className='SubMenu1' key={childItem.id} title={childItem.pageTitle}>
        //                             {childItem.children.map((children1)=> (
        //                                 <Item key={children1.id} >
        //                                 <Link onClick={() => handleNavigation(children1.url!)}>
        //                                   <i className={children1.iconClass}></i> 
        //                                   {children1.pageTitle}
        //                                 </Link>
        //                             </Item>
        //                             ))
        //                           }
        //                           </SubMenu>
        //                         )
        //                       }else{
        //                         return(
        //                           <Item key={childItem.id} >
        //                                 <Link onClick={() => handleNavigation(childItem.url!)} >
        //                                   <i className={childItem.iconClass}></i> 
        //                                   {childItem.pageTitle}
        //                                 </Link>
        //                             </Item>
        //                         )
        //                       }
        //                     }
        //                     )}    
        //                   </SubMenu>
        //                 )
        //             }else{
        //                 return(
        //                   <Item className='no-children' key={menuItem.id}>
        //                     <Link onClick={() => handleNavigation(menuItem.url!)} >
        //                       <i className={menuItem.iconClass}></i> {menuItem.pageTitle}
        //                     </Link>
        //                   </Item>
        //                 )
        //             }
        //             })}
        //     </Menu>
        // )      
    }
export default Menu_header;