import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Form, Input,Select } from 'antd';
import MyFormField from "./MyFormField";
import { get } from "http";

  interface DataformFieldProps {
    name?: string;
    id: number;
    apiKey?: string;
    type?: string;
    sort?: number;
    description: string;
    isRequired: boolean;
    isUnique: boolean;
    isParent: boolean;
    isMultiple?: boolean;
    displayOnList: boolean;
    displayOnListDefault: boolean;
    formCol: number;
    formHidden: boolean;
  }

function EditFormField(){

    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    const [getdata, setGetData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    let navigate = useNavigate();
    const idFFieldFrom = localStorage.getItem("idFormField");

    useEffect(()=>{
        axios.get('http://192.168.5.240/api/v1/builder/form/'+ idFFieldFrom + '/field/'+ params.id,{
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
            setLoading(false)
        })
        .catch(error =>{
            if(error.response.status === 401){
              navigate("/login");
            }else{
              console.log(error)
            }
            setLoading(false)
          })

      },[])
  

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!getdata) {
        return <div>No data available</div>; 
    }
    return(
      <MyFormField isEdit={true} data={getdata}/>
    )
    
}
export default EditFormField;


