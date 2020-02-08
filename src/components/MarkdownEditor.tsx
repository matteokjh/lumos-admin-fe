import React, { useState, useRef, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { message } from "antd";
import { saveExercise } from "../api/exercise";
import { store } from "../store";
import CodeBlock from "./code-block";
import { Controlled as CodeMirror } from "react-codemirror2";
import { debounce } from "../utils/methods";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import "../styles/MarkdownEditor.sass";
import "../styles/markdown.sass";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
require("codemirror/mode/markdown/markdown");
require("codemirror/mode/javascript/javascript");

const MarkdownEditor = () => {
    const [mdContent, setMdContent] = useState(""); // 右边的真实data
    const inputRef = useRef(null as any);
    const previewRef = useRef(null as any);
    const mdWrapperRef = useRef(null as any)
    const [isCtrl, setIsCtrl] = useState(false);
    const { dispatch, state } = useContext(store);
    const { opType, exerciseInfo } = state;
    const [ratio, setRatio] = useState(0);

    // methods

    // 文本变化
    const handleTextChange = (
        editor: CodeMirror.Editor,
        data: CodeMirror.EditorChange,
        value: string
    ) => {
        setMdContent(value);
        // 给markdown的链接加上跳转新页面
        let aTag = window.document.querySelectorAll(".preview a");
        aTag.forEach(e => {
            e.setAttribute("target", "_blank");
        });
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
    // 滚动矫正（右 => 左）
    const handleScroll = (type: "input" | "preview") => {
        if (type === "input") {
            previewRef.current.scrollTop =
                inputRef.current.editor.getScrollInfo().top * ratio;
        } else {
            inputRef.current.editor.scrollTo(
                0,
                previewRef.current.scrollTop / ratio
            );
        }
    };
    // 默认值
    useEffect(() => {
        setMdContent(exerciseInfo.introduction || "");
        setTimeout(() => {
            // 计算两个窗口的高度的比例
            let scrollInfo = inputRef.current.editor.getScrollInfo();
            let a = scrollInfo.height - scrollInfo.clientHeight;
            let b =
                previewRef.current.scrollHeight -
                previewRef.current.clientHeight;
            setRatio(b / a);
        }, 200);
    }, [exerciseInfo]);

    return (
        <div className="MarkdownEditor" ref={mdWrapperRef}>
            {/* editor */}
            <ResizableBox
                width={1300}
                height={1}
                minConstraints={[600, 0]}
                maxConstraints={[1300, 0]}
                axis="x"
            >
                <div
                    className="md-editor"
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onWheel={debounce(handleScroll, "input")}
                    onMouseUp={debounce(handleScroll, "input")}
                >
                    <CodeMirror
                        ref={inputRef}
                        value={mdContent}
                        options={{
                            mode: "markdown",
                            theme: "monokai",
                            lineNumbers: true,
                            lineWrapping: true,
                            scrollbarStyle: 'null'
                        }}
                        onBeforeChange={handleTextChange}
                    />
                </div>
            </ResizableBox>
            {/* preview */}
            <div
                className="preview"
                onWheel={debounce(handleScroll, "preview")}
                onMouseUp={debounce(handleScroll, "preview")}
                ref={previewRef}
            >
                <ReactMarkdown
                    source={mdContent}
                    renderers={{ code: CodeBlock }}
                ></ReactMarkdown>
            </div>
        </div>
    );
};

export default MarkdownEditor;
