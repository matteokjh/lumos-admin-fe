import React, { ReactDOM } from "react";
import ReactEcharts from "echarts-for-react";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import "@/styles/SummaryItem.sass";

interface ItemProps {
    title?: string;
    data?: any;
    option?: any;
    toolTip?: ReactDOM;
    refProps: any;
}

const getDayComp = (arr: any) => {
    if (arr?.length) {
        console.log(arr)
        let todayVal = arr[arr.length - 1]?.value || 0;
        let yesterdayVal = arr[arr.length - 2]?.value || 0;
        let delta = todayVal - yesterdayVal;
        let state = 0;
        if (delta > 0) state = 1;
        if (delta < 0) state = -1;

        return (
            <span
                style={{
                    marginLeft: 15,
                }}
            >
                {yesterdayVal ? Math.round(Math.abs(delta) / yesterdayVal * 100): 0}%
                {(state === 1 && (
                    <CaretUpOutlined
                        style={{
                            color: "green",
                            marginLeft: 3
                        }}
                    />
                )) ||
                    (state === -1 && (
                        <CaretDownOutlined
                            style={{
                                color: "red",
                                marginLeft: 3
                            }}
                        />
                    ))}
            </span>
        );
    }
};

const SummaryItem = (props: ItemProps) => {
    const { title, data, option, toolTip, refProps } = props;

    return (
        <div className="SummaryItem">
            <div className="title">
                <span>
                    {title || "标题"}
                    {toolTip}
                </span>
                <span className="value">{data?.total || 0}</span>
            </div>
            <div className="chart">
                <ReactEcharts
                    style={{
                        height: "100%",
                    }}
                    option={option}
                    ref={refProps}
                ></ReactEcharts>
            </div>
            <div className="bottom">
                <span>同比{getDayComp(data?.chartData)}</span>
            </div>
        </div>
    );
};

export default SummaryItem;
