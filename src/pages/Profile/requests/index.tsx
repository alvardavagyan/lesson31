import { useEffect, useState } from "react"
import { Axios, getAllRequests } from "../../../helpers/api"
import { IRequest } from "../../../helpers/types"

export const Requests = () => {
    const [list, setList] = useState<IRequest[]> ([])
    useEffect(() =>{
        getAllRequests()
        .then(response => {
            setList(response.payload as IRequest[])
        })
    },[])
    const handleAccept = (id:number)=>{
        Axios
        .patch("/requests/accept/"+ id)
        .then(response => {
           setList(list.filter(e => e.id != id))
        })
    }
    return <div className="content">
        <h3>Requests</h3>
        {
            list.map(req => {
                return <div key={req.id}>
                    <p>{req.user.name} {req.user.surname}</p> 
                    <button onClick={handleAccept.bind(null, req.id)} className="btn btn-success">accept</button>
                    <button className="btn btn-danger">accept</button>
                </div>
            })
        }

    </div>
}