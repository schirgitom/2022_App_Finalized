import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import { Value} from "../../types/types";
import {fetchValueActions, resetValueAppState} from "../actions/value";

const initialState : ValueState = {
    isLoading: false,
    value : {visuals: null, sample : { value : "", tag : '', timeSamp : new Date() }, dataPoint : { id: "", offset: 0, name : "",  databaseName : "", dataSource : "", dataType: "Float", description : ""} },
    errorMessage: '',
    datatype: ''
}




export interface ValueState {
    isLoading: boolean;
    datatype: string;
    value: Value;
    errorMessage: string;
}

export const value = createReducer<ValueState, AnyAction>(initialState)
    .handleAction(fetchValueActions.request,  (state, action) =>
        ({ ...state, isLoading: true, datatype:'', errorMessage: '' }))
    .handleAction(resetValueAppState, (state, _) => initialState)
    .handleAction(fetchValueActions.failure, (state, action) =>
        ({ ...state, isLoading: false, datatype:'', errorMessage: action.payload.message }))
    .handleAction(fetchValueActions.success, (state, action) =>
        ({ ...state, isLoading: false, value: action.payload, datatype:action.payload.dataPoint.dataType }))







