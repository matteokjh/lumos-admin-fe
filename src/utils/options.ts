// 文章总数
export const getArticleSummaryOption = (data: any) => {
    return {
        color: ["rgb(58,161,255)"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            left: "0%",
            right: "0%",
            top: "5%",
            height: "100%",
        },
        xAxis: [
            {
                type: "category",
                data: getValList(data, "date"),
                show: false,
            },
        ],
        yAxis: [
            {
                type: "value",
                show: false,
            },
        ],
        series: [
            {
                name: "文章数",
                type: "bar",
                barWidth: "60%",
                data: getValList(data, "value"),
            },
        ],
    };
};
// 提交次数
export const getSolutionSummaryOption = (data: any) => {
    return {
        color: ["rgb(151,95,228)"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            left: "0%",
            right: "0%",
            top: "5%",
            height: "100%",
        },
        xAxis: [
            {
                type: "category",
                data: getValList(data, "date"),
                show: false,
            },
        ],
        yAxis: [
            {
                type: "value",
                show: false,
            },
        ],
        series: [
            {
                name: "提交次数",
                type: "line",
                smooth: true,
                areaStyle: {},
                barWidth: "60%",
                data: getValList(data, "value"),
            },
        ],
    };
};
// 用户总数
export const getUserSummaryOption = (data: any) => {
    return {
        color: ["rgb(19,194,194)"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            left: "0%",
            right: "0%",
            top: "0%",
            bottom: "0%",
            height: "100%",
        },
        xAxis: [
            {
                type: "category",
                data: getValList(data, "date"),
                show: false,
            },
        ],
        yAxis: [
            {
                type: "value",
                show: false,
            },
        ],
        series: [
            {
                name: "用户数",
                type: "line",
                barWidth: "60%",
                data: getValList(data, "value"),
            },
        ],
    };
};
// 文章统计
export const getUVOption = (data: any) => {
    return {
        color: ["rgb(19,194,194)", "rgb(58,161,255)"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            left: "5%",
            right: "0%",
            top: "5%",
            bottom: "5%",
            height: "85%",
        },
        xAxis: [
            {
                type: "category",
                data: getValList(data, "since")?.map((e: Date) => new Date(e).toLocaleDateString()),
            },
        ],
        yAxis: [
            {
                type: "value",
            },
        ],
        series: [
            {
                name: "PV量",
                type: "line",
                data: getValList(data, "pageviews", "all"),
            },
            {
                name: "UV量",
                type: "line",
                data: getValList(data, "uniques", "all"),
            },
        ],
    };
};
// 题目统计
export const getExeOption = (data: any) => {
    return {};
};
// 用户统计
export const getUserOption = (data: any) => {
    return {};
};

const getVal = (obj: any, keys: string[]): any => {
    return keys.length > 1 ? getVal(obj[keys[0]], keys.slice(1)) : obj[keys[0]];
};
const getValList = (data: any, ...keys: string[]) => {
    return data?.map((e: any) => getVal(e, keys));
};
