import { CommentProps, ConvertedCommentProps } from "@/types/comment";
import { JUDGEMAP } from "./global_config";
import { JudgeCode, OperatorProps, stateProps } from "@/types/solution";
import { COLOR } from "./global_config";
import { LangArr, ExecOpType } from "@/types/exercise";

// 防抖
export const debounce = (
    Fn: any,
    delay: number = 300,
    immediate: boolean = false
) => {
    let timeout: any = null;
    return function (this: any, ...args: any) {
        const context = this;

        const lastFn = () => {
            timeout = null;
            Fn.apply(context, args);
        };

        if (immediate && !timeout) Fn.apply(context, args);
        timeout && clearTimeout(timeout);
        timeout = setTimeout(lastFn, delay);
    };
};
// 节流
export const throttle = (
    Fn: any,
    delay: number = 300,
) => {
    let timeout: any = null;
    return function (this: any, ...args: any) {
        const context = this;

        const lastFn = () => {
            timeout && clearTimeout(timeout);
            timeout = null;
            Fn.apply(context, args);
        };

        if(!timeout) timeout = setTimeout(lastFn, delay);
    };
};
// 处理日期
export const formatDate = (time: number) => {
    if (!time) return "";
    return new Date(time).toLocaleDateString();
};
// 处理时间
export const formatTime = (time: number) => {
    let now = new Date().getTime();
    let ds = ~~((now - time) / 1000);
    const aMinute = 60;
    const aHour = 3600;
    const aDay = 86400;
    if (ds < aMinute) {
        return "刚刚";
    } else if (ds < aHour) {
        return `${~~(ds / aMinute)} 分钟前`;
    } else if (ds < aDay) {
        return `${~~(ds / aHour)} 小时前`;
    } else if (ds < aDay * 7) {
        return `${~~(ds / aDay)} 天前`;
    } else return new Date(time).toLocaleDateString();
};
// 处理数字
export const formatNumber = (num?: number) => {
    if (num !== undefined) {
        if (num > 99999999) {
            return `100 M+`;
        } else if (num > 999999) {
            return `${~~(num / 1000000)}M+`;
        } else if (num > 999) {
            return `${~~(num / 1000)}K+`;
        } else return num;
    } else return 0;
};
// 转化评论列表
export const convertComment = (commentList: CommentProps[]) => {
    let list = [] as ConvertedCommentProps[];
    let map = new Map();
    let arr: ConvertedCommentProps[] = commentList;
    // 先把根评论的 id 加入映射
    for (let comment of arr) {
        // 没有父评论的，是根评论
        if (!comment.fatherComment) {
            comment.children = [];
            map.set(comment._id, comment);
        } else {
            // 子评论入栈
            list.push(comment);
        }
    }
    // // 遍历子评论，放在对应父评论的子集
    for (let childComment of list) {
        if (!childComment.fatherComment) continue;
        let fatherId = childComment.fatherComment;
        let father = map.get(fatherId);
        if (father && father.children) {
            father.children.push(childComment);
            map.set(fatherId, father);
        }
    }
    return [...map.values()];
};

// 处理性别
export const formatSex = (s?: "male" | "female" | "") => {
    if (!s) return "未知";
    return s === "male" ? "男" : "女";
};

// 处理网站
export const formatWebsite = (w: string) => {
    return w?.match(/(http|https):\/\//g) ? w : `http://${w}`;
};
// 权限
export const formatPermission = (num: number) => {
    switch (num) {
        case 0:
            return "超级管理员";
        case 1:
            return "高级管理员";
        case 2:
            return "管理员";
        case 3:
            return "普通用户";
        case 4:
            return "普通用户";
        case 5:
            return "普通用户";
        case 6:
            return "违规用户";
    }
};
// 内存 KB => MB
export const formatMemory = (m: number) => {
    return Math.round((m / 1024) * 10) / 10 + "MB";
};
// 代码执行结果
export const formatJudgeResult = (judge: JudgeCode) => {
    if (judge !== undefined) {
        return JUDGEMAP[judge];
    } else return [];
};
// 执行者
export const formatOperator = (val?: typeof OperatorProps[number]) => {
    switch (val) {
        case "system":
            return ["系统", COLOR.GREY];
        case "user":
            return ["用户", COLOR.BLUE];
        default:
            return ["未知", COLOR.DEFAULT];
    }
};
// 语言
export const formatLang = (lang?: typeof LangArr[number]) => {
    switch (lang) {
        case "c":
            return ["C", COLOR.C];
        case "cpp":
            return ["C++", COLOR.CPP];
        case "java":
            return ["Java", COLOR.JAVA];
        case "javascript":
            return ["JavaScript", COLOR.JAVASCRIPT];
        default:
            return ["未知", COLOR.DEFAULT];
    }
};
// 运行状态
export const formatState = (val?: stateProps) => {
    switch (val) {
        case "init":
            return ["初始化", COLOR.INIT];
        case "success":
            return ["成功", COLOR.SUCCESS];
        case "pending":
            return ["等待中", COLOR.PENDING];
        case "error":
            return ["失败", COLOR.ERROR];
        default:
            return ["未知", COLOR.DEFAULT];
    }
};
// 执行类别
export const formatOpType = (val?: ExecOpType) => {
    switch (val) {
        case "testRun":
            return ["测试运行", COLOR.TESTRUN];
        case "contest":
            return ["竞赛提交", COLOR.CONTESTRUN];
        case "submit":
            return ["题目提交", COLOR.SUBMITRUN];
        default:
            return ["未知", COLOR.DEFAULT];
    }
};

// 获取 mock 统计数据
export const getMockData = () => {
    
    return {
        articleSummary: {
            total: getRandomValue(),
            chartData: getRandomValueList(10)
        },
        solutionSummary: {
            total: getRandomValue(),
            chartData: getRandomValueList(10)
        },
        userSummary: {
            total: getRandomValue(),
            chartData: getRandomValueList(10)
        }
    };
};

const getRandomValue = (l: number = 0, r: number = 100) => {
    return ~~(Math.random()*(r-l)) + l
}

const getRandomValueList = (len: number) => {
    const now = new Date()
    const date = now.getDate()
    const res = [...new Array(len)].map((e, idx) => {
        return {
            date: new Date(now.setDate(date-idx)).toLocaleDateString(),
            value: ~~(Math.random()*1000),
        }
    })
    return res.reverse()
}