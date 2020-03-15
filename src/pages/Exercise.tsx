import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Button, Menu, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";

import { getExeInfo } from "@/api/exercise";

import "@/styles/Exercise.sass";
import { store } from "@/store/index";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Waiting from "./Waiting";

const ExerciseForm = lazy(() => import("@/components/Exercise/ExerciseForm"));
const MarkdownEditor = lazy(() =>
    import("@/components/Exercise/MarkdownEditor")
);
const CodeViewOne = lazy(() => import("@/components/Exercise/CodeViewOne"));
const CodeViewTwo = lazy(() => import("@/components/Exercise/CodeViewTwo"));
const TestCaseForm = lazy(() => import("@/components/Testcase/TestCaseForm"));
const Execute = lazy(() => import("@/components/Exercise/Execute"));
const Result = lazy(() => import("@/components/Exercise/Result"));

// 题目详情页，适用 新增题目、题目详情（含编辑）
const Exercise = (props: any) => {
    const history = useHistory();
    const [Active, setActive] = useState("baseInfo");
    const location = useLocation();
    const { dispatch } = useContext(store);
    const [opType, setOpType] = useState("new");

    useEffect(() => {
        let id = props.match.params.id;
        (async () => {
            // 题目详情
            if (location.pathname.indexOf("detail") >= 0) {
                try {
                    let r = await getExeInfo(id);
                    if (r.code === 200) {
                        dispatch({
                            type: "SET_EXERCISE",
                            payload: r.data
                        });
                    } else {
                        message.error(r.msg);
                    }
                } catch (err) {
                    message.error(err);
                }
                setOpType("detail");
            } else {
                dispatch({
                    type: "SET_EXERCISE",
                    payload: {}
                });
                setOpType("new");
            }
        })();
    }, [location.pathname, dispatch, props.match.params.id]);

    // methods
    const back = () => {
        history.goBack();
    };
    const handleSelect = (obj: any) => {
        setActive(obj.key);
    };

    return (
        <div className="Exercise">
            {/* 主体 */}
            <div className="main">
                <Button onClick={back} className="back-btn">
                    <ArrowLeftOutlined />
                    <span>返回</span>
                </Button>
                <Menu
                    onSelect={handleSelect}
                    className="exe-menu"
                    mode="horizontal"
                    defaultSelectedKeys={["baseInfo"]}
                >
                    <Menu.Item key="baseInfo">
                        <span>基本信息</span>
                    </Menu.Item>
                    <Menu.Item key="markdown" disabled={opType === "new"}>
                        <span>题目介绍</span>
                    </Menu.Item>
                    <Menu.Item key="code1" disabled={opType === "new"}>
                        <span>代码 I</span>
                    </Menu.Item>
                    <Menu.Item key="code2" disabled={opType === "new"}>
                        <span>代码 II</span>
                    </Menu.Item>
                    <Menu.Item key="testCase" disabled={opType === "new"}>
                        <span>测试用例</span>
                    </Menu.Item>
                    <Menu.Item key="execute" disabled={opType === "new"}>
                        <span>运行</span>
                    </Menu.Item>
                    <Menu.Item key="result" disabled={opType === "new"}>
                        <span>提交记录</span>
                    </Menu.Item>
                </Menu>
                <Suspense fallback={<Waiting></Waiting>}>
                    {// 基本信息
                    (Active === "baseInfo" && <ExerciseForm></ExerciseForm>) ||
                        // 题目介绍（markdown 编辑器）
                        (Active === "markdown" && (
                            <MarkdownEditor></MarkdownEditor>
                        )) ||
                        // 代码 I
                        (Active === "code1" && <CodeViewOne></CodeViewOne>) ||
                        // 代码 II
                        (Active === "code2" && <CodeViewTwo></CodeViewTwo>) ||
                        // 测试用例
                        (Active === "testCase" && (
                            <TestCaseForm></TestCaseForm>
                        )) ||
                        // 运行
                        (Active === "execute" && <Execute></Execute>)
                        || (Active === 'result' && <Result></Result>)
                    }
                </Suspense>
            </div>
        </div>
    );
};

export default Exercise;
