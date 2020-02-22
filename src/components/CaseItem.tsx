import React from "react";
import { Card, Icon, Radio, Popconfirm } from "antd";
import { Draggable } from "react-beautiful-dnd";

const CaseItem = (props: any) => {
    const { caseInfo, index } = props;

    return (
        <Draggable draggableId={`draggable_${index}`} index={index}>
            {provided => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Card
                        className={`card ${!caseInfo.show && "card-disabled"}`}
                        title={caseInfo.text || `测试用例 ${index + 1}`}
                        extra={
                            <div className="toolbar">
                                <i>
                                    <Radio.Group
                                        value={caseInfo.show || 0}
                                        className="showBtn"
                                        size="small"
                                        onChange={e => props.changeShow(index, e)}
                                    >
                                        <Radio.Button
                                            value={1}
                                            className={`show ${caseInfo.show &&
                                                "show-active"}`}
                                        >
                                            显示
                                        </Radio.Button>
                                        <Radio.Button
                                            value={0}
                                            className={`hide ${!caseInfo.show &&
                                                "hide-active"}`}
                                        >
                                            隐藏
                                        </Radio.Button>
                                    </Radio.Group>
                                </i>
                                <span {...provided.dragHandleProps}>
                                    <Icon type="menu" />
                                </span>
                                <Icon type="edit" onClick={() => props.editItem(index)} />
                                <Popconfirm
                                    title="确定要删除此用例？"
                                    onConfirm={() => props.deleteItem(index)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Icon
                                        type="close"
                                        style={{
                                            color: "#F44336"
                                        }}
                                    />
                                </Popconfirm>
                            </div>
                        }
                    >
                        <div className="card-wrapper">
                            <p className="input">
                                <span className="title">输入：</span>
                                <span className="content">
                                    {caseInfo.input}
                                </span>
                            </p>
                            <p className="output">
                                <span className="title">输出：</span>
                                <span className="content">
                                    {caseInfo.output}
                                </span>
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default CaseItem;
