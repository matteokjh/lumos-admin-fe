import React, { useState, useRef, ChangeEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { Input } from 'antd'
import '../styles/MarkdownEditor.sass'

const MarkdownEditor = () => {
    const [mdContent, setMdContent] = useState('')
    const ref = useRef(null as any)

    // methods

    const handleTextChange = (e: ChangeEvent) => {
        e.stopPropagation()
        setTimeout(() => {
            setMdContent(ref.current.state.value)
        }, 200);
    }

    return (
        <div className="MarkdownEditor">
            {/* editor */}
            <Input.TextArea
                spellCheck='false'
                ref={ref}
                onChange={handleTextChange}
                className='md-editor'
                placeholder='请在此输入题目介绍（markdown）'
            ></Input.TextArea>
            {/* preview */}
            <ReactMarkdown className='preview' source={mdContent}></ReactMarkdown>
        </div>
    )
}

export default MarkdownEditor