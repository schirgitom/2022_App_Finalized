import { createAuthenticationHeader } from './security'
import axios, {AxiosResponse} from 'axios';
import config from '../server-config'
import { Value, ValueList } from '../../types/types';
import { executeDelayed } from '../utils/asynchelper';
import serverConfig from '../server-config';


interface ErrorMessage {
    message: string;
}

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});

const process = <T = any>(r:AxiosResponse<T|ErrorMessage>) => {
    if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
    }
    return r.data as T;
}

export const fetchValues = (token: string) =>
    endpoint.get<ValueList | ErrorMessage>(`${config.getValuesControllerURI}GetLastValues`, { headers: createAuthenticationHeader(token) })
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as ValueList;
        })

export const fetchValue = (token: string | null, name : string) =>
    endpoint.get<Value | ErrorMessage>(`${config.getValuesControllerURI}GetLastValue?datapoint=${name}`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as Value;
            console.log(returnval);
            return returnval;
        })