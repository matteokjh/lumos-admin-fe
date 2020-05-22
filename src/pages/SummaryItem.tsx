import React, { ReactDOM } from "react";
import ReactEcharts from "echarts-for-react";
import "@/styles/SummaryItem.sass";

interface ItemProps {
    title?: string;
    value?: number;
    option?: any;
    bottom?: ReactDOM;
    toolTip?: ReactDOM;
    refProps: any
}

const SummaryItem = (props: ItemProps) => {
    const { title, value, option, bottom, toolTip, refProps } = props;

    return (
        <div className="SummaryItem">
            <div className="title">
                <span>
                    {title || "标题"}
                    {toolTip}
                </span>
                <span className="value">{value || 0}</span>
            </div>
            <div className="chart">
                <ReactEcharts style={{
                    height: "100%"
                }} option={option} ref={refProps}></ReactEcharts>
            </div>
            <div className="bottom">{bottom}</div>
        </div>
    );
};

export default SummaryItem;
