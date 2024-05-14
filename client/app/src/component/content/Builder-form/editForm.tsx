import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MyForm from "./MyForm";

const EditForm = () => {
    const [data, setData] = useState<any>(null); // Initial state is null
    const [loading, setLoading] = useState(true); // Loading state
    let params = useParams();
    let navigate = useNavigate();
    let api = localStorage.getItem("api");
    let token = localStorage.getItem("token");
    
    useEffect(() => {
        axios.get(`http://192.168.5.240/api/v1/builder/form/${params.id}`, {
            headers: {
                "API-Key": api,
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.status === true) {
                    setData(res.data.data);
                }
                setLoading(false); 
            })
            .catch(error => {
                if (error.response.status === 401) {
                    navigate("/login");
                } else {
                    console.log(error);
                }
                setLoading(false); 
            });
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!data) {
        return <div>No data available</div>; 
    }

    return (
        <div>
            <MyForm isEdit={true} data={data} />
        </div>
    );
};

export default EditForm;
