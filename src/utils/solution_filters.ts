import { JUDGEMAP } from "@/utils/global_config";

// filters
export const filters_operator = [
    {
        text: "系统",
        value: "system"
    },
    {
        text: "用户",
        value: "user"
    }
];
export const filters_lang = [
    {
        text: "C",
        value: "c"
    },
    {
        text: "C++",
        value: "cpp"
    },
    {
        text: "Java",
        value: "java"
    },
    {
        text: "JavaScript",
        value: "javascript"
    },
    {
        text: "未知",
        value: "unknown"
    }
];
export const filters_state = [
    {
        text: "成功",
        value: "success"
    },
    {
        text: "失败",
        value: "error"
    },
    {
        text: "等待中",
        value: "pending"
    }
];
export const filters_judge = [...new Array(16)].map((e, idx) => {
    return {
        value: idx + '',
        text: JUDGEMAP[idx][1]
    };
});

export const filters_optype = [
    {
        text: '测试运行',
        value: 'testRun'
    },
    {
        text: '题目提交',
        value: 'submit'
    },
    {
        text: '竞赛提交',
        value: 'contest'
    }
]