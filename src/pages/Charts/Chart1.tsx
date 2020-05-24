import React, { useEffect, useState } from "react";
import { getCDNStatistics } from "@/api/statistics";
import { message, Skeleton } from "antd";
import ReactEcharts from "echarts-for-react";
import MyCard from "@/components/base/MyCard";
import "./chart.sass";
import "./chart1.sass";
import { getUVOption } from "@/utils/options";

const Chart1 = (props: any) => {
    const { refProps } = props;
    const [data, setData] = useState({} as any);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getCDNStatistics();
                if (res.code === 200) {
                    console.log(res.data.result);
                    setData(res.data?.result);
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
        <div className="chart1 chart">
            <div className="left">
                <h2>访问量统计</h2>
                {/* 左侧折线图 */}
                <Skeleton
                    loading={loading}
                    active
                    className="loading"
                    paragraph={{ rows: 6 }}
                >
                    <ReactEcharts
                        ref={refProps}
                        className="graph"
                        option={getUVOption(data?.timeseries)}
                        style={{
                            height: '80%'
                        }}
                    ></ReactEcharts>
                </Skeleton>
            </div>
            {/* 右侧总数 */}
            <div className="right">
                <h2>总访问量</h2>
                <Skeleton
                    loading={loading}
                    active
                    className="loading"
                    paragraph={{ rows: 6 }}
                    title
                >
                    <div className="c-wrapper">
                        <MyCard
                            title="PV"
                            value={data?.totals?.pageviews?.all}
                            type="green"
                        ></MyCard>
                        <MyCard
                            title="UV"
                            value={data?.totals?.uniques?.all}
                            type="blue"
                        ></MyCard>
                        <MyCard
                            title="总请求数"
                            value={data?.totals?.requests?.all}
                            type="yellow"
                        ></MyCard>
                    </div>
                </Skeleton>
            </div>
        </div>
    );
};

export default Chart1;
