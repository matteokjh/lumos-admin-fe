import fetch from './index'
import { ExeBaseInfo, opType } from '../types/exercise'

const PREFIX = 'admin/exercise'

export const saveExercise = (obj: { data: ExeBaseInfo, type: opType }) => {
    return fetch.post(`${PREFIX}/saveExercise`, {
        data: obj.data,
        type: obj.type
    })
}

export const getList = () => {
    return fetch.get(`${PREFIX}/getList`)
}

export const exerciseShow = (id: number, show: boolean) => {
    return fetch.put(`${PREFIX}/exerciseShow`, {
        id,
        show
    })
}

export const getExeInfo = (id: number) => {
    return fetch.get(`${PREFIX}/get`, {
        params: {
            id: id
        }
    })
}