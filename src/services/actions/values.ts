import {Value, ValueList} from "../../types/types";
import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchValues} from "../rest/values";


export const fetchValuesActions = createAsyncAction(
    'FETCH_VALUES_REQUEST',
    'FETCH_VALUES_SUCCESS',
    'FETCH_VALUES_FAILURE')<void, ValueList, Error>();

export type ValuesResult = ReturnType<typeof fetchValuesActions.success> | ReturnType<typeof fetchValuesActions.failure>

export const fetchValuesAction = ():ThunkAction<Promise<ValuesResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchValuesActions.request());
        return fetchValues(getState().user.authentication!.token || '')
            .then(
                values =>dispatch(fetchValuesActions.success(values))
            )
            .catch(
                err => dispatch(fetchValuesActions.failure(err))
            )
    };



