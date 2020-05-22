import React, { useEffect, useState } from "react";
import SummaryItem from "./SummaryItem";
import { getMockData } from "@/utils/methods";
import { getArticleSummaryOption, getSolutionSummaryOption, getUserSummaryOption } from '@/utils/options'
import "@/styles/Index.sass";

const Index = () => {
    const [data, setData] = useState({} as any);

    // methods
    useEffect(() => {
        setData(getMockData());
    }, []);

    return (
        <div className="Index" id="Statistics">
            <SummaryItem
                title="文章总数"
                value={data.articleSummary?.total}
                option={getArticleSummaryOption(data.articleSummary?.chartData)}
            ></SummaryItem>
            <SummaryItem
                title="提交次数"
                value={data.solutionSummary?.total}
                option={getSolutionSummaryOption(data.solutionSummary?.chartData)}
            ></SummaryItem>
            <SummaryItem
                title="用户总数"
                value={data.userSummary?.total}
                option={getUserSummaryOption(data.userSummary?.chartData)}
            ></SummaryItem>
            <div className="chart1">charts</div>
        </div>
    );
};

export default Index;
