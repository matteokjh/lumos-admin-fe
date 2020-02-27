import React, { useContext, useState, useRef, useEffect } from "react";
import { store } from "../store/index";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
import "../styles/CodeViewTwo.sass";
import { LANGS } from "../utils/global_config";
import { Select, message } from "antd";
import { saveExercise } from "../api/exercise";
import { CodeProps, LangArr, AnswerProps } from "../types/exercise";
const { Option } = Select;

const CodeViewTwo = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] ||
            "javascript") as typeof LangArr[number]
    );
    const [code, setCode] = useState((exerciseInfo?.code || {}) as CodeProps);
    const [answer, setAnswer] = useState(
        (exerciseInfo.answer || {}) as AnswerProps
    );
    const monacoRef = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);

    useEffect(() => {
        setCode(exerciseInfo?.code as CodeProps);
        setAnswer(exerciseInfo?.answer as AnswerProps);
    }, [exerciseInfo]);

    // methods
    // 初始化
    const editorDidMount: EditorDidMount = (editor, monaco) => {};
    // 代码编辑
    const codeChange = (val: string) => {
        setCode({
            ...code,
            [LumosLanguage]: val
        });
    };
    const answerCodeChange = (val: string) => {
        setAnswer({
            code: val,
            lang: answer?.lang || 'javascript'
        });
    };
    const answerLangChange = (val: typeof LangArr[number]) => {
        setAnswer({
            code: answer?.code,
            lang: val
        });
    };
    // 用户可见语言变更
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
                    saveCode();
                    break;
            }
        }
    };
    // 保存
    const saveCode = async () => {
        try {
            let res = await saveExercise({
                data: {
                    id: exerciseInfo.id,
                    code,
                    answer
                },
                type: "detail"
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
            className="CodeViewTwo"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            <div className="toolBar">
                <div className="t-wrapper">
                    <span className="title">答案</span>
                    <div>
                        <span>答案语言：</span>
                        <Select
                            defaultValue={
                                exerciseInfo?.answer?.lang || "javascript"
                            }
                            onChange={answerLangChange}
                            style={{
                                width: 120
                            }}
                        >
                            {LangArr.map(e => (
                                <Option value={e} key={e}>
                                    {LANGS(e).label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="t-wrapper">
                    <span className="title">用户可见代码</span>
                    <div>
                        <span>当前语言：</span>
                        <Select
                            defaultValue={LumosLanguage}
                            onChange={langChange}
                            style={{
                                width: 120
                            }}
                        >
                            {LangArr.map(e => (
                                <Option value={e} key={e}>
                                    {LANGS(e).label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
            <div className="code-wrapper">
                {/* 答案 */}
                <div className="main-code">
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                        refreshMode="throttle"
                        refreshRate={100}
                    >
                        <MonacoEditor
                            value={answer?.code || ""}
                            language={answer?.lang || "javascript"}
                            theme="vs-dark"
                            onChange={answerCodeChange}
                            editorDidMount={editorDidMount}
                            options={{
                                scrollBeyondLastLine: false,
                                minimap: {
                                    enabled: false
                                }
                            }}
                        ></MonacoEditor>
                    </ReactResizeDetector>
                </div>
                {/* 用户可见代码 */}
                <div className="main-code">
                    {/* 代码编辑器，套上自适应组件 */}
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                        refreshMode="throttle"
                        refreshRate={100}
                    >
                        <MonacoEditor
                            ref={monacoRef}
                            value={code?.[LumosLanguage] || ""}
                            language={LumosLanguage}
                            theme="vs-dark"
                            onChange={codeChange}
                            editorDidMount={editorDidMount}
                            options={{
                                scrollBeyondLastLine: false,
                                minimap: {
                                    enabled: false
                                }
                            }}
                        ></MonacoEditor>
                    </ReactResizeDetector>
                </div>
            </div>
        </div>
    );
};

export default CodeViewTwo;
