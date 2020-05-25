import React, { useEffect, useState } from "react";
import { getSolutionStatistics } from "@/api/statistics";
import { message, Table } from "antd";
import { Link } from "react-router-dom";
import "./chart.sass";
import "./chart3.sass";
import { ExeProps } from "@/types/exercise";

const Chart3 = () => {
    const [list, setList] = useState([] as ExeProps[]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getSolutionStatistics();
                if (res.code === 200) {
                    console.log(res);
                    setList(res.data);
                } else {
                    message.error(res.msg);
                }
            } catch (err) {
                message.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const column = [
        {
            title: "编号",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (data: string, row: ExeProps) => {
                return (
                    <Link to={`/exercise/detail/${row.id}`} target="_blank">
                        {data}
                    </Link>
                );
            },
        },
        {
            title: "提交次数",
            dataIndex: "submitTimes",
            key: "submitTimes",
        },
        {
            title: "通过次数",
            dataIndex: "passTimes",
            key: "passTimes",
        },
    ];

    return (
        <div className="chart3 chart">
            <h2>提交排行</h2>
            <Table
                size="small"
                loading={loading}
                dataSource={list}
                rowKey="id"
                columns={column}
                className="table"
                pagination={{
                    size: 'small',
                    pageSize: 5
                }}
            ></Table>
        </div>
    );
};

export default Chart3;
