import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import "@/styles/User.sass";
import { Link } from "react-router-dom";
import { Button, message, Table, Modal, Input, Spin, Empty } from "antd";
import { WarningOutlined, SearchOutlined } from "@ant-design/icons";
import { UserProps } from "@/types/user";
import { userList, deleteUser } from "@/api/user";

const User = () => {
    const [list, setList] = useState([] as UserProps[]);
    const [deleteModalVisible, showDeleteModal] = useState(false);
    const [selectedUser, setSelected] = useState({} as UserProps);
    const confirmInputRef = useRef(null as any);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // column
    const columns = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: 100
        },
        {
            title: "昵称",
            dataIndex: "name",
            key: "name",
            render: (data: string, row: UserProps) => (
                <Link to={`/user/detail/${row.username}`}>
                    <span>{data}</span>
                </Link>
            ),
            minWidth: 100
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
            title: "操作",
            key: "operation",
            render: (row: UserProps) => {
                return (
                    <div className="btn-group">
                        <Button
                            onClick={() => {
                                showDeleteModal(true);
                                setSelected(row);
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
            let res = await userList({});
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
    // 删除题目
    const handleDelelte = async () => {
        try {
            let res = await deleteUser(selectedUser.username);
            if (res.code === 200) {
                message.success("删除成功");
                refresh();
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        handleCancel();
    };
    // 确认删除
    const handleInput = (e: ChangeEvent) => {
        e.stopPropagation();
        setTimeout(() => {
            setConfirm(
                confirmInputRef.current.state.value === selectedUser.username
            );
        }, 200);
    };
    const handleCancel = () => {
        confirmInputRef.current.state.value = "";
        setSelected({} as UserProps);
        setConfirm(false);
        showDeleteModal(false);
    };

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                let res = await await userList({});
                if (res.code === 200) {
                    console.log(res.data);
                    setList(res.data);
                } else {
                    message.error(res.msg);
                }
                setLoading(false);
            } catch (err) {
                message.error(err);
            }
        })();
    }, []);

    return (
        <Spin spinning={loading}>
            <div className="User">
                {/* 按钮组 */}
                <div className="toolbar">
                    <Button onClick={refresh}>刷新</Button>
                    <Input placeholder="搜索用户" spellCheck="false"></Input>
                    <SearchOutlined className="search" />
                </div>
                <div className="main">
                    <Table
                        dataSource={list}
                        columns={columns}
                        rowKey="username"
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="暂无数据"
                                ></Empty>
                            )
                        }}
                    ></Table>
                </div>
                {/* 确认删除 modal */}
                <Modal
                    title={
                        <span style={{ color: "#ff4a4d" }}>
                            <WarningOutlined /> 注意
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
                    onCancel={handleCancel}
                >
                    <p>
                        确认要<b>删除</b>该用户？此操作<b>不可逆</b>！输入该用户的{" "}
                        <b>用户名</b> 以确认：
                    </p>
                    <Input ref={confirmInputRef} onChange={handleInput}></Input>
                </Modal>
            </div>
        </Spin>
    );
};

export default User;
