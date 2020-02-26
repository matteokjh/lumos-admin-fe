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
    text?: string;
};

export const LangArr = ['c', 'cpp', 'java', 'javascript'] as const

export type LangProps = Partial<typeof LangArr>;

export type CodeProps = {
    [key in typeof LangArr[number]]?: string;
};

export type ExeProps = ExeBaseInfo & {
    code?: CodeProps;
    answer: CodeProps;
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
};

export type ExecOpType = "testRun" | "submit";
