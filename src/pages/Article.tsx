import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, message, Table, Radio, Modal, Input, Spin, Empty } from "antd";
import "@/styles/Article.sass";
import { WarningOutlined, SearchOutlined } from "@ant-design/icons";
import { ArticleProps } from "@/types/article";
import { UserProps } from "@/types/user";
import { articleShow, deleteArticle, getList } from "@/api/article";

const Article = () => {
    const [list, setList] = useState([] as ArticleProps[]);
    const [deleteModalVisible, showDeleteModal] = useState(false);
    const [selectedArticle, setSelected] = useState({} as ArticleProps);
    const confirmInputRef = useRef(null as any);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // column
    const columns = [
        {
            title: "aid",
            dataIndex: "aid",
            key: "aid",
            width: 200
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (data: string, row: ArticleProps) => (
                <Link to={`/article/detail/${row.aid}`}>
                    <span>{row.title}</span>
                </Link>
            ),
            minWidth: 250
        },
        {
            title: "作者",
            dataIndex: "author",
            key: "author",
            minWidth: 100,
            render: (data: UserProps) => {
                return (
                    <Link to={`/user/detail/${data.username}`} target="_blank">
                        <span
                            style={{
                                color: "#ff8822"
                            }}
                        >
                            {data.name}
                        </span>
                    </Link>
                );
            }
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
                return new Date(val).toLocaleString();
            }
        },
        {
            title: "是否显示",
            key: "show",
            render: (row: ArticleProps) => {
                return (
                    <Radio.Group
                        defaultValue={row.show || 0}
                        className="showBtn"
                        size="small"
                        onChange={e => changeShow(row.aid, e)}
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
            render: (row: ArticleProps) => {
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
    // 显示/隐藏 文章
    const changeShow = async (id: string, e: any) => {
        let res = await articleShow(id, e.target.value);
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
            let res = await deleteArticle(selectedArticle.aid);
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
                confirmInputRef.current.state.value === selectedArticle.aid
            );
        }, 200);
    };
    const handleCancel = () => {
        confirmInputRef.current.state.value = "";
        setSelected({} as ArticleProps);
        setConfirm(false);
        showDeleteModal(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <Spin spinning={loading}>
            <div className="Article">
                {/* 按钮组 */}
                <div className="toolbar">
                    <Button onClick={refresh}>刷新</Button>
                    <Input placeholder="搜索文章" spellCheck="false"></Input>
                    <SearchOutlined className="search" />
                </div>
                <div className="main">
                    <Table
                        dataSource={list}
                        columns={columns}
                        rowKey="aid"
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
                        确认要<b>删除</b>该文章？此操作<b>不可逆</b>！输入该文章{" "}
                        <b>aid</b> 以确认：
                    </p>
                    <Input ref={confirmInputRef} onChange={handleInput}></Input>
                </Modal>
            </div>
        </Spin>
    );
};

export default Article;
