import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import { Value, ValueList} from "../../types/types";
import { fetchValuesActions} from "../actions/values";

const initialState : ValuesState = {
    isLoading: false,
    values : [],
    errorMessage: '',

}


export interface ValuesState {
    isLoading: boolean;
    values: ValueList;
    errorMessage: string;
}

export const values = createReducer<ValuesState, AnyAction>(initialState)
    .handleAction(fetchValuesActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(fetchValuesActions.success, (state, action) =>
        ({ ...state, isLoading: false, values: action.payload }))
    .handleAction(fetchValuesActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }));






