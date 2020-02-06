import { ModeType } from "../types/exercise"

export const COLOR = {
    EASY_MODE: '#4caf50',
    MEDIUM_MODE: '#ff9800',
    HARD_MODE: '#f44336',
    DEFAULT: '#333'
}

export const MODE = {
    'Hard': '困难',
    'Medium': '中等',
    'Easy': '简单',
    '': '未知',
}

// 三个难度的题目，中文 以及 颜色
export const TRANSFER_MODE = (mode: ModeType) => {
    switch(mode) {
        case 'Easy': return [MODE[mode], COLOR.EASY_MODE]
        case 'Medium': return [MODE[mode], COLOR.MEDIUM_MODE]
        case 'Hard': return [MODE[mode], COLOR.HARD_MODE]
        default: return [MODE[mode], COLOR.DEFAULT]
    }
}