import {AuthenticationInformation, AuthenticationResponse, DataPoint, User, UserList} from "../../types/types";
import {createAction, createAsyncAction} from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchDataPoint, fetchDataPoints} from "../rest/datapoints";
import {fetchDataPointActions, fetchDataPointsActions} from "./datapoints";
import {fetchUser, fetchUsers} from "../rest/security";

export const loggedIn = createAction('user/loggedIn')<AuthenticationResponse>();
export const loggedOut = createAction('user/loggedOut')<void>();

export const fetchUsersActions = createAsyncAction(
    'FETCH_USERS_REQUEST',
    'FETCH_USERS_SUCCESS',
    'FETCH_USERS_FAILURE')<void, UserList, Error>();

export const fetchUserActions = createAsyncAction(
    'FETCH_USER_REQUEST',
    'FETCH_USER_SUCCESS',
    'FETCH_USER_FAILURE')<void, User, Error>();


export type UserResult = ReturnType<typeof fetchUserActions.success> | ReturnType<typeof fetchUserActions.failure>;
export type UsersResult = ReturnType<typeof fetchUsersActions.success> | ReturnType<typeof fetchUsersActions.failure>;


export const fetchUsersAction = ():ThunkAction<Promise<UsersResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchUsersActions.request());
        return fetchUsers(getState().user.authentication!.token || '')
            .then(
                Value =>dispatch(fetchUsersActions.success(Value))
            )
            .catch(
                err => dispatch(fetchUsersActions.failure(err))
            )
    };



export const fetchUserAction = (id: string):ThunkAction<Promise<UserResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchUserActions.request());
        return fetchUser(getState().user.authentication!.token || '',id)
            .then(
                Value =>dispatch(fetchUserActions.success(Value))
            )
            .catch(
                err => dispatch(fetchUserActions.failure(err))
            )
    };
