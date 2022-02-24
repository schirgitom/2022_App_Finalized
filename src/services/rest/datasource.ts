import { createAuthenticationHeader } from './security'
import axios, {AxiosResponse} from 'axios';
import config from '../server-config'
import {
    DataSource,
    DataSourceList,
    ModbusDataSource,
    MQTTDataSource,
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


export const fetchDataSources = (token: string | null) =>
    endpoint.get<DataSourceList | ErrorMessage>(`${config.getDataSourceControllerURI}GetDataSources`, { headers: createAuthenticationHeader(token) })
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as DataSourceList;
            console.log(returnval);
            return returnval;
        })

export const fetchDataSource = (token: string | null, name: string) =>
    endpoint.get<DataSource | ErrorMessage>(`${config.getDataSourceControllerURI}GetDataSource?datasource=${name}`, { headers: createAuthenticationHeader(token) })
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as DataSource;
            //console.log(returnval);
            return returnval;
        });



export const updateModbusDataSource = (token: string | null,dataSource: ModbusDataSource) =>
    endpoint.patch<ModbusDataSource | ErrorMessage>(`${config.getDataSourceControllerURI}UpdateModbusDataSource?id=${dataSource.id}`, dataSource, { headers: createAuthenticationHeader(token) })
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as ModbusDataSource;
        })

export const updateMQTTDataSource = (token: string | null,dataSource: MQTTDataSource) =>
    endpoint.patch<MQTTDataSource | ErrorMessage>(`${config.getDataSourceControllerURI}UpdateMqttDataSource?id=${dataSource.id}`, dataSource, { headers: createAuthenticationHeader(token) })

        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as MQTTDataSource;
        });


export const addModbusDataSource = (token: string | null,dataSource: ModbusDataSource) =>
    endpoint.post<ModbusDataSource | ErrorMessage>(`${config.getDataSourceControllerURI}AddModbusDataSource`, dataSource, { headers: createAuthenticationHeader(token) })

        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as ModbusDataSource;
        })

export const addMQTTDataSource = (token: string | null,dataSource: MQTTDataSource) =>
    endpoint.post<MQTTDataSource | ErrorMessage>(`${config.getDataSourceControllerURI}AddMqttDataSource`, dataSource, { headers: createAuthenticationHeader(token) })

        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as MQTTDataSource;
        });