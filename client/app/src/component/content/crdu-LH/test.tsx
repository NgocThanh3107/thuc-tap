import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import 'font-awesome/css/font-awesome.min.css';

const { SubMenu, Item } = Menu;

interface ChildItemProps {
    id: number;
    pageTitle: string;
    name: string;
    url: string;
    iconClass: string;
}

interface MenuItemProps {
    id: number;
    name: string;
    children: ChildItemProps[];
    url: string;
    pageTitle: string;
    iconClass: string;
}


const App: React.FC = () => {
    const [data, setData] = useState<MenuItemProps[]>([]);

    useEffect(() => {
        axios.get("http://192.168.5.240/api/v2/menu/my-menu", {
                    headers: {
                        "API-Key": localStorage.getItem("api"),
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then(res=>{
                    if (res.data.status === true) {
                        setData(res.data.data);
                    }else{
                    
                    }
                })
                .catch (error =>{
                    console.error('Error fetching menu data:', error)
                 })
        },[])

        return (
            <Menu mode="inline" style={{ width: 256 }}>
                {data.map((menuItem) => {
                    if(menuItem.children.length > 0){
                        return(    
                            <SubMenu key={menuItem.id} title={menuItem.pageTitle}>                    
                                    {menuItem.children.map((childItem) => (
                                    <Item key={childItem.id} >
                                        <Link href={childItem.url}><i className={childItem.iconClass}></i>{childItem.pageTitle}</Link>
                                    </Item>
                                ))}    
                            </SubMenu>
                        )
                    }else{
                        return(
                            <Item>
                                <Link href={menuItem.url}><i className={menuItem.iconClass}></i>{menuItem.pageTitle}</Link>
                            </Item>
                        )
                    }
                    })}
            </Menu>
        )      
    }


export default App;