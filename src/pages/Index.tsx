import React, { useEffect, useState, useRef } from "react";
import SummaryItem from "./SummaryItem";
import { getMockData, throttle } from "@/utils/methods";
import {
    getArticleSummaryOption,
    getSolutionSummaryOption,
    getUserSummaryOption,
} from "@/utils/options";
import "@/styles/Index.sass";
import Chart1 from "./Charts/Chart1";
import Chart2 from "./Charts/Chart2";
import Chart3 from "./Charts/Chart3";
import Chart4 from "./Charts/Chart4";

const Index = () => {
    const [data, setData] = useState({} as any);
    const refA = useRef(null as any);
    const refB = useRef(null as any);
    const refC = useRef(null as any);
    const ref1 = useRef(null as any);
    const ref2 = useRef(null as any);
    const ref2_2 = useRef(null as any);
    const ref4 = useRef(null as any);

    // methods
    const handleResize = () => {
        refA.current?.getEchartsInstance().resize();
        refB.current?.getEchartsInstance().resize();
        refC.current?.getEchartsInstance().resize();
        ref1.current?.getEchartsInstance().resize();
        ref2.current?.getEchartsInstance().resize();
        ref2_2.current?.getEchartsInstance().resize();
        ref4.current?.getEchartsInstance().resize();
    };

    useEffect(() => {
        setData(getMockData());
        const Fn = throttle(handleResize);
        window.addEventListener("resize", Fn);
        return () => {
            window.removeEventListener("resize", Fn);
        };
    }, []);

    return (
        <div className="Index" id="Statistics">
            <SummaryItem
                title="文章总数"
                data={data.articleSummary}
                option={getArticleSummaryOption(data.articleSummary?.chartData)}
                refProps={refA}
            ></SummaryItem>
            <SummaryItem
                title="提交次数"
                data={data.solutionSummary}
                option={getSolutionSummaryOption(
                    data.solutionSummary?.chartData
                )}
                refProps={refB}
            ></SummaryItem>
            <SummaryItem
                title="用户总数"
                data={data.userSummary}
                option={getUserSummaryOption(data.userSummary?.chartData)}
                refProps={refC}
            ></SummaryItem>
            {/* 访问量统计 */}
            <Chart1
                refProps={ref1}
            ></Chart1>
            {/* 题目统计 */}
            <Chart2
                refProps={ref2}
                ref2Props={ref2_2}
            ></Chart2>
            {/* 提交排行 */}
            <Chart3></Chart3>
            {/* 用户统计 */}
            <Chart4 refProps={ref4}></Chart4>
        </div>
    );
};

export default Index;
