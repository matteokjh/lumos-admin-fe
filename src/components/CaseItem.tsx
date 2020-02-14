import React from "react";
import { Card, Icon } from "antd";
import { Draggable } from "react-beautiful-dnd";

const CaseItem = (props: any) => {
    const { caseInfo, index } = props;
    return (
        <Draggable draggableId={`draggable_${index}`} index={index}>
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                >
                    <Card
                        className="card"
                        title={caseInfo.text || `测试用例 ${index + 1}`}
                        extra={
                            <div className="toolbar">
                                <span>
                                    <Icon type="menu" />
                                </span>
                                <Icon type="edit" />
                                <Icon
                                    type="close"
                                    style={{
                                        color: "#F44336"
                                    }}
                                />
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
