import React, { useState } from "react";
import { Button, Icon, Menu, Divider } from "antd";
import { useHistory } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import ExerciseForm from "../components/ExerciseForm";
import CodeView from "../components/CodeView";
import TestCaseForm from "../components/TestCaseForm";

import "../styles/Exercise.sass";
import { SelectParam } from "antd/lib/menu";

// 单个题目组件，适用 新增题目、题目详情（含编辑）
const Exercise = () => {
    const history = useHistory();
    const [Active, setActive] = useState("baseInfo");

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
                    <Menu.Item key="markdown">
                        <span>题目介绍</span>
                    </Menu.Item>
                    <Menu.Item key="code">
                        <span>代码</span>
                    </Menu.Item>
                    <Menu.Item key="testCase">
                        <span>测试用例</span>
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
                    (Active === "testCase" && <TestCaseForm></TestCaseForm>)}
            </div>
        </div>
    );
};

export default Exercise;
