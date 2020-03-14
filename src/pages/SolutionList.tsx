import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    message,
    Table,
    Input,
    Spin,
    Form,
    DatePicker,
    Select
} from "antd";
import { getList } from "@/api/solution";
import "@/styles/SolutionList.sass";
import { PaginationProps } from "antd/lib/pagination";
import {
    filters_operator,
    filters_lang,
    filters_state,
    filters_judge,
    filters_optype
} from "@/utils/solution_filters";
import {
    FilterProps,
    SearchObjProps,
    SortInfoProps,
    RequestObjProps,
    SolutionProps,
    OperatorProps
} from "@/types/solution";
import moment from "moment";
import { debounce, formatOperator, formatLang, formatState, formatJudgeResult, formatOpType } from "@/utils/methods";
import { fetchUser } from "@/api/base";
import { LangArr, ExecOpType } from "@/types/exercise";
import { stateProps, JudgeCode } from '@/types/solution'

type OptionType = {
    text: string;
    value: string;
    key: string;
};

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD HH:mm:ss";

const ExerciseList = () => {
    const [list, setList] = useState([] as SolutionProps[]);
    const [loading, setLoading] = useState(false);
    // 分页信息
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: {
            goButton: (
                <Button type="primary" style={{ marginLeft: 10 }}>
                    跳转
                </Button>
            )
        }
    } as PaginationProps);
    const [filterInfo, setFilterInfo] = useState({} as FilterProps);
    const [searchObj, setSearchObj] = useState({} as SearchObjProps);
    const [sortInfo, setSortInfo] = useState({} as SortInfoProps);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const [userOption, setUserOption] = useState([] as OptionType[]);
    const [fetching, setFetching] = useState(false);

    // column
    const columns = [
        {
            title: "uuid",
            dataIndex: "sid",
            key: "sid",
            render: (data: string) => {
                return <Link to={`/solutionList/${data}`}>{data}</Link>;
            }
        },
        {
            title: "题号",
            dataIndex: "id",
            key: "id",
            width: 80
        },
        {
            title: "执行者",
            dataIndex: "operator",
            key: "operator",
            width: 100,
            render: (data?: typeof OperatorProps[number]) => {
                return <span className="whiteText" style={{
                    backgroundColor: formatOperator(data)[1]
                }}>{formatOperator(data)[0]}</span>;
            },
            filters: filters_operator
        },
        {
            title: "类别",
            dataIndex: "opType",
            key: "opType",
            width: 100,
            render: (data?: ExecOpType) => {
                return <span className="whiteText" style={{
                    backgroundColor: formatOpType(data)[1]
                }}>{formatOpType(data)[0]}</span>;
            },
            filters: filters_optype
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: 100,
            render: (data: string) => {
                return <Link to={`/user/detail/${data}`}>{data}</Link>;
            }
        },
        {
            title: "语言",
            dataIndex: "lang",
            key: "lang",
            width: 100,
            filters: filters_lang,
            render: (data?: typeof LangArr[number]) => {
                return <span className="whiteText" style={{
                    backgroundColor: formatLang(data)[1]
                }}>{formatLang(data)[0]}</span>;
            }
        },
        {
            title: "状态",
            dataIndex: "state",
            key: "state",
            width: 100,
            render: (data: stateProps) => {
                return <span className="whiteText" style={{
                    backgroundColor: formatState(data)[1]
                }}>{formatState(data)[0]}</span>;
            },
            filters: filters_state
        },
        {
            title: "结果",
            dataIndex: "judge",
            key: "judge",
            width: 150,
            render: (data: JudgeCode) => {
                return <span className="whiteText" style={{
                    color: formatJudgeResult(data)[2],
                    backgroundColor: formatJudgeResult(data)[3],
                }}>{formatJudgeResult(data)[1]}</span>;
            },
            filters: filters_judge
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            render: (val: string) => {
                return new Date(val).toLocaleString();
            },
            sorter: (a: SolutionProps, b: SolutionProps) =>
                a.createTime - b.createTime
        }
    ];

    // methods
    const refresh = () => {
        getData({
            ...searchObj,
            ...filterInfo,
            order: sortInfo.order,
            orderBy: sortInfo.field,
            page: pagination.current,
            pageSize: pagination.pageSize
        });
    };
    const getData = async (obj: RequestObjProps) => {
        setLoading(true);
        try {
            let res = await getList(obj);
            if (res.code === 200) {
                setTotal(res.data?.total || 0);
                setList(res.data?.list || []);
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        setLoading(false);
    };
    const handleTableChange = async (
        newPagination: any,
        filters: any,
        sorter: any
    ) => {
        setPagination(newPagination);
        setFilterInfo(filters);
        setSortInfo(sorter);
    };
    const handleSearch = async () => {
        try {
            let values = await form.validateFields();
            let createAtStart, createAtEnd;
            if (values["createTime"]) {
                createAtStart =
                    values["createTime"][0] &&
                    values["createTime"][0]._d.getTime();
                createAtEnd =
                    values["createTime"][1] &&
                    values["createTime"][1]._d.getTime();
            }
            setSearchObj({
                sid: values["sid"],
                id: values["id"],
                username: values["username"],
                createAtStart,
                createAtEnd
            });
            setPagination({
                current: 1
            });
        } catch (err) {
            console.error(err);
        }
    };
    const handleChange = (e: any) => {
        if (e.target.value === "") handleSearch();
    };
    // 用户列表
    const searchUser = async (val: string) => {
        setFetching(true);
        try {
            let res = await fetchUser(val);
            if (res.code === 200) {
                let arr = res.data.map((e: { username: string }) => {
                    return {
                        value: e.username,
                        text: e.username,
                        key: e.username
                    };
                });
                setUserOption(arr);
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        setFetching(false);
    };

    useEffect(() => {
        getData({
            ...searchObj,
            ...filterInfo,
            order: sortInfo.order,
            orderBy: sortInfo.field,
            page: pagination.current,
            pageSize: pagination.pageSize
        });
    }, [filterInfo, pagination, searchObj, sortInfo]);

    return (
        <Spin spinning={loading}>
            <div className="SolutionList">
                {/* 按钮组 */}
                <div className="toolbar">
                    <Button onClick={refresh}>刷新</Button>
                    <Button type="primary" onClick={handleSearch}>
                        查找
                    </Button>
                    <div>
                        <Form className="solution-form" form={form}>
                            <Form.Item label="uuid" name="sid">
                                <Input
                                    allowClear
                                    onChange={handleChange}
                                    spellCheck="false"
                                    autoComplete="off"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="题号" name="id">
                                <Input
                                    allowClear
                                    onChange={handleChange}
                                    spellCheck="false"
                                    autoComplete="off"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="用户名" name="username">
                                <Select
                                    allowClear
                                    onChange={handleSearch}
                                    mode="multiple"
                                    style={{
                                        width: 200
                                    }}
                                    onSearch={debounce(searchUser, 200)}
                                    notFoundContent={
                                        fetching ? (
                                            <Spin size="small"></Spin>
                                        ) : null
                                    }
                                >
                                    {userOption.map((e: OptionType) => (
                                        <Select.Option
                                            value={e.value}
                                            key={e.value}
                                        >
                                            {e.text}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="时间范围" name="createTime">
                                <RangePicker
                                    ranges={{
                                        Today: [moment(), moment()]
                                    }}
                                    showTime
                                    onChange={handleSearch}
                                    format={dateFormat}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="main">
                    <Table
                        dataSource={list}
                        columns={columns}
                        rowKey="sid"
                        emptyText="暂无数据"
                        pagination={{
                            ...pagination,
                            total
                        }}
                        onChange={handleTableChange}
                    ></Table>
                </div>
            </div>
        </Spin>
    );
};

export default ExerciseList;
