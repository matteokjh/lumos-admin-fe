import React from 'react'


const ReactMarkdownLink = (props: { href: string }) => {
    return (
        <a href={props.href} target='_blank' rel="noopener noreferrer">{props.href}</a>
    )
}

export default ReactMarkdownLink