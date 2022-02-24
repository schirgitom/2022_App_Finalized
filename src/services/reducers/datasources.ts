import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import {DataSourceList} from "../../types/types";
import {fetchDataSourcesActions, resetDataSourcesAppState} from "../actions/datasources";


const initialState : DataSourceState = {
    isLoading: false,
    dataSources : null ,
    errorMessage: '',
}


export interface DataSourceState {
    isLoading: boolean;
    dataSources: DataSourceList | null;
    errorMessage: string;
}

export const datasources = createReducer<DataSourceState, AnyAction>(initialState)
    .handleAction(fetchDataSourcesActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(resetDataSourcesAppState, (state, _) => initialState)
    .handleAction(fetchDataSourcesActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))
    .handleAction(fetchDataSourcesActions.success, (state, action) =>
        ({ ...state, isLoading: false, dataSources: action.payload }));






