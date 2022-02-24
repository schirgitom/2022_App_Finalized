import {DataPoint, DataSource, DataSourceList} from "../../types/types";
import { createAction, createAsyncAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchDataSource, fetchDataSources} from "../rest/datasource";



export const fetchDataSourcesActions = createAsyncAction(
    'FETCH_DATASOURCES_REQUEST',
    'FETCH_DATASOURCES_SUCCESS',
    'FETCH_DATASOURCES_FAILURE')<void, DataSourceList, Error>();


export const resetDataSourcesAppState = createAction('datasources/reset')<void>();

export type DataSourcesResult = ReturnType<typeof fetchDataSourcesActions.success> | ReturnType<typeof fetchDataSourcesActions.failure>

export const fetchDataSourcesAction = ():ThunkAction<Promise<DataSourcesResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchDataSourcesActions.request());
        return fetchDataSources(getState().user.authentication!.token || '')
            .then(
                Value =>dispatch(fetchDataSourcesActions.success(Value))
            )
            .catch(
                err => dispatch(fetchDataSourcesActions.failure(err))
            )
    };

