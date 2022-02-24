import {DataSource} from "../../types/types";
import { createAction, createAsyncAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchDataSource} from "../rest/datasource";




export const fetchDataSourceActions = createAsyncAction(
    'FETCH_DATASOURCE_REQUEST',
    'FETCH_DATASOURCE_SUCCESS',
    'FETCH_DATASOURCE_FAILURE')<void, DataSource, Error>();

export const resetDataSourceAppState = createAction('datasources/reset')<void>();

export type DataSourceResult = ReturnType<typeof fetchDataSourceActions.success> | ReturnType<typeof fetchDataSourceActions.failure>



export const fetchDataSourceAction = (name : string):ThunkAction<Promise<DataSourceResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchDataSourceActions.request());
        return fetchDataSource(getState().user.authentication!.token || '', name)
            .then(
                Value =>dispatch(fetchDataSourceActions.success(Value))
            )
            .catch(
                err => dispatch(fetchDataSourceActions.failure(err))
            )
    };







