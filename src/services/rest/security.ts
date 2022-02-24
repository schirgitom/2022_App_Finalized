import {
    LoginData,
    User,
    AuthenticationInformation,
    AuthenticationResponse,
    DataPoint,
    DataPointList, ErrorMessage, UserList
} from '../../types/types';
import config from '../server-config';
import axios from 'axios';
import { Storage } from '@capacitor/storage';

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});



const timeout = 5000;



export const login = (loginData: LoginData) =>
    endpoint.post<AuthenticationResponse>('User/Login', loginData, {timeout})
        .then(
            ({data: {authentication, user}}) => {
                return Promise.all([
                    user,
                    authentication,
                    Storage.set({key: 'user', value: JSON.stringify(( user && typeof user === 'object') ? user : {})}),
                    Storage.set({key: 'authentication', value: JSON.stringify(( authentication && typeof authentication === 'object') ? authentication : {})}),
                ])}
        ).then(([user, authentication, ...others]) => ({user, authentication}) )


export const isNotExpired = (token: AuthenticationInformation | null | undefined) => {
    if (!token || token.token == "")
    {
        return false;
    }
    const dec = token.expirationDate;
    const future =new Date(dec*1000);
    const now = new Date();
    if(future > now)
    {
        return true;
    }
    else
    {
        console.log("Token is null or expired");
        return false;
    }

}

export const loadUserData = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'authentication'})])
    .then(([user, authentication]) => ({ user: user.value ? JSON.parse(user.value): null , authentication: authentication.value ? JSON.parse(authentication.value): null }))

export const clearUserData = () => Promise.all([Storage.remove({key: 'user'}), Storage.remove({key: 'authentication'})])

export const getUserInfo = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'authentication'})])
    .then(([user, authentication]) => {
        if (user.value && authentication.value)
            return {user: JSON.parse(user.value), authentication:  JSON.parse(authentication.value)}
        else throw new Error('Not logged in!')
    })

export const createAuthenticationHeader = (token: string | null) => ({'Authorization': `Bearer ${token}`});


export const fetchUser = (token: string | null, name : string) =>
    endpoint.get<User | ErrorMessage>(`${config.getUserURI}GetUser?id=${name}`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as User;
            console.log(returnval);
            return returnval;
        })

export const fetchUsers = (token: string | null) =>
    endpoint.get<UserList | ErrorMessage>(`${config.getUserURI}ListUsers`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as UserList;
            console.log(returnval);
            return returnval;
        })


export const register = (user:User, token: string | null) =>
    endpoint.post<User, User>('/User/CreateUser', user, {headers: createAuthenticationHeader(token)})
