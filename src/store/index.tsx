// store
import React, { createContext, useReducer } from 'react'
import { contextProps } from './storeProps'
import { stateProps } from './storeProps'
import { actionProps, Reducer } from './storeProps'
import { ExeProps, opTypeProps } from '../types/exercise'
import { UserProps } from '../types/user'

const initialContext = {
  state: {
    userInfo: {} as UserProps,
    exerciseInfo: {} as ExeProps,
    opType: '' as opTypeProps
  },
  dispatch: () => {}
} as contextProps

const store = createContext(initialContext)
const { Provider } = store

const reducer: Reducer<stateProps, actionProps> = (state, action) => {
    switch (action.type) {
        // 设置用户信息
        case 'SET_USER':
            return {
                ...state,
                userInfo: action.payload
            }
        // 设置题目信息
        case 'SET_EXERCISE':
            return {
                ...state,
                exerciseInfo: action.payload
            }
        case 'SET_OPTYPE': 
            return {
                ...state,
                opType: action.payload
            }
        default:
            throw new Error()
    }
}

const StateProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialContext.state)

    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
