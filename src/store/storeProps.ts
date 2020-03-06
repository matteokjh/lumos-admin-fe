import { UserProps } from "@/types/user";
import { ExeProps, opTypeProps } from "@/types/exercise";

export interface stateProps {
    userInfo: UserProps;
    exerciseInfo: ExeProps;
}

export interface contextProps {
    state: stateProps;
    dispatch: React.Dispatch<any>;
}

export interface setUserAction {
    type: "SET_USER";
    payload: UserProps;
}
export interface setExerciseAction {
    type: "SET_EXERCISE";
    payload: ExeProps;
}
export interface setOpTypeAction {
    type: "SET_OPTYPE";
    payload: opTypeProps;
}

export type actionProps = setUserAction | setExerciseAction | setOpTypeAction;

export type Reducer<S, A> = (prevState: S, action: A) => S;
