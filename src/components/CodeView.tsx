import React, { useContext, useState, useRef, useEffect } from "react";
import { store } from "../store/index";
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
    const { exerciseInfo } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] ||
            "javascript") as typeof LangArr[number]
    );
    const [code, setCode] = useState((exerciseInfo.code || {}) as CodeProps);
    const [preCode, setPreCode] = useState(
        (exerciseInfo.preCode || {}) as CodeProps
    );
    const [lastCode, setLastCode] = useState(
        (exerciseInfo.lastCode || {}) as CodeProps
    );
    const monacoRef = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);

    useEffect(() => {
        setCode(exerciseInfo.code as CodeProps);
        setPreCode(exerciseInfo.preCode as CodeProps);
        setLastCode(exerciseInfo.lastCode as CodeProps);
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
    const preCodeChange = (val: string) => {
        setPreCode({
            ...preCode,
            [LumosLanguage]: val
        });
    };
    const lastCodeChange = (val: string) => {
        setLastCode({
            ...lastCode,
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
                    preCode,
                    lastCode
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
            className="CodeView"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            <div className="toolBar">
                <div className="t-wrapper">
                    <div>
                        <span>当前语言：</span>
                        <Select
                            defaultValue={LumosLanguage}
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
                    </div>
                    <span className="title">前置代码</span>
                </div>
                <div className="t-wrapper">
                    <span className="title">后置代码</span>
                    <div>
                        <span>题目指定语言：</span>
                        <Select
                            placeholder="请选择题目包含的语言"
                            style={{
                                minWidth: 255
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
                    <span className="title">用户可见代码</span>
                </div>
            </div>
            <div className="code-wrapper">
                {/* 前置代码 */}
                <div className="pre-code">
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                        refreshMode="throttle"
                        refreshRate={100}
                    >
                        <MonacoEditor
                            value={preCode?.[LumosLanguage] || ""}
                            language={LumosLanguage}
                            theme="vs-dark"
                            onChange={preCodeChange}
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
                {/* 后置代码 */}
                <div className="last-code">
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                        refreshMode="throttle"
                        refreshRate={100}
                    >
                        <MonacoEditor
                            value={lastCode?.[LumosLanguage] || ""}
                            language={LumosLanguage}
                            theme="vs-dark"
                            onChange={lastCodeChange}
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

export default CodeView;
