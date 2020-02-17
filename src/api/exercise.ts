import fetch from "./index";
import { opTypeProps, ExeProps, ExecOpType, LangArr } from "../types/exercise";

const PREFIX = "admin/exercise";

export const saveExercise = (obj: {
    data: Partial<ExeProps>;
    type: opTypeProps;
}) => {
    return fetch.post(`${PREFIX}/saveExercise`, {
        data: obj.data,
        type: obj.type
    });
};

export const getList = () => {
    return fetch.get(`${PREFIX}/getList`);
};

export const exerciseShow = (id: number, show: boolean) => {
    return fetch.put(`${PREFIX}/exerciseShow`, {
        id,
        show
    });
};

export const getExeInfo = (id: number) => {
    return fetch.get(`${PREFIX}/get`, {
        params: {
            id: id
        }
    });
};

// 运行代码
export const execute = (obj: {
    opType: ExecOpType;
    username: string;
    exerciseId: number;
    lang: typeof LangArr[number];
    code: string;
}) => {
    return fetch.post(`${PREFIX}/execute`, obj);
};
