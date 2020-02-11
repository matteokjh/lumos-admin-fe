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

const langArr = <const> ['javascript', 'cpp', 'java']

export type LangProps = Partial<typeof langArr>

export type ExeProps = ExeBaseInfo & {
    code?: {
        [key in typeof langArr[number]]: string
    },
    introduction?: string,
    createTime: string,
    modifiedTime?: string,
    submitTimes: number,
    passTimes: number,
    testCase: testCaseType[],
    show: boolean,
    lang: LangProps
}