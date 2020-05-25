import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { message, Skeleton } from "antd";
import { getExeStatistics } from "@/api/statistics";
import { getExeOption, getExeOption2 } from "@/utils/options";
import "./chart.sass";
import "./chart2.sass";

const Chart2 = (props: any) => {
    const { refProps, ref2Props } = props;
    const [data, setData] = useState({} as any);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getExeStatistics();
                if (res.code === 200) {
                    console.log(res.data)
                    setData(res.data);
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
    

    return (
        <div className="chart2 chart">
            <h2>题目统计</h2>
            <div className="wrapper">
                {/* 左饼图 */}
                <div className="left">
                    <Skeleton
                        loading={loading}
                        active
                        className="loading"
                        paragraph={{ rows: 6 }}
                    >
                        <ReactEcharts
                            style={{
                                height: "100%",
                            }}
                            className="graph"
                            option={getExeOption(data?.modeInfo)}
                            ref={refProps}
                        ></ReactEcharts>
                    </Skeleton>
                </div>
                {/* 右饼图 */}
                <div className="right">
                    <Skeleton
                        loading={loading}
                        active
                        className="loading"
                        paragraph={{ rows: 6 }}
                    >
                        <ReactEcharts
                            style={{
                                height: "100%",
                            }}
                            option={getExeOption2(data?.passInfo?.[0])}
                            ref={ref2Props}
                        ></ReactEcharts>
                    </Skeleton>
                </div>
            </div>
        </div>
    );
};

export default Chart2;
