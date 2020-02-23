import React, { useState, useContext, useEffect } from "react";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Radio,
    message,
    Tag,
    Tooltip,
    Icon,
    AutoComplete
} from "antd";
import "../styles/ExerciseForm.sass";
import { COLOR, DEFAULT_TAGS } from "../utils/global_config";
import { ExeBaseInfo, opTypeProps } from "../types/exercise";
import { saveExercise } from "../api/exercise";
import { store } from "../store/index";
import { useHistory, useLocation } from "react-router-dom";
import { SelectValue } from "antd/lib/select";

const ExerciseForm = (props: any) => {
    const { getFieldDecorator, setFieldsValue } = props.form;
    const { state, dispatch } = useContext(store);
    const history = useHistory();
    const { exerciseInfo } = state;
    const [isEdit, setIsEdit] = useState(false);
    const location = useLocation();
    const [opType, setOpType] = useState(
        (location.pathname.indexOf("detail") > -1
            ? "detail"
            : "new") as opTypeProps
    );
    const [tags, setTags] = useState((exerciseInfo.tags || []) as string[]);
    const [tagInputVisible, setTagInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // methods

    // 是否可以编辑
    const canEdit = () => {
        return opType === "new" || (opType === "detail" && isEdit);
    };
    // 保存题目
    const save = () => {
        props.form.validateFields(async (err: Error, values: ExeBaseInfo) => {
            if (!err) {
                let obj = {
                    ...values,
                    tags
                };
                try {
                    let res = await saveExercise({
                        data: obj,
                        type: opType
                    });
                    if (res.code === 200) {
                        message.success(res.msg);
                        if (opType === "new") {
                            history.push(`/exerciseList/detail/${res.data.id}`);
                            setOpType('detail')
                        } else {
                            setIsEdit(false);
                        }
                        dispatch({
                            type: "SET_EXERCISE",
                            payload: res.data
                        });
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
        setTags(exerciseInfo?.tags || []);
    };

    // 标签相关

    // 删除标签
    const handleClose = (tag: string) => {
        setTags(tags.filter(e => e !== tag));
    };
    // 编辑标签
    const showInput = () => {
        setTagInputVisible(true);
    };
    // 文字变更
    const handleInputChange = (e: any) => {
        setInputValue(e);
    };
    const handleSelect = (e: SelectValue) => {
        let str = e.toString();
        setInputValue(str);
        if (str && tags.indexOf(str) === -1) {
            setTags([...tags, str]);
        }
        setTagInputVisible(false);
        setInputValue("");
    };
    // 确认标签变更
    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setTagInputVisible(false);
        setInputValue("");
    };

    useEffect(() => {
        setTags(exerciseInfo.tags || []);
    }, [exerciseInfo]);

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
                        initialValue: exerciseInfo.mode || ''
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
                <Form.Item label="标签">
                    <div className="tags">
                        {tags?.map(tag => {
                            const isLongTag = tag.length > 10;
                            const tagElem = (
                                <Tag
                                    key={tag}
                                    closable={isEdit}
                                    onClose={() => handleClose(tag)}
                                >
                                    {isLongTag ? `${tag.slice(0, 10)}...` : tag}
                                </Tag>
                            );
                            return isLongTag ? (
                                <Tooltip title={tag} key={tag}>
                                    {tagElem}
                                </Tooltip>
                            ) : (
                                tagElem
                            );
                        })}
                        {tagInputVisible ? (
                            <AutoComplete
                                size="small"
                                style={{ width: 100 }}
                                value={inputValue}
                                onChange={handleInputChange}
                                onSelect={handleSelect}
                                onBlur={handleInputConfirm}
                                disabled={opType === "detail" && !isEdit}
                                dataSource={DEFAULT_TAGS}
                                autoFocus
                                open
                            />
                        ) : (
                            ((opType === "detail" && isEdit) ||
                                opType === "new") && (
                                <Tag
                                    onClick={showInput}
                                    style={{
                                        background: "#fff",
                                        borderStyle: "dashed"
                                    }}
                                >
                                    <Icon type="plus" /> 新增标签
                                </Tag>
                            )
                        )}
                    </div>
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
