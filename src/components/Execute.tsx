import React, { useEffect, useState, useRef } from "react";
import { getExeInfo, execute } from "../api/exercise";
import { message, Select, Button } from "antd";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import { ExeProps } from "../types/exercise";
import CodeBlock from "./react-markdown-code-block";
import ReactMarkdownLink from "./react-markdown-link";
import { LangArr } from "../types/exercise";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
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
    const [isOpen, setIsOpen] = useState(false);

    // methods
    // 初始化
    const editorDidMount: EditorDidMount = (editor, monaco) => {
        // console.log(editor)
    };
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
    const showConsole = () => {
        setIsOpen(!isOpen);
    };
    // 运行
    const runCode = async () => {
        try {
            let res = await execute({
                opType: 'testRun',
                exerciseId: exercise.id,
                code: code,
                lang: LumosLanguage,
                username: '429797371@qq.com'
            })
            console.log(res)
            if(res.code === 200) {
            } else {

            }
        } catch(err) {
            message.error(err)
        }
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
            <div className="exc_title">
                <h1>
                    {exercise.id}. {exercise.title}
                </h1>
            </div>
            <div
                className="exc_main"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            >
                {/* 左边介绍 */}
                <div className="exc_info">
                    <ReactMarkdown
                        source={exercise.introduction}
                        escapeHtml={false}
                        renderers={{ code: CodeBlock, link: ReactMarkdownLink }}
                    ></ReactMarkdown>
                </div>
                {/* 右边代码编辑模块 */}
                <div className="exc_code">
                    {/* 语言选择 */}
                    <div className="exc_toolbar">
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
                    {/* 代码编辑器 */}
                    <div
                        className="exc_code_wrapper"
                        style={{
                            height: `calc(100vh - ${isOpen ? 485 : 285}px)`
                        }}
                    >
                        <ReactResizeDetector
                            handleWidth
                            handleHeight
                            refreshMode="throttle"
                            refreshRate={100}
                        >
                            <MonacoEditor
                                ref={CodeRef}
                                defaultValue={exercise?.code?.[LumosLanguage]}
                                value={code}
                                language={LumosLanguage}
                                theme="vs-dark"
                                onChange={codeChange}
                                editorDidMount={editorDidMount}
                                height={isOpen ? 270 : 470}
                            ></MonacoEditor>
                        </ReactResizeDetector>
                    </div>
                    {/* 控制台 */}
                    <div
                        className="exc_console"
                        style={{
                            height: isOpen ? 250 : 50
                        }}
                    >
                        <div className="bottom">
                            <div className="left">
                                <Button onClick={showConsole}>控制台</Button>
                            </div>
                            <div className="right">
                                <Button onClick={runCode} type="primary">
                                    运行
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Execute;
