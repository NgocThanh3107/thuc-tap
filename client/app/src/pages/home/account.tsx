import axios from "axios";
import { useEffect, useState } from "react";
const Account: React.FC = () =>{

    const token = localStorage.getItem("token")
    
    useEffect(()=>{
        axios.get(
            "http://192.168.5.240/api/v2/auth/check",
            {
                headers: {
                    "API-Key": "0177e09f564ea6fb08fbe969b6c70877" ,
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
        <form action="">
            <p><input className="input" type="text" /></p>
            <p><input className="input" type="text" /></p>
            <p><input className="input" type="text" /></p>
            <p><input className="input" type="text" /></p>
            <p><button className="button">Submit</button></p>
        </form>
       
       </div>

    )
}
export default Account;