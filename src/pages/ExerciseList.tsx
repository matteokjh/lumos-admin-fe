import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, Icon, message, Table, Radio, Modal, Input, Spin } from "antd";
import "../styles/ExerciseList.sass";
import { useHistory } from "react-router-dom";
import { ExeProps, ModeType, testCaseType } from "../types/exercise";
import { getList } from "../api/exercise";
import { TRANSFER_MODE } from "../utils/global_config";
import { RadioChangeEvent } from "antd/lib/radio";
import { exerciseShow, deleteExercise } from "../api/exercise";

const ExerciseList = () => {
    const history = useHistory();
    const [list, setList] = useState([] as ExeProps[]);
    const [deleteModalVisible, showDeleteModal] = useState(false);
    const [selectedExercise, setSelected] = useState(-1);
    const confirmInputRef = useRef(null as any);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // column
    const columns = [
        {
            title: "编号",
            dataIndex: "id",
            key: "id",
            width: 80
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (val: string, row: ExeProps) => (
                <NavLink to={`/exerciseList/detail/${row.id}`}>
                    <span>{row.title}</span>
                </NavLink>
            ),
            width: 150
        },
        {
            title: "贡献者",
            dataIndex: "contributor",
            key: "contributor",
            width: 100
        },
        {
            title: "难度",
            dataIndex: "mode",
            render: (val: ModeType) => {
                return (
                    <span
                        style={{
                            backgroundColor: TRANSFER_MODE(val)[1],
                            padding: "5px 8px",
                            fontSize: 13,
                            color: "#fefefe",
                            borderRadius: 3,
                            userSelect: "none"
                        }}
                    >
                        {TRANSFER_MODE(val)[0]}
                    </span>
                );
            },
            key: "mode",
            width: 80
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            render: (val: string) => {
                return new Date(val).toLocaleString();
            }
        },
        {
            title: "修改时间",
            dataIndex: "modifiedTime",
            key: "modifiedTime",
            render: (val: string) => {
                return new Date(val).toLocaleString()
            }
        },
        {
            title: "提交次数",
            dataIndex: "submitTimes",
            key: "submitTimes"
        },
        {
            title: "通过次数",
            dataIndex: "passTimes",
            key: "passTimes"
        },
        {
            title: "测试用例数",
            dataIndex: "testCase",
            key: "testCase",
            render: (val?: testCaseType[]) => {
                return val?.filter(e => e.show).length || 0;
            }
        },
        {
            title: "是否显示",
            key: "show",
            render: (row: ExeProps) => {
                return (
                    <Radio.Group
                        defaultValue={row.show || 0}
                        className="showBtn"
                        size="small"
                        onChange={e => changeShow(row.id, e)}
                    >
                        <Radio.Button
                            value={1}
                            className={`show ${row.show && "show-active"}`}
                        >
                            显示
                        </Radio.Button>
                        <Radio.Button
                            value={0}
                            className={`hide ${!row.show && "hide-active"}`}
                        >
                            隐藏
                        </Radio.Button>
                    </Radio.Group>
                );
            },
            width: 120
        },
        {
            title: "操作",
            key: "operation",
            render: (row: ExeProps) => {
                return (
                    <div className="btn-group">
                        <Button
                            onClick={() => {
                                showDeleteModal(true);
                                setSelected(row.id);
                            }}
                            size="small"
                            type="danger"
                        >
                            删除
                        </Button>
                    </div>
                );
            }
        }
    ];

    // methods
    const refresh = async () => {
        setLoading(true);
        try {
            let res = await getList();
            if (res.code === 200) {
                setList(res.data);
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        setLoading(false);
    };
    // 显示/隐藏 题目
    const changeShow = async (id: number, e: RadioChangeEvent) => {
        let res = await exerciseShow(id, e.target.value);
        try {
            if (res.code === 200) {
                refresh();
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };
    // 删除题目
    const handleDelelte = async () => {
        try {
            let res = await deleteExercise(selectedExercise)
            if(res.code === 200) {
                message.success('删除成功')
                refresh()
            } else {
                message.error(res.msg)
            }
        } catch(err) {
            message.error(err)
        }
        confirmInputRef.current.state.value = ''
        showDeleteModal(false)
    };
    // 确认删除
    const handleInput = (e: ChangeEvent) => {
        e.stopPropagation();
        setTimeout(() => {
            setConfirm(
                +confirmInputRef.current.state.value === selectedExercise
            );
        }, 200);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <Spin spinning={loading}>
            <div className="ExerciseList">
                {/* 按钮组 */}
                <div className="toolbar">
                    <Button onClick={refresh}>刷新</Button>
                    <Button
                        type="primary"
                        onClick={() => history.push("/exerciseList/new")}
                    >
                        <Icon type="plus" />
                        <span>新增题目</span>
                    </Button>
                </div>
                <div className="main">
                    <Table
                        dataSource={list}
                        columns={columns}
                        rowKey="id"
                    ></Table>
                </div>
                {/* 确认删除 modal */}
                <Modal
                    title={
                        <span style={{ color: "#ff4a4d" }}>
                            <Icon type="warning" /> 注意
                        </span>
                    }
                    okButtonProps={{
                        disabled: !confirm,
                        type: "danger"
                    }}
                    visible={deleteModalVisible}
                    okText="确定"
                    onOk={handleDelelte}
                    cancelText="取消"
                    onCancel={() => {
                        confirmInputRef.current.state.value = ''
                        showDeleteModal(false)
                    }}
                >
                    <p>
                        确认要<b>删除</b>该题？此操作<b>不可逆</b>！输入该题{" "}
                        <b>编号</b> 以确认：
                    </p>
                    <Input ref={confirmInputRef} onChange={handleInput}></Input>
                </Modal>
            </div>
        </Spin>
    );
};

export default ExerciseList;
