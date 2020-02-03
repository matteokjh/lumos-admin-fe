import React from 'react'
import '../styles/Header.sass'
import { useHistory } from 'react-router-dom'

const Header = (props: { collapsed: boolean }) => {
    const history = useHistory()

    // method
    const backToIndex = () => {
        history.push('/')
    }

    return (
        <div className="Header">
            <h1 className="title" onClick={backToIndex} style={{
                opacity: props.collapsed ? '1' : '0'
            }}>𝓛</h1>
            <h1 className="title" onClick={backToIndex} style={{
                opacity: props.collapsed ? '0' : '1'
            }}>𝐿𝓊𝓂𝑜𝓈</h1>
        </div>
    )
}

export default Header