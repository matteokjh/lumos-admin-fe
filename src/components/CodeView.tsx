import React, { useContext, useState, useRef, useEffect } from "react";
import { store } from "../store/index";
import ReactMarkdown from "react-markdown/with-html";
import CodeBlock from "./react-markdown-code-block";
import ReactMarkdownLink from "./react-markdown-link";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import "../styles/CodeView.sass";
import { LANGS } from '../utils/global_config'
import { Select, message } from 'antd'
import { saveExercise } from "../api/exercise";
import { LangProps } from '../types/exercise'
const { Option } = Select

const CodeView = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        localStorage["lumos-language"] || "javascript"
    );
    const [code, setCode] = useState('')
    const monacoRef = useRef(null as any)

    // methods
    // 初始化
    const editorDidMount: EditorDidMount = (editor) => {
        editor.focus()
    }
    // 代码编辑
    const codeChange = (code: string) => {
        console.log(code)
        // setCode(code)
    };
    // 题目指定语言变更
    const handleChange = async (val: LangProps) => {
        try {
            let res = await saveExercise({
                type: 'detail',
                data: {
                    id: exerciseInfo.id,
                    lang: val
                }
            })
            if(res.code === 200) {
                message.success(res.msg)
                dispatch({
                    type: 'SET_EXERCISE',
                    payload: res.data
                })
            } else {
                message.error(res.msg)
            }
        } catch(err) {
            message.error(err)
        }
    };
    // 当前语言变更
    const langChange = (val: string) => {
        console.log(val);
        setLumosLanguage(val)
        localStorage["lumos-language"] = val 
    };

    // const autoResize = () => {
    //     console.log(monacoRef.current.editor)
    //     monacoRef.current.editor.layout()
    // }

    useEffect(() => {
        // window.addEventListener('resize', autoResize)
        // return () => {
        //     window.removeEventListener('resize', autoResize)
        // };
    }, [])

    return (
        <div className="CodeView">
            {/* 介绍 */}
            <div className="intro">
                <ReactMarkdown
                    source={exerciseInfo.introduction}
                    renderers={{ code: CodeBlock, link: ReactMarkdownLink }}
                    escapeHtml={false}
                ></ReactMarkdown>
            </div>
            {/* 代码块 */}
            <div className="code-editor">
                <div className="toolBar">
                    <span>当前语言：</span>
                    <Select defaultValue='javascript' onChange={langChange} style={{
                        width: 120,
                        marginRight: 10
                    }}>
                    {
                        LANGS.map(e=> (
                            <Option value={e.val} key={e.val}>{e.label}</Option>
                        ))
                    }
                    </Select>
                    <span>题目指定语言：</span>
                    <Select placeholder="请选择题目包含的语言" style={{
                        minWidth: 200
                    }} value={exerciseInfo.lang} onChange={handleChange} mode="multiple">
                    {
                        LANGS.map(e=> (
                            <Option value={e.val} key={e.val}>{e.label}</Option>
                        ))
                    }
                    </Select>
                </div>
                <MonacoEditor
                    ref={monacoRef}
                    value={code}
                    language={LumosLanguage}
                    theme="vs-dark"
                    onChange={codeChange}
                    editorDidMount={editorDidMount}
                    options={{
                        selectOnLineNumbers: true,
                        automaticLayout: false
                    }}
                ></MonacoEditor>
            </div>
        </div>
    );
};

export default CodeView;
