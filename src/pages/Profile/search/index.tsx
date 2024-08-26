import { useEffect, useState } from "react"
import { IUser } from "../../../helpers/types"
import { searchUsers } from "../../../helpers/api"
import { BASE, DEF } from "../../../helpers/default"
import { Link } from "react-router-dom"

export const Search = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [text, setText] = useState<string>("")

    useEffect(() => {
        if (!text.trim()) {
            setUsers([])
        } else {
            searchUsers(text)
            .then(response => {
               setUsers(response.payload as IUser[])
            })
        }
    }, [text])

    return <div className="content">
        <input
            className="form-control"
            placeholder="search for friends..."
            value={text}
            onChange={e => setText(e.target.value)}
        />
        <small style={{ color: 'gray' }}>found {users.length} users</small>
        <div className="row">
            {
                users.map(user => <div key={user.id} className="col-md-3">
                    <img 
                        className="profile-pic"
                        src={
                            user.picture ?
                            BASE + user.picture
                            :
                            DEF
                        }
                    />
                    <p>{user.name} {user.surname}</p>
                    <Link to={'/profile/'+user.id}>account</Link>
                </div>)
            }
        </div>
    </div>
}