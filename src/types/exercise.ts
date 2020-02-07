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

export type ExeProps = ExeBaseInfo & {
    code?: string,
    introduction?: string,
    createTime: string,
    modifiedTime?: string,
    submitTimes: number,
    passTimes: number,
    testCase: testCaseType[],
    show: boolean
}