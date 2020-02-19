import React, { useState, useEffect, useContext } from "react";
import { Button, Icon, Menu, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import ExerciseForm from "../components/ExerciseForm";
import CodeView from "../components/CodeView";
import TestCaseForm from "../components/TestCaseForm";
import Execute from "@/components/Execute";

import { getExeInfo } from "../api/exercise";

import "../styles/Exercise.sass";
import { SelectParam } from "antd/lib/menu";
import { store } from "../store/index";

// 题目详情页，适用 新增题目、题目详情（含编辑）
const Exercise = (props: any) => {
    const history = useHistory();
    const [Active, setActive] = useState("baseInfo");
    const location = useLocation();
    const { dispatch } = useContext(store);
    const [opType, setOpType] = useState("new");

    useEffect(() => {
        let id = props.match.params["id"];
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
        // eslint-disable-next-line
    }, [location.pathname, dispatch]);

    // methods
    const back = () => {
        history.goBack();
    };
    const handleSelect = (obj: SelectParam) => {
        setActive(obj.key);
    };

    return (
        <div className="Exercise">
            {/* 主体 */}
            <div className="main">
                <Button onClick={back} className="back-btn">
                    <Icon type="arrow-left" />
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
                    <Menu.Item key="code" disabled={opType === "new"}>
                        <span>代码</span>
                    </Menu.Item>
                    <Menu.Item key="testCase" disabled={opType === "new"}>
                        <span>测试用例</span>
                    </Menu.Item>
                    <Menu.Item key="execute" disabled={opType === "new"}>
                        <span>运行</span>
                    </Menu.Item>
                </Menu>
                {// 基本信息
                (Active === "baseInfo" && <ExerciseForm></ExerciseForm>) ||
                    // 题目介绍（markdown 编辑器）
                    (Active === "markdown" && (
                        <MarkdownEditor></MarkdownEditor>
                    )) ||
                    // 代码
                    (Active === "code" && <CodeView></CodeView>) ||
                    // 测试用例
                    (Active === "testCase" && <TestCaseForm></TestCaseForm>) ||
                    // 运行
                    (Active === "execute" && <Execute></Execute>)}
            </div>
        </div>
    );
};

export default Exercise;
