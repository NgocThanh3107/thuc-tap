import axios from "axios";

function Update(){
let token = localStorage.getItem("token");



    axios.put("http://192.168.5.240/api/v1/builder/form/lop-hoc/data",
        {
            headers: {
                "API-Key" : "0177e09f564ea6fb08fbe969b6c70877",
                "Authorization": `Bearer ${token}`
            }
        }
    )
    .then(res=>{
        console.log(res)
    })

    return(
        <div>
            <table>
                <th>id</th>
                <th>Ma lop</th>
                <th>Ten</th>
                <th>Mo ta</th>
            </table>
        </div>
    )
}
export default Update;