import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '@/lib/context'
import { StoreInstance as Store } from '@/lib/store'
import UserPacks from './Home/UserPacks'
import './Home.scss'

function Home() {
    const { user, loading } = useContext(UserContext)
    const [usersPacks, setUsersPacks] = useState([])

    useEffect(() => {
        if (usersPacks.length == 0 && !loading) setUsersPacks(Store.getMyPacks())
    }, [loading])

    try {
        user.displayName
    } catch {
        return (
            <div className="container text-center">
                <div className="m-3">
                    Sign in for a personalized home-page
                </div>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="m-3">
                <h3>Your Packs</h3>
                <UserPacks packs={usersPacks}/>
            </div>
        </div>
    )
}

export default Home
