import React from 'react'
import "@/styles/MyCard.sass"

const MyCard = (props: {
    title: string, value: number, type: string
}) => {
    const { title, value, type } = props

    // methods
    const getStyle = (type: string) => {
        switch(type) {
            case 'blue': return {
                borderColor: 'rgb(130, 177, 234)',
                color: 'rgb(130, 177, 234)',
                backgroundColor: 'rgb(226, 246, 249)'
            }
            case 'green': return {
                borderColor: 'rgb(144, 218, 144)',
                color: 'rgb(144, 218, 144)',
                backgroundColor: 'rgb(225, 255, 225)'
            }
            case 'yellow': return {
                borderColor: '#ffdb70',
                color: '#ffdb70',
                backgroundColor: '#ffffd7'
            }
            default: return {
                borderColor: 'gray',
                color: 'gray',
                backgroundColor: 'gray'
            }
        }
    }
    const styleObj = getStyle(type)

    return <div className="MyCard" style={{
        borderColor: styleObj['borderColor'],
        color: styleObj['color'],
        backgroundColor: styleObj['backgroundColor']
    }}>
        <p className="title">{title}</p>
        <p className="value">{value}</p>
    </div>
}

export default MyCard