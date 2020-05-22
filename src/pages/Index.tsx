import React, { useEffect, useState, useRef } from "react";
import SummaryItem from "./SummaryItem";
import { getMockData, throttle } from "@/utils/methods";
import { getArticleSummaryOption, getSolutionSummaryOption, getUserSummaryOption } from '@/utils/options'
import "@/styles/Index.sass";

const Index = () => {
    const [data, setData] = useState({} as any);
    const refA = useRef(null as any)
    const refB = useRef(null as any)
    const refC = useRef(null as any)

    // methods
    const handleResize = () => {
        refA.current.getEchartsInstance().resize()
    }

    useEffect(() => {
        setData(getMockData());
        const Fn = throttle(handleResize)
        window.addEventListener("resize", Fn)
        return () => {
            window.removeEventListener("resize", Fn)
        }
    }, []);

    return (
        <div className="Index" id="Statistics">
            <SummaryItem
                title="文章总数"
                value={data.articleSummary?.total}
                option={getArticleSummaryOption(data.articleSummary?.chartData)}
                refProps={refA}
            ></SummaryItem>
            <SummaryItem
                title="提交次数"
                value={data.solutionSummary?.total}
                option={getSolutionSummaryOption(data.solutionSummary?.chartData)}
                refProps={refB}
            ></SummaryItem>
            <SummaryItem
                title="用户总数"
                value={data.userSummary?.total}
                option={getUserSummaryOption(data.userSummary?.chartData)}
                refProps={refC}
            ></SummaryItem>
            <div className="chart1">charts</div>
        </div>
    );
};

export default Index;
