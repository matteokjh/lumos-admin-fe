import { LangArr } from "./exercise";

export type consoleBoxType = "result" | "testcase";

export type outputType = {
    judge: JudgeCode; // 判题结果
    memory: number; // 内存消耗 KB
    time: number; // 时间 ms
    uuid: string;
    output: string; // 返回值
    stdout: string; // 用户标准输出
};

export type testdataType = {
    output: string;
};

export type JudgeCode =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15;

export const OperatorProps = <const>["system", "user"]

export interface RequestObjProps
    extends Partial<{
        sid: string;
        id: number;
        username: string;
        createAtStart: number;
        createAtEnd: number;
        page: number;
        pageSize: number;
        order?: 'ascend' | 'descend',
        orderBy?: Pick<SolutionProps, keyof SolutionProps>
    }> {}

export interface SearchObjProps
    extends Partial<{
        sid: string;
        id: number;
        username: string;
        createAtStart: number;
        createAtEnd: number;
    }> {}

export interface SortInfoProps {
    order?: 'ascend' | 'descend',
    field?: Pick<SolutionProps, keyof SolutionProps>
    columnKey?: string,
    column?: SolutionProps
}

export interface FilterProps
    extends Partial<{
        operator?: Partial<typeof OperatorProps> | null;
        lang?: Partial<typeof LangArr> | null;
    }> {}

export type StateType = "error" | "pending" | "success";

// 测试数据
export interface TestDataProps {
    uuid: string;
    input: string;
    output: string;
}

export interface SolutionProps {
    sid: string; // uuid
    id: number; // 题目编号
    username: string; // 用户名
    code: string; // 用户提交的代码
    lang: typeof LangArr[number]; // 语言
    testdata: TestDataProps[]; // 测试数据
    createTime: number; // 时间
    result: outputType[]; // 结果
    error: string; // 错误
    state: StateType; // 状态
    timeLimit: number;
    memoryLimit: number;
    judge: JudgeCode // 返回结果，取决于 result
    time: number
    memory: number
}

export const stateArr = <const>['init', 'pending', 'success', 'error']

export type stateProps = typeof stateArr[number]