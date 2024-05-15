import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FolderForm from "./FolderForm";

function EditFolder(){
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getdata, setGetData] = useState<any>();
    const [loading, setLoading] = useState(true);
    let params = useParams();
    let navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://192.168.5.240/api/v1/folder/'+ params.id,{
            headers: {
                "API-Key" : api,
                "Authorization": `Bearer ${token}`
            }
        }
        )
        .then(res =>{
            console.log(res)
            if(res.data.status == true){
              setGetData(res.data.data);
            }
            setLoading(false);
           
        })
        .catch(error =>{
            if(error.response.status === 401){
              navigate("/login");
            }else{
              console.log(error)
            }
            setLoading(false);
          })

      },[])
      if (loading) {
        return <div>Loading...</div>; 
      }

      if (!getdata) {
          return <div>No data available</div>; 
      }

    return(
          <FolderForm isEdit={true} data={getdata}/>
);
    
}
export default EditFolder;


