import React, { useEffect } from 'react'
import '@/styles/User.sass'
import { userList } from '@/api/user'
import { message } from 'antd'

const User = () => {


    useEffect(() => {
        (async () => {
            try {
                let res = await await userList({})
                if(res.code === 200) {
                    console.log(res.data)
                } else {
                    message.error(res.msg)
                }
            } catch(err) {
                message.error(err)
            }
        })()
    }, [])

    return (
        <div className="User">
            this is User
        </div>
    )
}

export default User