import { createAuthenticationHeader } from './security'
import axios, {AxiosResponse} from 'axios';
import config from '../server-config'
import {
    AlarmListEntries, AlarmListEntry,
    DataPoint, DataPointList,
    DataSource,
    DataSourceList, ModbusDataPoint,
    ModbusDataSource, MQTTDataPoint,
    MQTTDataSource,
    Value,
    ValueList
} from '../../types/types';
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

function GetUrl(filter : string)
{

    let url = "GetAllAlarms";

    if(filter == "Unacknowledged")
    {
        url = "GetUnacknowledgedAlarmList";
    }
    else if(filter == "Active")
    {
        url = "GetActiveAlarmList";
    }
    else if(filter == "Deactive")
    {
        url = "GetDeactiveAlarmList";
    }

    return url;
}

export const fetchAlarmListEntries = (token: string | null, filter : string) =>

    endpoint.get<AlarmListEntries | ErrorMessage>(`${config.getAlarmListControllerURI}`+GetUrl(filter), {headers: createAuthenticationHeader(token)})
        .then(r => {
            if (r.status >= 300) {
                const {message} = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as AlarmListEntries;
            console.log(returnval);
            return returnval;
        });


export const fetchAlarmListEntry = (token: string | null, id : string) =>

    endpoint.get<AlarmListEntry | ErrorMessage>(`${config.getAlarmListControllerURI}GetAlarm?id=`+id, {headers: createAuthenticationHeader(token)})
        .then(r => {
            if (r.status >= 300) {
                const {message} = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as AlarmListEntry;
            console.log(returnval);
            return returnval;
        });


export const AcknowledgeEntry = (token: string | null, id : string, data : string |'') =>

    endpoint.patch<AlarmListEntry | ErrorMessage>(`${config.getAlarmListControllerURI}AcknowledgeAlarm?AlarmID=`+id,"", {headers: createAuthenticationHeader(token)})
        .then(r => {
            if (r.status >= 300) {
                const {message} = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            var returnval = r.data as AlarmListEntry;
            console.log(returnval);
            return returnval;
        });