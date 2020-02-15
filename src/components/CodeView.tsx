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
    const { exerciseInfo, opType } = state;
    const [LumosLanguage, setLumosLanguage] = useState(
        (localStorage["lumos-language"] ||
            "javascript") as typeof LangArr[number]
    );

    const [TestCode, setTestCode] = useState(
        (exerciseInfo.TestCode || {}) as CodeProps
    );
    const [code, setCode] = useState((exerciseInfo.code || {}) as CodeProps);
    const monacoRef = useRef(null as any);
    const testCodeRef = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);

    useEffect(() => {
        setCode(exerciseInfo.code as CodeProps);
        setTestCode(exerciseInfo.TestCode as CodeProps);
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
    const TestCodeChange = (val: string) => {
        setTestCode({
            ...TestCode,
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
                    code: code,
                    TestCode: TestCode
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
            {/* 测试代码 */}
            <div className="intro">
                <div className="toolBar">
                    <span className="title">测试代码</span>
                    <div className="t-wrapper">
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
                </div>
                <ReactResizeDetector
                    handleWidth
                    refreshMode="throttle"
                    refreshRate={100}
                >
                    <MonacoEditor
                        ref={testCodeRef}
                        value={TestCode?.[LumosLanguage] || ""}
                        language={LumosLanguage}
                        theme="vs-dark"
                        onChange={TestCodeChange}
                        editorDidMount={editorDidMount}
                    ></MonacoEditor>
                </ReactResizeDetector>
            </div>
            {/* 用户可见代码 */}
            <div className="code-editor">
                <div className="toolBar">
                    <span className="title">用户可见代码</span>
                    <div className="t-wrapper">
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
                </div>
                {/* 代码编辑器，套上自适应组件 */}
                <ReactResizeDetector
                    handleWidth
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
                    ></MonacoEditor>
                </ReactResizeDetector>
            </div>
        </div>
    );
};

export default CodeView;
