import React from "react";
import { Button, Menu, Input, Empty, Skeleton } from "antd";
import "@/styles/ConsoleBox.sass";
import { ExeProps } from "@/types/exercise";
import { DownOutlined, UpOutlined, LoadingOutlined } from "@ant-design/icons";
import { consoleBoxType, SolutionProps } from "@/types/solution";
import { formatMemory, formatJudgeResult } from "@/utils/methods";

interface ConsoleBoxProps {
    consoleActive: consoleBoxType;
    result: SolutionProps;
    isRunning: boolean;
    submitRunning: boolean;
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
        singleCaseInput,
        submitRunning
    } = props;

    return (
        <div className="ConsoleBox">
            {isOpen && (
                <>
                    {/* 顶部菜单 */}
                    <div className="console_top">
                        <div className="console_menu">
                            <Menu
                                onClick={(e: any) =>
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
                        <span onClick={showConsole} className="console_icon">
                            {isOpen ? <DownOutlined /> : <UpOutlined />}
                        </span>
                    </div>
                    {/* 中间主体 */}
                    <div className="console_mid">
                        {/* 测试用例 */}
                        {consoleActive === "testcase" ? (
                            <div className="testcaseBox">
                                <Input.TextArea
                                    defaultValue={
                                        singleCaseInput ||
                                        exercise.defaultTestCase?.input
                                    }
                                    onChange={changeSingleCase}
                                    spellCheck={false}
                                ></Input.TextArea>
                            </div>
                        ) : (
                            // 测试运行结果
                            <div className="result">
                                {/* 如果成功运行，渲染：输入，输出，期望输出 */}
                                {isRunning ? (
                                    <Skeleton active></Skeleton>
                                ) : (
                                    (result.state === "success" && (
                                        <div className="res_wrapper">
                                            {/* 结果栏 */}
                                            <div
                                                className="res_info"
                                                style={{
                                                    backgroundColor: formatJudgeResult(
                                                        result.judge
                                                    )[3]
                                                }}
                                            >
                                                <span
                                                    className="res_done"
                                                    style={{
                                                        color: formatJudgeResult(
                                                            result.judge
                                                        )[2]
                                                    }}
                                                >
                                                    {
                                                        formatJudgeResult(
                                                            result.judge
                                                        )[1]
                                                    }
                                                </span>
                                                <span>
                                                    执行用时：
                                                    {result.time} ms
                                                </span>
                                                <span>
                                                    内存消耗：
                                                    {formatMemory(
                                                        result.memory
                                                    )}
                                                </span>
                                            </div>
                                            {/* 如果 AC 或者 WA */}
                                            {result.judge === 2 ||
                                            result.judge === 6 ? (
                                                <div className="AC_box">
                                                    {/* 输入 */}
                                                    <div>
                                                        <p>输入：</p>
                                                        <div className="valueBox">
                                                            {singleCaseInput}
                                                        </div>
                                                    </div>
                                                    {/* 输出 */}
                                                    <div>
                                                        <p>输出：</p>
                                                        <div className="valueBox">
                                                            {
                                                                result.result[0]
                                                                    .output
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* 预期结果 */}
                                                    <div>
                                                        <p>预期结果：</p>
                                                        <div className="valueBox">
                                                            {
                                                                result
                                                                    .testdata[0]
                                                                    .output
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* stdout */}
                                                    {result.result[0]
                                                        .stdout && (
                                                        <div>
                                                            <p>stdout：</p>
                                                            <div className="valueBox">
                                                                {
                                                                    result
                                                                        .result[0]
                                                                        .stdout
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                // 除了 AC 和 WA，其它结果标红
                                                <div className="res_err">
                                                    <div>
                                                        {result.result[0]
                                                            .stdout ||
                                                            "执行出错"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )) ||
                                    // 报错，渲染错误信息
                                    (result.state === "error" && (
                                        <div className="res_err">
                                            <Input.TextArea
                                                value={
                                                    result.error || "执行出错"
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
                {(isRunning || submitRunning) && (
                    <span className="waiting">
                        <span>等待中</span>
                        <LoadingOutlined />
                    </span>
                )}
                <div className="left">
                    <Button
                        size="small"
                        onClick={showConsole}
                        disabled={isRunning || submitRunning}
                    >
                        控制台
                    </Button>
                </div>
                <div className="right">
                    <Button onClick={testRun} disabled={isRunning || submitRunning}>
                        测试运行
                    </Button>
                    <Button
                        onClick={submitRun}
                        type="primary"
                        disabled={isRunning || submitRunning}
                    >
                        提交
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConsoleBox;
