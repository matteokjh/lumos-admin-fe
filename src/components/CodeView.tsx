import React, { useContext, useState, useRef, useEffect } from "react";
import { store } from "../store/index";
import ReactMarkdown from "react-markdown/with-html";
import CodeBlock from "./react-markdown-code-block";
import ReactMarkdownLink from "./react-markdown-link";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
import "../styles/CodeView.sass";
import { LANGS } from "../utils/global_config";
import { Select, message } from "antd";
import { saveExercise } from "../api/exercise";
import { LangProps, CodeProps, LangArr } from "../types/exercise";
const { Option } = Select;

const CodeView = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo, opType } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] || "javascript") as typeof LangArr[number]
    );
    const [code, setCode] = useState((exerciseInfo.code || {}) as CodeProps);
    const monacoRef = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);

    useEffect(() => {
        setCode(exerciseInfo.code as CodeProps)
    }, [exerciseInfo.code])

    // methods
    // 初始化
    const editorDidMount: EditorDidMount = (editor, monaco) => {
        // editor.focus();
    };
    // 代码编辑
    const codeChange = (val: string) => {
        setCode({
            ...code,
            [LumosLanguage]: val
        });
    };
    // 题目指定语言变更
    const handleChange = async (val: LangProps) => {
        try {
            let res = await saveExercise({
                type: "detail",
                data: {
                    id: exerciseInfo.id,
                    lang: val
                }
            });
            if (res.code === 200) {
                message.success(res.msg);
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };
    // 当前语言变更
    const langChange = (val: typeof LangArr[number]) => {
        // console.log(val);
        setLumosLanguage(val);
        localStorage["lumos-language"] = val;
    };
    // 阻止 ctrl s 默认事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // ctrl or command
        if (
            (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
            e.keyCode === 83
        ) {
            e.preventDefault();
            setIsCtrl(true);
        }
    };
    // 改为保存
    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // ctrl or command
        if (e.keyCode === 17) {
            setTimeout(() => {
                setIsCtrl(false);
            }, 200);
        }
        if (isCtrl) {
            switch (e.keyCode) {
                case 83:
                    // s
                    saveMd();
                    break;
            }
        }
    };
    // 保存
    const saveMd = async () => {
        try {
            let res = await saveExercise({
                data: {
                    id: exerciseInfo.id,
                    code: code
                },
                type: opType
            });
            if (res.code === 200) {
                message.success("保存成功");
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };

    return (
        <div
            className="CodeView"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
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
                    <Select
                        defaultValue="javascript"
                        onChange={langChange}
                        style={{
                            width: 120,
                            marginRight: 10
                        }}
                    >
                        {LANGS.map(e => (
                            <Option value={e.val} key={e.val}>
                                {e.label}
                            </Option>
                        ))}
                    </Select>
                    <span>题目指定语言：</span>
                    <Select
                        placeholder="请选择题目包含的语言"
                        style={{
                            minWidth: 200
                        }}
                        value={exerciseInfo.lang}
                        onChange={handleChange}
                        mode="multiple"
                    >
                        {LANGS.map(e => (
                            <Option value={e.val} key={e.val}>
                                {e.label}
                            </Option>
                        ))}
                    </Select>
                </div>
                {/* 代码编辑器，套上自适应组件 */}
                <ReactResizeDetector
                    handleWidth
                    refreshMode="throttle"
                    refreshRate={100}
                >
                    <MonacoEditor
                        ref={monacoRef}
                        value={code?.[LumosLanguage] || ''}
                        language={LumosLanguage}
                        theme="vs-dark"
                        onChange={codeChange}
                        editorDidMount={editorDidMount}
                        options={{}}
                    ></MonacoEditor>
                </ReactResizeDetector>
            </div>
        </div>
    );
};

export default CodeView;
