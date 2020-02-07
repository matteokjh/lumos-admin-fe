import fetch from "./index";
import { opTypeProps, ExeProps } from "../types/exercise";

const PREFIX = "admin/exercise";

export const saveExercise = <K extends keyof ExeProps>(obj: {
    data: {
        [key in K]: ExeProps[K];
    };
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
