import { ModeType, LangArr } from "@/types/exercise";

export const COLOR = {
    EASY_MODE: "#4caf50",
    MEDIUM_MODE: "#ff9800",
    HARD_MODE: "#f44336",
    DEFAULT: "#333"
};

export const MODE = {
    Hard: "困难",
    Medium: "中等",
    Easy: "简单",
    "": "未知"
};

// 三个难度的题目，中文 以及 颜色
export const TRANSFER_MODE = (mode: ModeType) => {
    switch (mode) {
        case "Easy":
            return [MODE[mode], COLOR.EASY_MODE];
        case "Medium":
            return [MODE[mode], COLOR.MEDIUM_MODE];
        case "Hard":
            return [MODE[mode], COLOR.HARD_MODE];
        default:
            return [MODE[mode], COLOR.DEFAULT];
    }
};

// 语言集合
export const LANGS = (lang?: typeof LangArr[number]) => {
    switch (lang) {
        case "javascript":
            return {
                val: 4,
                label: "JavaScript"
            };
        case "cpp":
            return {
                val: 2,
                label: "C++"
            };
        case "c":
            return {
                val: 1,
                label: "C"
            };
        case "java":
            return {
                val: 3,
                label: "Java"
            };
        default:
            return {
                val: 0,
                label: "unknown"
            };
    }
};

// 默认标签
export const DEFAULT_TAGS = ["二叉树", "链表", "动态规划", "回溯", "位运算"];

// 权限
export const PERMISSION_GROUP = [0,1,2,3,4,5,6]