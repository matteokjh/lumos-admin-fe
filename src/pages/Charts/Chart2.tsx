import React from "react";
import ReactEcharts from "echarts-for-react";
import "./chart.sass";

const Chart2 = (props: any) => {

    const { option, refProps } = props

    return (
        <div className="chart2 chart">
            <h2>题目统计</h2>
            <ReactEcharts
                style={{
                    height: "100%",
                }}
                option={option}
                ref={refProps}
            ></ReactEcharts>
        </div>
    );
};

export default Chart2;
