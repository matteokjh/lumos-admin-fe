import React, { useRef } from "react";
import { Modal, Input } from "antd";
import "./styles/AddTestCaseModal.sass";

const AddTestCaseModal = (props: any) => {
    const inRef = useRef(null as any);
    const outRef = useRef(null as any);
    const textRef = useRef(null as any);

    const { mode, activeItem, activeIdx } = props;


    return (
        <Modal
            title={mode === "new" ? "添加测试用例" : "编辑测试用例"}
            okText="确定"
            cancelText="取消"
            visible={props.visible}
            onCancel={props.onCancel}
            maskClosable={false}
            width={800}
            style={{
                height: 600
            }}
            onOk={() =>
                props.onOk({
                    type: mode,
                    index: activeIdx,
                    obj: {
                        input: inRef.current.state.value,
                        output: outRef.current.state.value,
                        text: textRef.current.state.value,
                        show: activeItem?.show || false
                    }
                })
            }
            className="AddTestCaseModal"
            key={`add_testcase_modal_${activeIdx}`}
        >
            <div>
                <div className="wrapper">
                    <div>
                        <b>输入</b>
                        <Input.TextArea
                            defaultValue={activeItem.input}
                            ref={inRef}
                        ></Input.TextArea>
                    </div>
                    <div>
                        <b>输出</b>
                        <Input.TextArea
                            defaultValue={activeItem.output}
                            ref={outRef}
                        ></Input.TextArea>
                    </div>
                </div>
                <p className="text">
                    <span>备注：</span>
                    <Input
                        spellCheck={false}
                        allowClear
                        defaultValue={activeItem.text}
                        ref={textRef}
                    ></Input>
                </p>
            </div>
        </Modal>
    );
};

export default AddTestCaseModal;
