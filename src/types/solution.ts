
export type consoleBoxType = "result" | "testcase";

export type outputType = {
    judge: JudgeCode; // 判题结果
    memory: number; // 内存消耗 KB
    time: number; // 时间 ms
    uuid: string;
    output: string; // 返回值
    stdout: string // 用户标准输出
};

export type testdataType = {
    output: string
}

export type resultType = {
    state: "success" | "error" | "";
    result: outputType[];
    error: string;
    testdata: testdataType[]
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
