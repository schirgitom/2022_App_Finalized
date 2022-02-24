import {
    DataSource, ModbusDataPoint,
    ModbusDataSource, MQTTDataPoint,
    MQTTDataSource,
} from '../../types/types';
import React, {useEffect, useState} from 'react';
import {FormDescription, BuildForm, FieldDescriptionType} from '../../services/utils/formbuilder'
import * as Validator from '../../services/utils/validators';
import { RouteComponentProps } from 'react-router';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonPage,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonLabel, IonToast
} from '@ionic/react';
import {
    addModbusDataSource,
    addMQTTDataSource,
    updateModbusDataSource,
    updateMQTTDataSource
} from '../../services/rest/datasource';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { executeDelayed } from '../../services/utils/asynchelper';
import {RootState} from "../../services/reducers";
import {
    DataSourceResult,
    fetchDataSourceAction, fetchDataSourceActions,
} from "../../services/actions/datasource";
import {add, information, water} from "ionicons/icons";
import {DataSourcesResult, fetchDataSourcesAction} from "../../services/actions/datasources";
import {fetchDataPointsForSourceAction} from "../../services/actions/datapoints";



let basefields : Array<FieldDescriptionType<DataSource>> = [
    {
        name: 'name', label: 'Data Source Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
] ;

let mqttfields : Array<FieldDescriptionType<MQTTDataSource>> = [
    {
        name: 'host', label: 'Host Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
    ,
    {
        name: 'port', label: 'Port', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
] ;

let modbusfields : Array<FieldDescriptionType<ModbusDataSource>> = [
    {
        name: 'host', label: 'Host Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
    ,
    {
        name: 'port', label: 'Port', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
    ,
    {
        name: 'slaveID', label: 'Slave ID', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }

] ;

let allmodbusfield : Array<FieldDescriptionType<ModbusDataSource>> =  modbusfields.concat(basefields);
let allmqttfield : Array<FieldDescriptionType<MQTTDataSource>> =  mqttfields.concat(basefields);

let modbusform = (mode: string): FormDescription<ModbusDataSource> => ({
    name: `modbusform_${mode}`,
    fields: allmodbusfield,
    submitLabel: mode === 'add' ? 'Save' : 'Update',
    debug: false
})

let mqttform = (mode: string): FormDescription<MQTTDataSource> => ({
    name: `mqttform_${mode}`,
    fields: allmqttfield,
    submitLabel: mode === 'add' ? 'Save' : 'Update',
    debug: false
})


export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string, source:string }>> => ({ history, match }) => {

    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const {  isLoading, dataSource, errorMessage, dataSourceType, dataSourceAsMqtt, dataSourceAsModbus } = useSelector((s:RootState) => s.datasource);
    const {  dataPointList } = useSelector((s:RootState) => s.datapoint);

    const thunkDispatch: ThunkDispatch<RootState, null, DataSourceResult> = useDispatch();
    const dispatch = useDispatch();

    useEffect(() => {
        if(!dataSource || dataSource.name != match.params.source)
        {
            dispatch(fetchDataSourceAction(match.params.source));
            dispatch(fetchDataPointsForSourceAction(match.params.source));
        }
    })


    let datasourcetype = dataSourceType;


    let { Form, loading, error } = BuildForm(datasourcetype === "MQTTDataSource" ? mqttform(mode) : modbusform(mode));


    const submitModbus = (modbus: ModbusDataSource) => {
        console.log("Handle Submit: " + JSON.stringify(modbus))
        dispatch(loading(true));
        (mode === 'add' ? addModbusDataSource(token, modbus) : updateModbusDataSource(token, modbus))
            .then( source => dispatch(fetchDataSourceActions.success(source)))
            .then(r => thunkDispatch(fetchDataSourcesAction()))
            .then(r => executeDelayed(100, ()=>history.goBack()))
            .catch(err => dispatch(error(err)))
            .finally(() => dispatch(loading(false)))
    }

    const submitMqtt = (mqtt: MQTTDataSource) => {
        console.log("Handle Submit: " + JSON.stringify(mqtt))
        dispatch(loading(true));
         (mode === 'add' ? addMQTTDataSource(token, mqtt) : updateMQTTDataSource(token, mqtt))
              .then( source => dispatch(fetchDataSourceActions.success(source)))
              .then(r => thunkDispatch(fetchDataSourcesAction()))
              .then(r => executeDelayed(100, ()=>history.goBack()))
              .catch(err => dispatch(error(err)))
              .finally(() => dispatch(loading(false)))
    }

    const NoValuesInfo = () => !isLoading && dataPointList!.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No DataPoints found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)

    const ListDataPointsForDriver = () => {

        const items = dataPointList!.map(value => {


            //console.log(value);
            let myinfo;
            if(dataSource!.type == "MQTTDataSource")
            {
                const mqttpoint = value as MQTTDataPoint;

                myinfo = (<IonLabel>Topic: {mqttpoint.topicName}</IonLabel>);
            }
            else
            {
                const modbuspoint = value as ModbusDataPoint;
                myinfo = (
                    <IonLabel>Register Number: {modbuspoint.register} Register Count: {modbuspoint.registerCount}  Register Type: {modbuspoint.registerType} Reading Type: {modbuspoint.readingType}</IonLabel>

                );
            }


            let icon = water;

            return (
                <IonItemSliding key={value.databaseName}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => history.push('/datapoint/'+dataSource!.name+'/' +value.id)}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.databaseName} onClick={() => history.push('/datapoint/'+dataSource!.name+'/' +value.id)}>
                        <IonIcon icon={icon} />
                        {value.name}
                        <div className="item-note" slot="end">
                            {myinfo}
                        </div>
                    </IonItem>
                </IonItemSliding>
            );
        });
        return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo />;
    };


    const MQTTFormInfo= () => {

        let { Form, loading, error } = BuildForm<MQTTDataSource>(mqttform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataSource) {
                return <Form handleSubmit={submitMqtt} initialState={dataSourceAsMqtt!}/>
            }
            else
            {
                return <Form handleSubmit={submitMqtt} />
            }
        }
        else
        {
            console.log("Empty");
            return <></>
        }
    };

    const ModbusFormInfo = () => {
        let { Form, loading, error } = BuildForm<ModbusDataSource>(modbusform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataSource) {
                return <Form handleSubmit={submitModbus} initialState={dataSourceAsModbus!}/>
            }
            else
            {
                return <Form handleSubmit={submitModbus} />
            }
        }
        else
        {
            console.log("Empty");
            return (<></>)
        }
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                     <IonBackButton defaultHref='/datapoints' />

                     </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/datapoint/'+dataSource!.name+'/add')}>
                            <IonIcon slot="icon-only" icon={add}/>
                        </IonButton>
                    </IonButtons>
        <IonTitle>{mode === 'add' ? 'New' : 'Edit'} Datasource {dataSource ? dataSource.name : ""}</IonTitle>

    </IonToolbar>
    </IonHeader>
    <IonContent>
        {isLoading ? <IonItem><IonSpinner />Loading Data Source...</IonItem> :
            datasourcetype === "MQTTDataSource"  ? <MQTTFormInfo/> : <ModbusFormInfo/>
        }
        <IonCardHeader><IonLabel><h2><b>Data Points</b></h2></IonLabel></IonCardHeader>
        {isLoading ? <IonItem><IonSpinner />Loading Datapoints...</IonItem> : <ListDataPointsForDriver />}
        <IonToast
            isOpen={errorMessage ? errorMessage.length > 0 : false}
            onDidDismiss={() => false}
            message={errorMessage}
            duration={5000}
            color='danger'
        />

    </IonContent>
    </IonPage>
)

}
