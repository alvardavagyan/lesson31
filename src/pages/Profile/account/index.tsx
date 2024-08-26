import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { getAccount, cancelRequest as handleCancelation, follow as handleFollow, unfollow as handleUnfollow } from "../../../helpers/api"
import { IAccount, IContext, IUser } from "../../../helpers/types"
import { BASE, DEF } from "../../../helpers/default"
import { Gallery } from "../../../components/Gallery"

export const Account = () => {
    const { id } = useParams()
    const {account} = useOutletContext<IContext>()
    const [user, setUser] = useState<IAccount | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        if (!id) {
            return
        }

        getAccount(id)
            .then(response => {
                if (!response.payload || response.status == "error") {
                    return navigate("/profile/search")
                }
                console.log(response.payload)
                setUser(response.payload as IAccount)
            })

    }, [id])


    const handlePostUpdate = (id: number) => {
        if (user) {
            setUser({
                ...user,
                posts: user.posts.map(post => {
                    if (post.id != id) {
                        return post
                    }
                    post.isLiked = !post.isLiked
                    if(!post.isLiked){
                        post.likes = post.likes.filter(a => a.id != account.id)
                    }else{
                        post.likes.push(account)
                    }
                    return post

                })
            })

        }
    }
        const handleRequest = () => {
            if (user?.connection.following) {
                unfollow()
            } else if (user?.connection.requested) {
                cancelRequest()
            } else {
                follow()
            }
        }

        const follow = () => {
            if (user?.id) {
                handleFollow(user.id)
                    .then(response => {
                        if (response.status == 'following') {
                            setUser({
                                ...user,
                                connection: { ...user.connection, following: true },
                                followers: user.followers ? [...user.followers, response.payload as IUser] : [response.payload as IUser]
                            })

                        } else if (response.status == 'requested') {
                            setUser({ ...user, connection: { ...user.connection, requested: true } })
                        }
                    })
            }

        }
        const unfollow = () => {
            if (user?.id) {
                handleUnfollow(user.id)
                    .then(response => {
                        if (response.status == 'unfollowed') {
                            setUser({
                                ...user,
                                connection: { ...user.connection, following: false },
                                followers: user.followers && user.followers.filter(e => e.id != (response.payload as IUser).id)
                            })

                        }
                    })
            }
        }

        const cancelRequest = () => {
            if (user?.id) {
                handleCancelation(user.id)
                    .then(response => {
                        if (response.status == 'cancelled') {
                            setUser({ ...user, connection: { ...user.connection, requested: false } })
                        }
                    })
            }
        }

        return user && <div className="container mt-5 mb-5">
            <div className="row no-gutters">
                <div className="col-md-4 col-lg-4">
                    <img
                        src={
                            user.picture ?
                                BASE + user.picture :
                                DEF
                        }
                    />
                </div>
                <div className="col-md-8 col-lg-8">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
                            <h3 className="display-5">{user.name} {user.surname}</h3><i className="fa fa-facebook"></i><i className="fa fa-google"></i><i className="fa fa-youtube-play"></i><i className="fa fa-dribbble"></i><i className="fa fa-linkedin"></i></div>
                        <div className="p-3 bg-black text-white">
                            <img
                                className="icon"
                                src={
                                    user.isPrivate ?
                                        "https://cdn1.iconfinder.com/data/icons/unicons-line-vol-4/24/lock-alt-512.png" :
                                        "https://cdn1.iconfinder.com/data/icons/unicons-line-vol-4/24/lock-open-alt-512.png"
                                }
                            />
                            <button onClick={handleRequest} className="btn btn-primary btn-sm">
                                {
                                    user.connection.requested ?
                                        "cancel request" :
                                        user.connection.following ?
                                            "unfollow" :
                                            user.connection.followsMe ?
                                                "follow back" :
                                                "follow"
                                }
                            </button>
                        </div>
                        <div className="d-flex flex-row text-white">
                            <div className="p-4 bg-primary text-center skill-block">
                                <h4>{user.followers?.length || 0}</h4>
                                <h6>followers</h6>
                            </div>
                            <div className="p-3 bg-success text-center skill-block">
                                <h4>{user.following?.length || 0}</h4>
                                <h6>following</h6>
                            </div>
                            <div className="p-3 bg-danger text-center skill-block">
                                <h4>{user.posts?.length || 0} </h4>
                                <h6>posts</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                 <Gallery
                    posts={!user.posts ? [] : user.posts }
                    onUpdate={handlePostUpdate}
                />
            
        </div>
    }

