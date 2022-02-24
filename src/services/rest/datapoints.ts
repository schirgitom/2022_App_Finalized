import { createAuthenticationHeader } from './security'
import axios, {AxiosResponse} from 'axios';
import config from '../server-config'
import {
    DataPoint, DataPointList,
    DataSource,
    DataSourceList, ModbusDataPoint,
    ModbusDataSource, MQTTDataPoint,
} from '../../types/types';


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


export const fetchDataPoint = (token: string | null, name : string) =>
    endpoint.get<DataPoint | ErrorMessage>(`${config.getDataPointControllerURI}GetDataPoint?datapoint=${name}`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as DataPoint;
            console.log(returnval);
            return returnval;
        })

export const fetchDataPoints = (token: string | null, source : string) =>
    endpoint.get<DataPointList | ErrorMessage>(`${config.getDataPointControllerURI}GetDataPoints?datasource=${source}`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as DataPointList;
            console.log(returnval);
            return returnval;
        })


export const addMQTTDataPoint = (token: string, datasource: string, datapoint : MQTTDataPoint) =>
    endpoint.post<MQTTDataPoint | ErrorMessage>(`${config.getDataPointControllerURI}AddMQTTDataPoint?datasource=${datasource}`, datapoint, {headers: createAuthenticationHeader(token)})
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const {message} = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as MQTTDataPoint;
        });

export const addModbusDataPoint = (token: string, datasource: string, datapoint : ModbusDataPoint) =>
    endpoint.post<ModbusDataPoint | ErrorMessage>(`${config.getDataPointControllerURI}AddModbusDataPoint?datasource=${datasource}`, datapoint, {headers: createAuthenticationHeader(token)})
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const {message} = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as ModbusDataPoint;
        });


export const updateModbusDataPoint = (token: string | null, id : string, datapoint : ModbusDataPoint) =>
    endpoint.patch<ModbusDataPoint | ErrorMessage>(`${config.getDataPointControllerURI}UpdateModbusDataPoint?id=${id}`, datapoint,{ headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as ModbusDataPoint;
            console.log(returnval);
            return returnval;
        });

export const updateMQTTDataPoint = (token: string | null, id : string, datapoint : MQTTDataPoint) =>
    endpoint.patch<MQTTDataPoint | ErrorMessage>(`${config.getDataPointControllerURI}UpdateMQTTDataPoint?id=${id}`, datapoint,{ headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as MQTTDataPoint;
            console.log(returnval);
            return returnval;
        });

