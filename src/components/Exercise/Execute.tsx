import React, { useEffect, useState, useRef } from "react";
import { getExeInfo, execute } from "@/api/exercise";
import { message, Select } from "antd";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import { ExeProps } from "@/types/exercise";
import CodeBlock from "@/components/reactMd/react-markdown-code-block";
import ReactMarkdownLink from "@/components/reactMd/react-markdown-link";
import { LangArr } from "@/types/exercise";
import MonacoEditor from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
import ConsoleBox from "./ConsoleBox";
import { LANGS } from "@/utils/global_config";
import { getSolution } from "@/api/solution";
import "@/styles/Execute.sass";
import "@/styles/markdown.sass";
import { SolutionProps } from "@/types/solution";

const { Option } = Select;

type consoleBoxType = "result" | "testcase";

const Execute = () => {
    const location = useLocation();
    const [exercise, setExercise] = useState({} as ExeProps);
    const CodeRef = useRef(null as any);
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] || "js") as typeof LangArr[number]
    );
    const [code, setCode] = useState(exercise?.code?.[LumosLanguage] || "");
    const [isOpen, setIsOpen] = useState(false);
    // 用户自定的一个测试用例，默认为所有测试用例的第一个
    const [singleCaseInput, setSingleCaseInput] = useState("");
    // 控制台
    const [consoleActive, setConsoleActive] = useState(
        "result" as consoleBoxType
    );
    // 输出
    const [result, setResult] = useState({} as SolutionProps);
    // 正在运行
    const [isRunning, setIsRunning] = useState(false);
    // t
    let T = 5;
    const [timer, setTimer] = useState([] as any);
    // 当前题号
    const [id] = useState(location.pathname.split("detail/")[1]);

    // methods

    // 代码编辑
    const codeChange = (val: string) => {
        setCode(val);
        saveStorage(val);
    };
    // 存 localStorage
    const saveStorage = (val: string) => {
        if (!localStorage[`lumos_code_${id}`]) {
            localStorage[`lumos_code_${id}`] = JSON.stringify({});
        }
        let obj = JSON.parse(localStorage[`lumos_code_${id}`]);
        obj[LumosLanguage] = val;
        localStorage[`lumos_code_${id}`] = JSON.stringify(obj);
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
    // 获取运行结果
    const getRes = async (sid: string) => {
        try {
            let res = await getSolution(sid);
            if (res.code === 200) {
                console.log(res);
                if (res.data.state === "pending" && T) {
                    let t = setTimeout(() => {
                        T--;
                        getRes(sid);
                    }, 3000);
                    setTimer(timer.concat(t));
                } else {
                    if (T === 0) {
                        message.error("执行出错");
                    }
                    setResult(res.data);
                    setIsRunning(false);
                    T = 5;
                }
            } else {
                message.error(res.msg);
                setIsRunning(false);
            }
        } catch (err) {
            message.error(err);
            setIsRunning(false);
        }
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
                singleCaseInput: singleCaseInput
            });
            console.log(res);
            if (res.code === 200) {
                getRes(res.data);
            } else {
                message.error(res.msg);
                setIsRunning(false);
            }
        } catch (err) {
            message.error(err);
            setIsRunning(false);
        }
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
                lang: LumosLanguage
            });
            console.log(res);
            if (res.code === 200) {
                getRes(res.data);
            } else {
                message.error(res.msg);
                setIsRunning(false);
            }
        } catch (err) {
            message.error(err);
            setIsRunning(false);
        }
    };
    // 更改测试用例
    const changeSingleCase = (e: any) => {
        setSingleCaseInput(e.target.value);
    };

    useEffect(() => {
        return () => {
            for (let t of timer) {
                clearTimeout(t);
            }
        };
    }, [timer]);

    useEffect(() => {
        let obj = {} as any;
        if (localStorage[`lumos_code_${id}`]) {
            obj = JSON.parse(localStorage[`lumos_code_${id}`]);
        }
        setCode(
            obj[LumosLanguage]
                ? obj[LumosLanguage]
                : exercise?.code?.[LumosLanguage] || ""
        );
        exercise.defaultTestCase &&
            setSingleCaseInput(exercise.defaultTestCase.input);
    }, [exercise, LumosLanguage, id]);

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
                            {exercise.lang?.map((e: any) => (
                                <Option value={e} key={e}>
                                    {LANGS(e).label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    {/* 代码编辑器 */}
                    <div className="exc_code_wrapper">
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
                                options={{
                                    scrollBeyondLastLine: false
                                }}
                            ></MonacoEditor>
                        </ReactResizeDetector>
                    </div>
                    {/* 控制台 */}
                    <ConsoleBox
                        showConsole={() => setIsOpen(isOpen => !isOpen)}
                        testRun={testRun}
                        submitRun={submitRun}
                        changeSingleCase={changeSingleCase}
                        consoleActive={consoleActive}
                        setConsoleActive={setConsoleActive}
                        result={result}
                        isRunning={isRunning}
                        isOpen={isOpen}
                        exercise={exercise}
                        singleCaseInput={singleCaseInput}
                    ></ConsoleBox>
                </div>
            </div>
        </div>
    );
};

export default Execute;
