import React, { useState, useRef, ChangeEvent, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "antd";
import "../styles/MarkdownEditor.sass";
import { saveExercise } from "../api/exercise";
import { store } from '../store'

const MarkdownEditor = () => {
    const [mdContent, setMdContent] = useState("");
    const ref = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);
    const { opType } = useContext(store).state


    // methods

    const handleTextChange = (e: ChangeEvent) => {
        e.stopPropagation();
        setTimeout(() => {
            setMdContent(ref.current.state.value);
        }, 200);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // ctrl or command
        if((navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
            e.preventDefault()
            setIsCtrl(true)
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // ctrl or command
        if((navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            setIsCtrl(false)
        }
        if(isCtrl) {
            switch (e.keyCode) {
                case 83:
                    // s
                    saveMd()
                    break;
            }
        }
    };

    const saveMd = () => {
        console.log(mdContent)
        saveExercise({
            data: {
                introduction: mdContent
            },
            type: opType
        })
    }

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <div className="MarkdownEditor">
            {/* editor */}
            <Input.TextArea
                spellCheck="false"
                ref={ref}
                onChange={handleTextChange}
                className="md-editor"
                placeholder="请在此输入题目介绍（markdown），ctrl + s 保存"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            ></Input.TextArea>
            {/* preview */}
            <ReactMarkdown
                className="preview"
                source={mdContent}
            ></ReactMarkdown>
        </div>
    );
};

export default MarkdownEditor;
