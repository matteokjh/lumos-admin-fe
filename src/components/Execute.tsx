import React, { useEffect, useState, useRef } from "react";
import { getExeInfo } from "../api/exercise";
import { message, Select, Button } from "antd";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import { ExeProps } from "../types/exercise";
import CodeBlock from "./react-markdown-code-block";
import ReactMarkdownLink from "./react-markdown-link";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
import { LangArr } from "../types/exercise";
import "../styles/Execute.sass";

const { Option } = Select;

const Execute = () => {
    const location = useLocation();
    const [exercise, setExercise] = useState({} as ExeProps);
    const CodeRef = useRef(null as any);
    const [code, setCode] = useState("");
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] ||
            "javascript") as typeof LangArr[number]
    );

    // methods
    // 初始化
    const editorDidMount: EditorDidMount = (editor, monaco) => {};
    // 代码编辑
    const codeChange = (val: string) => {
        setCode(val);
    };
    // 变更语言
    const handleChange = (value: typeof LangArr[number]) => {
        setLumosLanguage(value);
    };
    // 阻止 ctrl s 默认事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // ctrl or command
        if (
            (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
            e.keyCode === 83
        ) {
            e.preventDefault();
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {};
    // 控制台
    const showConsole = () => {};
    // 运行
    const runCode = () => {
        console.log(code);
    };

    useEffect(() => {
        setCode(exercise?.code?.[LumosLanguage] || "");
    }, [exercise, LumosLanguage]);

    useEffect(() => {
        // 获取题目信息
        (async () => {
            const id = location.pathname.split("detail/")[1];
            if (!isNaN(+id)) {
                try {
                    let res = await getExeInfo(+id);
                    if (res.code === 200) {
                        console.log(res);
                        setExercise(res.data);
                    } else {
                        message.error(res.msg);
                    }
                } catch (err) {
                    message.error(err);
                }
            }
        })();
    }, [location]);

    return (
        <div className="Execute">
            <div className="title">
                <h1>
                    {exercise.id}. {exercise.title}
                </h1>
            </div>
            <div
                className="main"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            >
                <div className="info">
                    <ReactMarkdown
                        source={exercise.introduction}
                        escapeHtml={false}
                        renderers={{ code: CodeBlock, link: ReactMarkdownLink }}
                    ></ReactMarkdown>
                </div>
                <div className="exec-code">
                    <div className="toolbar">
                        <Select
                            style={{
                                minWidth: 255
                            }}
                            value={LumosLanguage}
                            onChange={handleChange}
                        >
                            {exercise.lang?.map(e => (
                                <Option value={e} key={e}>
                                    {e}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div
                        className="code-wrapper"
                        style={{
                            height: 440
                        }}
                    >
                        <ReactResizeDetector
                            handleWidth
                            refreshMode="throttle"
                            refreshRate={100}
                            handleHeight
                        >
                            <MonacoEditor
                                ref={CodeRef}
                                defaultValue={exercise?.code?.[LumosLanguage]}
                                value={code}
                                language={LumosLanguage}
                                theme="vs-dark"
                                onChange={codeChange}
                                editorDidMount={editorDidMount}
                            ></MonacoEditor>
                        </ReactResizeDetector>
                    </div>
                    <div
                        className="console"
                        style={{
                            height: 50
                        }}
                    >
                        <Button onClick={showConsole} type="primary">控制台</Button>
                        <Button onClick={runCode} type="primary">运行</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Execute;
