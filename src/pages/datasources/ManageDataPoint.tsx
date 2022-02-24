import {
        DataPoint,
    DataSource,
    ModbusDataPoint,
    ModbusDataSource,
    MQTTDataPoint,
    MQTTDataSource,
    Visuals
} from '../../types/types';
import React, {useEffect, useState} from 'react';
import {FormDescription, BuildForm, FieldDescriptionType} from '../../services/utils/formbuilder'
import * as Validator from '../../services/utils/validators';
import { RouteComponentProps } from 'react-router';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
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
     addModbusDataPoint, addMQTTDataPoint, updateModbusDataPoint,
    updateMQTTDataPoint,
    } from '../../services/rest/datapoints';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { executeDelayed } from '../../services/utils/asynchelper';
import {RootState} from "../../services/reducers";
import {
    DataSourceResult,
    fetchDataSourceAction, fetchDataSourceActions,
} from "../../services/actions/datasource";
import {information, water} from "ionicons/icons";
import {IconConverter} from "../../services/utils/iconconverter";
import {DataSourcesResult, fetchDataSourcesAction} from "../../services/actions/datasources";
import {DataSourceState} from "../../services/reducers/datasource";
import {
    fetchDataPointAction, fetchDataPointActions,
    fetchDataPointsActions,
    fetchDataPointsForSourceAction
} from "../../services/actions/datapoints";




let basefields : Array<FieldDescriptionType<DataPoint>> = [
{
    name: 'name', label: 'Data Point Name', type: 'text', position: 'floating',
    color: 'primary', validators: [Validator.required, Validator.minLength(4)]
},
{
    name: 'databaseName', label: 'Data Point Database Name', type: 'text', position: 'floating',
    color: 'primary', validators: [Validator.required, Validator.minLength(4)]
}
    ,
    {
        name: 'dataType', label: 'Data Type', type: 'select', position: 'floating',
        color: 'primary', validators: [Validator.required],
        options :
        [
            {key: "Float", value : "Float"},
            {key: "Boolean", value : "Boolean"}
        ]
    }
    ,
    {
        name: 'offset', label: 'Offset', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required]
    }


] ;

let mqttfields : Array<FieldDescriptionType<MQTTDataPoint>> = [
    {
        name: 'topicName', label: 'Topic', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
] ;

let modbusfields : Array<FieldDescriptionType<ModbusDataPoint>> = [

    {
        name: 'register', label: 'Register Number', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
    ,
    {
        name: 'registerCount', label: 'Register Count', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    },
    {
        name: 'registerType', label: 'Register Type', type: 'select', position: 'floating',
        color: 'primary', validators: [Validator.required],
        options :
            [
                {key: "InputRegister", value : "InputRegister"},
                {key: "HoldingRegister", value : "HoldingRegister"},
                {key: "Coil", value : "Coil"},
                {key: "InputStatus", value : "InputStatus"}
            ]
    }
    ,
    {
        name: 'readingType', label: 'Reading Type', type: 'select', position: 'floating',
        color: 'primary', validators: [Validator.required],
        options :
            [
                {key: "LowToHigh", value : "Low To High"},
                {key: "HighToLow", value : "High To Low"}
            ]
    }

] ;



let allmodbusfield : Array<FieldDescriptionType<ModbusDataPoint>> =  modbusfields.concat(basefields);
let allmqttfield : Array<FieldDescriptionType<MQTTDataPoint>> =  mqttfields.concat(basefields);

let mqttform = (mode: string): FormDescription<MQTTDataPoint> => ({
    name: `mqttform_${mode}`,
    fields:  allmqttfield,
    submitLabel: mode === 'add' ? 'Save' : 'Update',
    debug: false
})

let modbusform = (mode: string): FormDescription<ModbusDataPoint> => ({
    name: `modbusform_${mode}`,
    fields:  allmodbusfield,
    submitLabel: mode === 'add' ? 'Save' : 'Update',
    debug: false
})



export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string, source: string}>> => ({ history, match }) => {

   // const { token } = useSelector<AppState, LoginInfo>(state => state.tLogApp.user);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const { dataSource, dataSourceType } = useSelector((s:RootState) => s.datasource);
    const {   isLoading, dataPoint, dataPointAsModbus, dataPointAsMQTT, errorMessage} = useSelector((s:RootState) => s.datapoint);

    const [error, setError] = useState<string>('');

    const thunkDispatch: ThunkDispatch<RootState, null, DataSourceResult> = useDispatch();
    const dispatch = useDispatch();
   // const [availabledatapoints, setAvailableDataPoints] = useState<DataPoint[] | null>([]);

    useEffect(() => {
        if(mode === 'edit') {
            if (!dataPoint || dataPoint.id != match.params.id) {
                console.log("Fetching Updates");
                dispatch(fetchDataPointAction(match.params.id));
            }
        }
    })

    const datasourcename = match.params.source;

    let datasourcetype = dataSourceType;


    const submitModbus = (modbus: ModbusDataPoint) => {
        console.log("Handle Submit: " + JSON.stringify(modbus));
        (mode === 'add' ? addModbusDataPoint(token, datasourcename, modbus) : updateModbusDataPoint(token, modbus.id, modbus))
            .then(source => dispatch(fetchDataPointActions.success(source)))
            .then(r => thunkDispatch(fetchDataPointsForSourceAction(datasourcename)))
            .then(r => executeDelayed(100, ()=>history.goBack()));
         //   .catch(err => dispatch(setError(err)));
    }

    const submitMqtt = (mqtt: MQTTDataPoint) => {
        console.log("Handle Submit: " + JSON.stringify(mqtt));
        //dispatch(isLoading(true));
         (mode === 'add' ? addMQTTDataPoint(token, datasourcename, mqtt) : updateMQTTDataPoint(token, mqtt.id, mqtt))
              .then( source => dispatch(fetchDataPointActions.success(source)))
              .then(r => thunkDispatch(fetchDataPointsForSourceAction(datasourcename)))
              .then(r => executeDelayed(100, ()=>history.goBack()));
            //  .catch(err => dispatch(setError(err)));
            //  .finally(() => dispatch(loading(false)))
    }



    const NoValuesInfo = () => !isLoading && !dataPoint ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>

                <IonCardTitle>No DataPoint found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)

    const MQTTFormInfo= () => {

        let { Form, loading, error } = BuildForm<MQTTDataPoint>(mqttform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataPoint) {
                return <Form handleSubmit={submitMqtt} initialState={dataPointAsMQTT!}/>
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
        let { Form, loading, error } = BuildForm<ModbusDataPoint>(modbusform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataPoint) {
                return <Form handleSubmit={submitModbus} initialState={dataPointAsModbus!}/>
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


  //  let { Form, loading, error } = BuildForm<ModbusDataPoint>(mqttform(mode));

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
        <IonBackButton defaultHref='/datapoints' />
        </IonButtons>
        <IonTitle>{mode === 'add' ? 'New' : 'Edit'} DataPoint {dataPoint ? dataPoint.name : ""}</IonTitle>
    </IonToolbar>
    </IonHeader>
    <IonContent>
        {isLoading ? <IonItem><IonSpinner />Loading Datapoints...</IonItem> :
                    datasourcetype === "MQTTDataSource"  ? <MQTTFormInfo/> : <ModbusFormInfo/>


        }


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
