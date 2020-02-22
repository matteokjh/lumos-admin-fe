import React, { useEffect, useState, useRef } from "react";
import { getExeInfo, execute } from "../api/exercise";
import {
    message,
    Select,
    Button,
    Menu,
    Icon,
    Input,
    Empty,
    Skeleton
} from "antd";
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

type consoleBoxType = "result" | "testcase";

type outputType = {
    stdout_output: string;
    result_output: string;
};

type resultType = {
    state: "true" | "error" | "false";
    output: outputType[];
};

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
    // 用户自定的一个测试用例，默认为所有测试用例的第一个
    const [singleCaseInput, setSingleCaseInput] = useState("");
    // 控制台
    const [consoleActive, setConsoleActive] = useState(
        "result" as consoleBoxType
    );
    // 输出
    const [result, setResult] = useState({} as resultType);
    // 正在运行
    const [isRunning, setIsRunning] = useState(false);

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
    // 测试运行
    const testRun = async () => {
        setIsRunning(true);
        setConsoleActive("result");
        setIsOpen(true);
        try {
            let res = await execute({
                opType: "testRun",
                exerciseId: exercise.id,
                code: code,
                lang: LumosLanguage,
                username: "429797371@qq.com",
                singleCaseInput: singleCaseInput
            });
            console.log(res);
            if (res.code === 200) {
                setResult(res.data);
            } else {
                message.error("未知错误，请联系管理员");
            }
        } catch (err) {
            message.error(err);
        }
        setIsRunning(false);
    };
    // 运行
    const submitRun = async () => {
        setIsRunning(true);
        setConsoleActive("result");
        setIsOpen(true);
        try {
            let res = await execute({
                opType: "submit",
                exerciseId: exercise.id,
                code: code,
                lang: LumosLanguage,
                username: "429797371@qq.com"
            });
            console.log(res);
            if (res.code === 200) {
            } else {
            }
        } catch (err) {
            message.error(err);
        }
        setIsRunning(false);
    };

    const test = (e: any) => {
        setSingleCaseInput(e.target.value);
    };

    useEffect(() => {
        setCode(exercise?.code?.[LumosLanguage] || "");
        exercise.defaultTestCase &&
            setSingleCaseInput(exercise.defaultTestCase.input);
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
                                options={{
                                    scrollBeyondLastLine: false
                                }}
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
                        {/* 顶部 menu */}
                        <div className="console_top">
                            <div className="console_menu">
                                <Menu
                                    onClick={e =>
                                        setConsoleActive(
                                            e.key as consoleBoxType
                                        )
                                    }
                                    mode="horizontal"
                                    selectedKeys={[consoleActive]}
                                >
                                    <Menu.Item
                                        key="testcase"
                                        disabled={isRunning}
                                    >
                                        测试用例
                                    </Menu.Item>
                                    <Menu.Item
                                        key="result"
                                        disabled={isRunning}
                                    >
                                        运行结果
                                    </Menu.Item>
                                </Menu>
                            </div>
                            <Icon
                                onClick={showConsole}
                                className="console_icon"
                                type={isOpen ? "down" : "up"}
                            ></Icon>
                        </div>
                        {/* 中间主体 */}
                        <div
                            className="console_mid"
                            style={{
                                height: isOpen ? "164px" : 0
                            }}
                        >
                            {/* 测试用例 */}
                            {consoleActive === "testcase" ? (
                                <div className="testcaseBox">
                                    <Input.TextArea
                                        defaultValue={
                                            exercise.defaultTestCase?.input ||
                                            ""
                                        }
                                        onChange={test}
                                    ></Input.TextArea>
                                </div>
                            ) : (
                                // 运行结果
                                <div className="result">
                                    {/* 如果成功运行，渲染：输入，输出，期望输出 */}
                                    {isRunning ? (
                                        <Skeleton active></Skeleton>
                                    ) : (
                                        ((result.state === "true" ||
                                            result.state === "false") && (
                                            <div className="res_wrapper">
                                                <p>输入：</p>
                                                <Input.TextArea
                                                    value={singleCaseInput}
                                                    disabled
                                                ></Input.TextArea>
                                                <p>输出：</p>
                                                <Input.TextArea
                                                    value={
                                                        result.output[1]
                                                            .result_output
                                                    }
                                                    disabled
                                                ></Input.TextArea>
                                                <p>期望输出：</p>
                                                <Input.TextArea
                                                    value={
                                                        result.output[0]
                                                            .result_output
                                                    }
                                                    disabled
                                                ></Input.TextArea>
                                                {/* stdout */}
                                                {result.output[1]
                                                    .stdout_output && (
                                                    <>
                                                        <p>stdout：</p>
                                                        <Input.TextArea
                                                            value={
                                                                result.output[1]
                                                                    .stdout_output
                                                            }
                                                            disabled
                                                        ></Input.TextArea>
                                                    </>
                                                )}
                                            </div>
                                        )) ||
                                        // 报错，渲染错误信息
                                        (result.state === "error" && (
                                            <div className="res_err">
                                                <Input.TextArea
                                                    value={result.output[1].toString()}
                                                    disabled
                                                ></Input.TextArea>
                                            </div>
                                        )) || (
                                            // 未运行，空
                                            <Empty
                                                description="暂无数据"
                                                image={
                                                    Empty.PRESENTED_IMAGE_SIMPLE
                                                }
                                            ></Empty>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                        {/* 底部按钮 */}
                        <div className="console_bottom">
                            <div className="left">
                                <Button
                                    size="small"
                                    onClick={showConsole}
                                    disabled={isRunning}
                                >
                                    控制台
                                </Button>
                            </div>
                            <div className="right">
                                <Button onClick={testRun} disabled={isRunning}>
                                    测试运行
                                </Button>
                                <Button
                                    onClick={submitRun}
                                    type="primary"
                                    disabled={isRunning}
                                >
                                    提交
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
