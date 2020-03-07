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
    AutoComplete
} from "antd";
import "@/styles/ExerciseForm.sass";
import { COLOR, DEFAULT_TAGS } from "@/utils/global_config";
import { opTypeProps } from "@/types/exercise";
import { saveExercise } from "@/api/exercise";
import { store } from "@/store/index";
import { useHistory, useLocation } from "react-router-dom";
import { SelectValue } from "antd/lib/select";
import { PlusOutlined } from "@ant-design/icons";

const ExerciseForm = (props: any) => {
    const [form] = Form.useForm();
    const { setFieldsValue } = form;
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
    const save = async () => {
        let values = await form.validateFields();
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
                    setOpType("detail");
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
        setTags(tags.filter((e: string) => e !== tag));
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
        form.setFieldsValue({
            id: exerciseInfo.id,
            title: exerciseInfo.title,
            mode: exerciseInfo.mode,
            contributor: exerciseInfo.contributor
        })
    }, [exerciseInfo, form]);

    return (
        <div className="ExerciseForm">
            <Form
                form={form}
                className="exercise-form"
                initialValues={{
                    id: exerciseInfo.id,
                    title: exerciseInfo.title,
                    mode: exerciseInfo.mode,
                    contributor: exerciseInfo.contributor
                }}
            >
                {/* id */}
                <Form.Item
                    label="编号"
                    name="id"
                    rules={[
                        {
                            required: true,
                            message: "请输入数字编号",
                            type: "number"
                        }
                    ]}
                >
                    <InputNumber
                        placeholder="编号"
                        min={0}
                        max={99999999}
                        disabled={opType !== "new"}
                    />
                </Form.Item>
                {/* title */}
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: "请输入标题" }]}
                >
                    <Input
                        placeholder="标题"
                        allowClear
                        autoComplete="off"
                        disabled={!canEdit()}
                    />
                </Form.Item>
                {/* mode */}
                <Form.Item label="难度" name="mode">
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
                </Form.Item>
                {/* contributor */}
                <Form.Item label="贡献者" name="contributor">
                    <Input
                        disabled={!canEdit()}
                        spellCheck="false"
                        allowClear
                        autoComplete="off"
                    />
                </Form.Item>
                {/* tag */}
                <Form.Item label="标签">
                    <div className="tags">
                        {tags?.map((tag: string) => {
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
                                options={DEFAULT_TAGS.map(e => ({value: e}))}
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
                                    <PlusOutlined /> 新增标签
                                </Tag>
                            )
                        )}
                    </div>
                </Form.Item>
                {/* 按钮 */}
                <Form.Item className="btn-group">
                    {opType === "new" ? (
                        <Button onClick={save} type="primary">
                            新建题目
                        </Button>
                    ) : opType === "detail" && isEdit ? (
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
                        <Button onClick={() => setIsEdit(true)} type="primary">
                            编辑
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default ExerciseForm;
