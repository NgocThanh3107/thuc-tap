import axios from "axios";
import { useEffect } from "react";
import React from "react";

const Account: React.FC = () =>{

    const token = localStorage.getItem("token")
    let api = localStorage.getItem("api");
        useEffect(()=>{
            axios.get(
                "http://192.168.5.240/api/v2/auth/check",
                {
                    headers: {
                        "API-Key": api ,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            .then(res=>{
                console.log(res.data)
            })
        },[]);

    return (

        <div>
            <h2>Account</h2>
       </div>
    )
}
export default Account;