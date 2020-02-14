import React, { useRef } from "react";
import { Modal, Input } from "antd";
import "./styles/AddTestCaseModal.sass";

const AddTestCaseModal = (props: any) => {
    const inRef = useRef(null as any);
    const outRef = useRef(null as any);
    const textRef = useRef(null as any);

    return (
        <Modal
            title="添加测试用例"
            okText="确定"
            cancelText="取消"
            visible={props.visible}
            onCancel={props.onCancel}
            maskClosable={false}
            onOk={() =>
                props.onOk({
                    input: inRef.current.state.value,
                    output: outRef.current.state.value,
                    text: textRef.current.state.value
                })
            }
            className="AddTestCaseModal"
        >
            <div>
                <div className="wrapper">
                    <div>
                        <b>输入</b>
                        <Input.TextArea ref={inRef}></Input.TextArea>
                    </div>
                    <div>
                        <b>输出</b>
                        <Input.TextArea ref={outRef}></Input.TextArea>
                    </div>
                </div>
                <p className="text">
                    <span>备注：</span>
                    <Input ref={textRef}></Input>
                </p>
            </div>
        </Modal>
    );
};

export default AddTestCaseModal;
