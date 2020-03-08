export type ModeType = "Easy" | "Medium" | "Hard" | "";
export interface ExeBaseInfo {
    id: number;
    title: string;
    mode: ModeType;
    contributor: string;
}

export type opTypeProps = "new" | "detail";

export type testCaseType = {
    input: string;
    output: string;
    show: boolean;
    uuid: string;
    text?: string;
};

export const LangArr = ["c", "cpp", "java", "javascript"] as const;

export type LangProps = Partial<typeof LangArr>;

export type CodeProps = {
    [key in typeof LangArr[number]]?: string;
};

export interface AnswerProps {
    lang: typeof LangArr[number];
    code: string;
}

export type ExeProps = ExeBaseInfo & {
    code?: CodeProps;
    answer: AnswerProps;
    preCode?: CodeProps;
    lastCode?: CodeProps;
    introduction?: string;
    createTime: string;
    modifiedTime?: string;
    submitTimes: number;
    passTimes: number;
    testCase: testCaseType[];
    show: boolean;
    lang: LangProps;
    defaultTestCase?: testCaseType;
    tags: string[];
    timeLimit: number, // 时间限制
    memoryLimit: number, // 内存限制
};

export type ExecOpType = "testRun" | "submit";
