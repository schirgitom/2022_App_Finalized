export interface User {
    id?: string;
    userName: string;
    fullName: string;
    firstname: string;
    lastname: string;
    role: string;
    password: string;
    active: boolean;
}

export type UserList = User[]

export interface ErrorMessage {
    message: string;
}

export interface AuthenticationInformation {
    token: string;
    expirationDate: number;
}

export interface AuthenticationResponse {
    authentication: AuthenticationInformation | null;
    user: User | null;
}

export interface LoginData {
    username: string,
    password: string
}

export interface Sample
{
    tag : string;
    timeSamp: Date;
    value: string;
}

export interface Value
{
    sample : Sample;
    dataPoint : DataPoint;
    visuals: Visuals | null;
}

export type ValueList = Value[]

export interface DataPoint
{
    id: string;
    name: string;
    description: string;
    databaseName : string;
    dataType: string;
    dataSource: string;
    offset: number;
}

export interface Visuals
{
    icon : string;
    minValue : number | null;
    maxValue : number | null;
    unit : string | null;
    valueText : string;
    thresholds: Thresholds | null;
    finalText : string | null;
}

export interface Threshold
{
    alarmType : string;
    value : number;
    alarmCheckType: string;
}
export interface Thresholds
{
    Warning: Threshold | null;
    Alarm : Threshold | null;
    Trip: Threshold | null;
}

export interface DataSource
{
    id: string | null;
    name: string;
    active: boolean;
    type : string;
}

export interface MQTTDataSource extends DataSource
{
    host: string;
    port: number;
}

export interface ModbusDataSource extends DataSource
{
    host: string;
    port: number;
    slaveID: number | 0;
}

export type DataSourceList = DataSource[]


export interface MQTTDataPoint extends DataPoint
{
    topicName: string | null;
}


export type DataPointList = DataPoint[]

export interface ModbusDataPoint extends DataPoint
{
    topicName: String;
    registerType: String;
    readingType: String;
    register :  number;
    registerCount:  number;

}


export interface AlarmListEntry
{
    activeDate : Date;
    deactiveDate : Date;
    acknowledgeDate : Date;
    alarmType : string;
    id : string;
    alarmText : string;
    alarmStatus : string;
    acknowledgeStatus : string;
    acknowledgeUser : User | null;
    acknowledgeComment : string | null;

    dataPoint : DataPoint;
    visuals: Visuals | null;
}
export type AlarmListEntries = AlarmListEntry[]

