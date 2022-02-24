import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import {DataPoint, ModbusDataPoint, MQTTDataPoint} from "../../types/types";
import {fetchDataPointActions, fetchDataPointsActions, resetDataPointAppState} from "../actions/datapoints";

const initialState : DataPointState = {
    isLoading: false,
    dataPoint : { name : "", databaseName : "", dataType: "Float", description : "", dataSource : "", offset: 0, id:""} ,
    dataPointList : [],
    errorMessage: '',
    dataPointAsModbus : null,
    dataPointAsMQTT : null
}




export interface DataPointState {
    isLoading: boolean;
    dataPoint: DataPoint;
    dataPointList: DataPoint[] | null;
    errorMessage: string;
    dataPointAsModbus : ModbusDataPoint | null;
    dataPointAsMQTT : MQTTDataPoint | null;
}



export const datapoint = createReducer<DataPointState, AnyAction>(initialState)
    .handleAction(fetchDataPointActions.request,  (state, action) =>
        ({ ...state, isLoading: true, datatype:'', errorMessage: '' }))
    .handleAction(fetchDataPointsActions.request,  (state, action) =>
        ({ ...state, isLoading: true, datatype:'', errorMessage: '' }))
    .handleAction(resetDataPointAppState, (state, _) => initialState)
    .handleAction(fetchDataPointActions.failure, (state, action) =>
        ({ ...state, isLoading: false, datatype:'', errorMessage: action.payload.message }))
    .handleAction(fetchDataPointActions.success, (state, action) =>
        ({ ...state, isLoading: false,  datatype:action.payload.dataType, dataPoint: action.payload, dataPointAsMQTT: action.payload as MQTTDataPoint,
            dataPointAsModbus: action.payload as ModbusDataPoint }))
    .handleAction(fetchDataPointsActions.failure, (state, action) =>
        ({ ...state, isLoading: false, datatype:'', errorMessage: action.payload.message }))
    .handleAction(fetchDataPointsActions.success, (state, action) =>
        ({ ...state, isLoading: false, dataPointList : action.payload }))






