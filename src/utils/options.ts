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
            height: "80%",
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
            height: "80%",
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
            height: "80%",
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
            top: "10%",
            bottom: "5%",
            height: "80%",
        },
        xAxis: [
            {
                type: "category",
                data: getValList(data, "since")?.map((e: Date) =>
                    new Date(e).toLocaleDateString()
                ),
            },
        ],
        yAxis: [
            {
                type: "value",
            },
        ],
        legend: {
            data: ["PV量", "UV量"],
        },
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
// 题目难度分布
export const getExeOption = (data: any) => {
    const arr = getObj(data)?.sort(function (a: any, b: any) {
        return a.value - b.value;
    });
    const total = arr?.reduce((acc: any, cur: any) => acc + cur.value, 0);
    return {
        title: {
            text: `题目总数：${total}`,
            left: "center",
            top: 20,
            textStyle: {
                color: "#333",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        visualMap: {
            show: false,
            min: arr?.[0]?.value - 1,
            max: arr?.[arr.length - 1]?.value + 1,
            inRange: {
                colorLightness: [0, 1],
            },
        },
        series: [
            {
                name: "题目难度分布",
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: arr,
                roseType: "radius",
                label: {
                    color: "#333",
                    fontSize: 16,
                },
                labelLine: {
                    lineStyle: {
                        color: "#333",
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 15,
                },
                itemStyle: {
                    color: "#c23531",
                },
                animationType: "scale",
                animationEasing: "elasticOut",
                animationDelay: function () {
                    return Math.random() * 200;
                },
            },
        ],
    };
};
// 通过率
export const getExeOption2 = (data: any) => {
    const submitTotal = data?.submitTotal || 0;
    const passTotal = data?.passTotal || 0;
    const notPass = submitTotal - passTotal;
    return {
        title: {
            text: `总提交次数：${submitTotal}`,
            left: "center",
            top: 20,
            textStyle: {
                color: "#333",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        visualMap: {
            show: false,
            min: Math.min(passTotal, notPass) - 1,
            max: Math.max(passTotal, notPass) + 1,
            inRange: {
                colorLightness: [0, 1],
            },
        },
        series: [
            {
                name: "提交次数",
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: [
                    {
                        name: "通过次数",
                        value: passTotal,
                    },
                    {
                        name: "失败次数",
                        value: notPass,
                    },
                ],
                label: {
                    color: "#333",
                    fontSize: 16,
                },
                labelLine: {
                    lineStyle: {
                        color: "#333",
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 15,
                },
                itemStyle: {
                    color: "#1890ff",
                },
            },
        ],
    };
};

export const getSolutionOption = (data: any) => {
    const arr = getObj(data).sort(function (a: any, b: any) {
        return a.value - b.value;
    });
    return {
        title: {
            text: "准确率",
            left: "center",
            top: 20,
            textStyle: {
                color: "#333",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        visualMap: {
            show: false,
            min: arr[0]?.value - 1,
            max: arr[arr.length - 1]?.value + 1,
            inRange: {
                colorLightness: [0, 1],
            },
        },
        series: [
            {
                name: "准确率",
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: arr,
                roseType: "radius",
                label: {
                    color: "#333",
                },
                labelLine: {
                    lineStyle: {
                        color: "#333",
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 15,
                },
                itemStyle: {
                    color: "#c23531",
                },
                animationType: "scale",
                animationEasing: "elasticOut",
                animationDelay: function () {
                    return Math.random() * 200;
                },
            },
        ],
    };
};
// 用户统计
export const getUserOption = (data: any) => {
    return {};
};

// 辅助函数，递归获取属性值
const getVal = (obj: any, keys: string[]): any => {
    return keys.length > 1 ? getVal(obj[keys[0]], keys.slice(1)) : obj[keys[0]];
};
// 获取对象数组的某值集合
const getValList = (data: any, ...keys: string[]) => {
    return data?.map((e: any) => getVal(e, keys));
};

// 获取对象
const getObj = (data: any) => {
    return data?.map((e: any) => {
        return {
            name: e._id,
            value: e.count,
        };
    });
};
