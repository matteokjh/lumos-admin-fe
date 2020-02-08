import React, { useContext, useState } from "react";
import { store } from "../store/index";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./code-block";
import "../styles/CodeView.sass";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

const CodeView = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        localStorage["lumos-language"] || "javascript"
    );
    const [code, setCode] = useState('')

    // methods
    const handleSetLang = (e: any) => {
        // localStorage['lumos-language'] = value
    };
    // 初始化
    const editorDidMount: EditorDidMount = (editor) => {
        editor.focus()
    }
    // 代码编辑
    const handleChange = (code: string) => {
        console.log(code);
    };

    return (
        <div className="CodeView">
            {/* 介绍 */}
            <div className="intro">
                <ReactMarkdown
                    source={exerciseInfo.introduction}
                    renderers={{ code: CodeBlock }}
                ></ReactMarkdown>
            </div>
            {/* 代码块 */}
            <div className="code-editor">
                <MonacoEditor
                    language={LumosLanguage}
                    value={code}
                    theme="vs-dark"
                    onChange={handleChange}
                    editorDidMount={editorDidMount}
                    options={{
                        selectOnLineNumbers: true
                    }}
                ></MonacoEditor>
            </div>
        </div>
    );
};

export default CodeView;
