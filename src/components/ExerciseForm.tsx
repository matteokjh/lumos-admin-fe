import React, { useState, useContext } from "react";
import { Form, Input, InputNumber, Button, Radio, message } from "antd";
import "../styles/ExerciseForm.sass";
import { COLOR } from "../utils/global_config";
import { ExeBaseInfo, opTypeProps } from "../types/exercise";
import { saveExercise } from "../api/exercise";
import { store } from "../store/index";
import { useHistory, useLocation } from "react-router-dom";

const ExerciseForm = (props: any) => {
    const { getFieldDecorator, setFieldsValue } = props.form;
    const { state } = useContext(store);
    const history = useHistory();
    const { exerciseInfo } = state;
    const [isEdit, setIsEdit] = useState(false);
    const location = useLocation();
    const [opType] = useState(
        (location.pathname.indexOf("detail") > -1
            ? "detail"
            : "new") as opTypeProps
    );

    // methods

    // 是否可以编辑
    const canEdit = () => {
        return opType === "new" || (opType === "detail" && isEdit);
    };
    // 保存题目
    const save = () => {
        props.form.validateFields(async (err: Error, values: ExeBaseInfo) => {
            if (!err) {
                try {
                    let res = await saveExercise({
                        data: values,
                        type: opType
                    });
                    if (res.code === 200) {
                        message.success(res.msg);
                        if (opType === "new") {
                            history.push(`/exerciseList/detail/${res.data.id}`);
                        } else {
                            setIsEdit(false);
                        }
                    } else {
                        message.error(res.msg);
                    }
                } catch (err) {
                    message.error(err);
                }
            }
        });
    };
    // 取消
    const handleCancel = () => {
        let { id, title, mode, contributor } = exerciseInfo;
        setIsEdit(false);
        setFieldsValue({
            id,
            title,
            mode,
            contributor
        });
    };
    return (
        <div className="ExerciseForm">
            <Form onSubmit={save} className="exercise-form">
                <Form.Item label="编号">
                    {getFieldDecorator("id", {
                        rules: [
                            {
                                required: true,
                                message: "请输入数字编号",
                                type: "number"
                            }
                        ],
                        initialValue: exerciseInfo.id
                    })(
                        <InputNumber
                            placeholder="编号"
                            min={0}
                            max={99999999}
                            disabled={opType !== "new"}
                        />
                    )}
                </Form.Item>
                <Form.Item label="标题">
                    {getFieldDecorator("title", {
                        rules: [{ required: true, message: "请输入标题" }],
                        initialValue: exerciseInfo.title
                    })(
                        <Input
                            placeholder="标题"
                            allowClear
                            autoComplete="off"
                            disabled={!canEdit()}
                        />
                    )}
                </Form.Item>
                <Form.Item label="难度">
                    {getFieldDecorator("mode", {
                        initialValue: exerciseInfo.mode
                    })(
                        <Radio.Group disabled={!canEdit()}>
                            <Radio value="Easy">
                                <span
                                    style={{
                                        color: COLOR.EASY_MODE
                                    }}
                                >
                                    简单
                                </span>
                            </Radio>
                            <Radio value="Medium">
                                <span
                                    style={{
                                        color: COLOR.MEDIUM_MODE
                                    }}
                                >
                                    中等
                                </span>
                            </Radio>
                            <Radio value="Hard">
                                <span
                                    style={{
                                        color: COLOR.HARD_MODE
                                    }}
                                >
                                    困难
                                </span>
                            </Radio>
                            <Radio value="">未知</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="贡献者">
                    {getFieldDecorator("contributor", {
                        initialValue: exerciseInfo.contributor
                    })(
                        <Input
                            disabled={!canEdit()}
                            spellCheck="false"
                            allowClear
                            autoComplete="off"
                        />
                    )}
                </Form.Item>
                {/* 按钮 */}
                <Form.Item className="btn-group">
                    {(opType === "new" && (
                        <Button onClick={save} type="primary">
                            新建题目
                        </Button>
                    )) ||
                        (opType === "detail" &&
                            (isEdit ? (
                                <div>
                                    <Button
                                        onClick={handleCancel}
                                        style={{
                                            marginRight: 10
                                        }}
                                    >
                                        取消
                                    </Button>
                                    <Button onClick={save} type="primary">
                                        保存
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => setIsEdit(true)}
                                    type="primary"
                                >
                                    编辑
                                </Button>
                            )))}
                </Form.Item>
            </Form>
        </div>
    );
};

export default Form.create({
    name: "ExerciseForm"
})(ExerciseForm);
