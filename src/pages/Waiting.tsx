import React from 'react'
import { Icon } from 'antd'

const Waiting = () => {
    return (
        <div className="Waiting" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh'
        }}>
            <Icon type="loading" style={{
                fontSize: 40,
                color: '#ddd'
            }} />
        </div>
    )
}

export default Waiting