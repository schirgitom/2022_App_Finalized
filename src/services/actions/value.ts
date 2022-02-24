import {Value, ValueList} from "../../types/types";
import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchValue, fetchValues} from "../rest/values";


export const fetchValueActions = createAsyncAction(
    'FETCH_VALUE_REQUEST',
    'FETCH_VALUE_SUCCESS',
    'FETCH_VALUE_FAILURE')<void, Value, Error>();

export const resetValueAppState = createAction('value/reset')<void>();

export type ValueResult = ReturnType<typeof fetchValueActions.success> | ReturnType<typeof fetchValueActions.failure>



export const fetchValueAction = (id: string):ThunkAction<Promise<ValueResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchValueActions.request());
        return fetchValue(getState().user.authentication!.token || '',id)
            .then(
                Value =>dispatch(fetchValueActions.success(Value))
            )
            .catch(
                err => dispatch(fetchValueActions.failure(err))
            )
    };

