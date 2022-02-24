import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import {DataSource, ModbusDataSource, MQTTDataSource} from "../../types/types";
import {fetchDataSourceActions, resetDataSourceAppState} from "../actions/datasource";


const initialState : DataSourceState = {
    isLoading: false,
    dataSource : null ,
    dataSourceType : '',
    errorMessage: '',
    dataSourceAsModbus : null,
    dataSourceAsMqtt : null
}


export interface DataSourceState {
    isLoading: boolean;
    dataSource: DataSource | null;
    errorMessage: string;
    dataSourceType : string;
    dataSourceAsModbus : ModbusDataSource | null;
    dataSourceAsMqtt : MQTTDataSource | null;
}

export const datasource = createReducer<DataSourceState, AnyAction>(initialState)
    .handleAction(resetDataSourceAppState, (state, _) => initialState)
    .handleAction(fetchDataSourceActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(fetchDataSourceActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))
    .handleAction(fetchDataSourceActions.success, (state, action) =>
        ({ ...state, isLoading: false, dataSource: action.payload,
           dataSourceType : action.payload.type, dataSourceAsModbus : action.payload as ModbusDataSource, dataSourceAsMqtt : action.payload as MQTTDataSource
        }))






