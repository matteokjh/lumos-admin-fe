export type ModeType = 'Easy' | 'Medium' | 'Hard' | ''
export interface ExeBaseInfo {
    id: number,
    title: string,
    mode: ModeType,
    contributor: string
}

export type opTypeProps = 'new' | 'detail'

export type testCaseType = {
    input: string,
    output: string
}

export const LangArr = <const>['javascript', 'cpp', 'java']

export type LangProps = Partial<typeof LangArr>

export type CodeProps = {
    [key in typeof LangArr[number]]?: string
}

export type ExeProps = ExeBaseInfo & {
    code?: CodeProps,
    introduction?: string,
    createTime: string,
    modifiedTime?: string,
    submitTimes: number,
    passTimes: number,
    testCase: testCaseType[],
    show: boolean,
    lang: LangProps
}