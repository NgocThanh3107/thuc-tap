import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SharedFormLop from "./SharedFormLop";
import { Flex, Spin } from 'antd';
const EditLop: React.FC = () => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
        const token = localStorage.getItem("token");
        const api = localStorage.getItem("api");
        axios.get(`http://192.168.5.240/api/v1/builder/form/lop-hoc/data/${id}`,
          {
            headers: {
              "API-Key": api,
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(res=>{
          if(res.data.status=== true){
            setData(res.data.data)
          }
          setLoading(false)
        })
        .catch(error => {
          if (error.response.status === 401) {
              navigate("/login");
          } else {
              console.log(error);
          }
          setLoading(false)
      });
          
  }, [id]);

  if (loading) {
    return (
      <Flex vertical style={{ height: '50vh' }} align="center" justify="center">
        <Spin tip="Loading..." size="large" />
      </Flex>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <SharedFormLop isEdit={true} data={data} id={id} />
  );
};

export default EditLop;
