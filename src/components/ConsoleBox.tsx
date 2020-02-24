import React from "react";
import { Button, Menu, Icon, Input, Empty, Skeleton } from "antd";
import "@/styles/ConsoleBox.sass";
import { ExeProps } from "@/types/exercise";

type consoleBoxType = "result" | "testcase";

type outputType = {
    stdout_output: string;
    result_output: string;
};

type resultType = {
    state: "true" | "error" | "false";
    output: outputType[];
};

interface ConsoleBoxProps {
    consoleActive: consoleBoxType;
    result: resultType;
    isRunning: boolean;
    isOpen: boolean;
    exercise: ExeProps;
    singleCaseInput: string;
    setConsoleActive: (e: consoleBoxType) => void;
    showConsole: () => void;
    testRun: () => void;
    submitRun: () => void;
    changeSingleCase: (e: any) => void;
}

const ConsoleBox = (props: ConsoleBoxProps) => {
    const {
        showConsole,
        consoleActive,
        setConsoleActive,
        result,
        isRunning,
        testRun,
        submitRun,
        changeSingleCase,
        isOpen,
        exercise,
        singleCaseInput
    } = props;

    return (
        <div className="ConsoleBox">
            {isOpen && (
                <>
                    {/* 顶部菜单 */}
                    <div className="console_top">
                        <div className="console_menu">
                            <Menu
                                onClick={e =>
                                    setConsoleActive(e.key as consoleBoxType)
                                }
                                mode="horizontal"
                                selectedKeys={[consoleActive]}
                            >
                                <Menu.Item key="testcase" disabled={isRunning}>
                                    测试用例
                                </Menu.Item>
                                <Menu.Item key="result" disabled={isRunning}>
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
                    <div className="console_mid">
                        {/* 测试用例 */}
                        {consoleActive === "testcase" ? (
                            <div className="testcaseBox">
                                <Input.TextArea
                                    defaultValue={
                                        sessionStorage['lumos_testcaseInput'] || exercise.defaultTestCase?.input
                                    }
                                    onChange={changeSingleCase}
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
                                            {result.output[1].stdout_output && (
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
                                                value={
                                                    result.output[0]
                                                        .stdout_output
                                                        ? result.output[1].toString()
                                                        : "执行出错"
                                                }
                                                disabled
                                            ></Input.TextArea>
                                        </div>
                                    )) || (
                                        // 未运行，空
                                        <div className="empty">
                                            <Empty
                                                description="暂无数据"
                                                image={
                                                    Empty.PRESENTED_IMAGE_SIMPLE
                                                }
                                            ></Empty>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
            {/* 底部按钮 */}
            <div className="console_bottom">
                {isRunning && (
                    <span className="waiting">
                        <span>等待中</span>
                        <Icon type="loading" />
                    </span>
                )}
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
    );
};

export default ConsoleBox;