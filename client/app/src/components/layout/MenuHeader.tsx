import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
    id: number;
    name: string;
    children: MenuItemProps[];
    url: string;
    pageTitle: string;
    iconClass: string;
}

const { SubMenu, Item } = Menu;

const MenuHeader: React.FC = () => {
    const [data, setData] = useState<MenuItemProps[]>([]);
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    
        useEffect(() => {
            axios.get("http://192.168.5.240/api/v2/menu/my-menu", {
                headers: {
                    "API-Key": api,
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
                });
        },[])

        const handleNavigation = (url: string) => {
            navigate(url);
        };

        const renderMenuItems = (menuItems: MenuItemProps[]) => {
            return menuItems.map(menuItem => {
                const icon = menuItem.iconClass || "fa fa-angle-double-right";
                if (menuItem.children.length > 0) {
                    return (
                        <SubMenu className='submenu' key={menuItem.id} title={<span><i className={icon}></i> {menuItem.pageTitle}</span>}>
                            {renderMenuItems(menuItem.children)}
                        </SubMenu>
                    );
                } else {
                    return (
                        <Item key={menuItem.id}>
                            <Link onClick={() => handleNavigation(menuItem.url)}>
                                <i className={icon}></i> {menuItem.pageTitle}
                            </Link>
                        </Item>
                    );
                }
            });
        };

        return (
            <div className='menu'>
                <Menu mode="inline" >
                    {renderMenuItems(data)}
                </Menu>
            </div>
        );

    }
export default MenuHeader;