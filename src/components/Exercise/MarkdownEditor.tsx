import React, { useState, useRef, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown/with-html";
import { message } from "antd";
import { saveExercise } from "@/api/exercise";
import { store } from "@/store";
import CodeBlock from "@/components/reactMd/react-markdown-code-block";
import { debounce } from "@/utils/methods";

import "@/styles/MarkdownEditor.sass";
import "@/styles/markdown.sass";
import ReactMarkdownLink from "@/components/reactMd/react-markdown-link";
import ReactResizeDetector from "react-resize-detector";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

const MarkdownEditor = () => {
    const inputRef = useRef(null as any);
    const previewRef = useRef(null as any);
    const mdWrapperRef = useRef(null as any);
    const [isCtrl, setIsCtrl] = useState(false);
    const { dispatch, state } = useContext(store);
    const { exerciseInfo } = state;
    const [mdContent, setMdContent] = useState(
        exerciseInfo?.introduction || ""
    ); // 右边的真实data

    // methods

    // 文本变化
    const handleTextChange = (value: string) => {
        try {
            setMdContent(value);
        } catch (err) {
            console.log(err);
        }
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
                    introduction: mdContent
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
    // 滚动矫正（右 => 左）
    const handleScroll = (type: "input" | "preview") => {
        console.log(type)
        if (!inputRef.current) return;
        let editor = inputRef.current.editor;
        let leftHeight = editor.getScrollHeight();
        let rightHeight =
            previewRef.current.scrollHeight + previewRef.current.clientHeight;
        let ratio = rightHeight / leftHeight;
        if (type === "input") {
            previewRef.current.scrollTop = editor.getScrollTop() * ratio;
        } else {
            editor.setScrollTop(previewRef.current.scrollTop / ratio);
        }
    };
    // monaco editor 鼠标滚轮滚动矫正
    const editorDidMount: EditorDidMount = (editor, monaco) => {
        // @ts-ignore
        editor.onMouseWheel(debounce(handleScroll.bind(null, "input")));
    };
    // 默认值
    useEffect(() => {
        setMdContent(exerciseInfo.introduction || "");
    }, [exerciseInfo]);

    return (
        <div className="MarkdownEditor" ref={mdWrapperRef}>
            {/* editor */}
            <div
                className="md-editor"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onWheel={debounce(handleScroll.bind(null, "input"))}
                onMouseUp={debounce(handleScroll.bind(null, "input"))}
            >
                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    refreshMode="throttle"
                    refreshRate={100}
                >
                    <MonacoEditor
                        ref={inputRef}
                        value={mdContent}
                        theme="vs-dark"
                        onChange={handleTextChange}
                        editorDidMount={editorDidMount}
                        language="markdown"
                        options={{
                            scrollBeyondLastLine: false,
                            wordWrap: "bounded",
                            minimap: {
                                enabled: false
                            }
                        }}
                    ></MonacoEditor>
                </ReactResizeDetector>
            </div>
            {/* preview */}
            <div
                className="preview"
                onWheel={debounce(handleScroll.bind(null, "preview"))}
                onMouseUp={debounce(handleScroll.bind(null, "preview"))}
                ref={previewRef}
            >
                <ReactMarkdown
                    className="md-wrapper"
                    source={mdContent}
                    escapeHtml={false}
                    renderers={{ code: CodeBlock, link: ReactMarkdownLink }}
                ></ReactMarkdown>
            </div>
        </div>
    );
};

export default MarkdownEditor;
