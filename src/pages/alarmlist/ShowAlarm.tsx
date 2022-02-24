import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonBackButton,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonAlert,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    IonButton,
    RefresherEventDetail, IonLabel, IonCardSubtitle, useIonViewDidEnter, useIonViewDidLeave, IonAvatar, IonText
} from '@ionic/react';
import {
    train,
    add,
    trash,
    create,
    beer,
    boat,
    information,
    water,
    sunnySharp,
    flash,
    car,
    alertCircle
} from 'ionicons/icons';
import React, {FunctionComponent, useEffect, useState} from 'react';
import { personCircle, search, star, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import '../../services/actions/security';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/reducers";
import {withIonLifeCycle } from '@ionic/react';
import {
    fetchValueAction,
    fetchValueActions,
    ValueResult
} from "../../services/actions/value";
import GaugeChart from 'react-gauge-chart'
import {
    fetchAlarmListEntriesActions,
    fetchAlarmListEntryAction,
    fetchAllAlarmListEntriesAction
} from "../../services/actions/alarmlist";
import Moment from "moment";
import {addMQTTDataPoint, updateMQTTDataPoint} from "../../services/rest/datapoints";
import {fetchDataPointActions, fetchDataPointsForSourceAction} from "../../services/actions/datapoints";
import {executeDelayed} from "../../services/utils/asynchelper";
import {AcknowledgeEntry} from "../../services/rest/alarmlist";



export const ShowAlarm: FunctionComponent<RouteComponentProps<{ id: string }>> = ({ match, history }) => {
// Relevant Application State
    const { alarmListEntry, isLoadingAlarmList, errorMessage } = useSelector((s:RootState) => s.alarmlist);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();
    const thunkDispatch = dispatch as ThunkDispatch<RootState, null, ValueResult>;
    const RefreshTime = 1;
    const [error, setError] = useState<string>('');

    useEffect(() => {

            //if(!alarmListEntry || alarmListEntry.id !== match.params.id) {
               // console.log("Loading");
                thunkDispatch(fetchAlarmListEntryAction(match.params.id));
           // }

    }, []);


    const Acknowledge = () => {
        console.log("Handle Acknowledge");
        //dispatch(isLoading(true));
        AcknowledgeEntry(token, match.params.id, "")
        .then( source => dispatch(fetchAlarmListEntryAction(match.params.id)))
        .then(r => thunkDispatch(fetchAllAlarmListEntriesAction("All")))
        .then(r => executeDelayed(100, ()=>history.goBack()))
        .catch((err: Error) => {
            console.log(err.message);
            dispatch(setError(err.message));
        });


    }

    //updateVisuals(value);

    const AlarmListEntry =  () => {

            if(alarmListEntry) {
                const value =alarmListEntry;
                const icon = alertCircle;
                const text = value.alarmText;
                const type = value.alarmType;
                const status = value.alarmStatus;
                const ackstat = value.acknowledgeStatus;
                const occdata = Moment(value.activeDate).format('DD.MM.YYYY hh:mm:ss');
                let dectivedate = "Still Active";

                if (status != "Active") {
                    dectivedate = Moment(value.deactiveDate).format('DD.MM.YYYY hh:mm:ss');
                }


                const id = value.id;

                let alertColor = "#5BE12C"

                if (value.alarmType === "Warning") {
                    alertColor = "#F5CD19"
                } else if (value.alarmType === "Alarm") {
                    alertColor = "#EA4228"
                } else if (value.alarmType === "Trip") {
                    alertColor = "#8d32a8"
                }
                return (
                    <IonCard class="welcome-card">
                        <IonCardHeader>

                            <IonCardTitle>{type}</IonCardTitle>
                            <IonCardSubtitle>{occdata} - {dectivedate}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent justify-content-center align-items-center >

                            <IonText>{text}</IonText>

                        </IonCardContent>
                        <IonButton color="danger" onClick={ () => Acknowledge() } disabled={ackstat === "Acknowledged" ? true : false}>Acknowledge</IonButton>
                    </IonCard>
                );
            }
            else
            {
                console.log("Empty");
                return (<></>);
            }

        };




    const spinner = (isLoading: boolean, text: string = 'Loading Alarm Entry...') => isLoading ?
        (<IonItem>
            <IonSpinner /> {text}
        </IonItem>) : (<></>);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref='/values/' />
                    </IonButtons>
                    <IonTitle>Alarm List Entry</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoadingAlarmList ? <IonItem><IonSpinner />Loading Alarm List Entry...</IonItem> : (<></>)}
                {isLoadingAlarmList ? <IonItem><IonSpinner />Loading  Alarm List Entry...</IonItem> : <AlarmListEntry/>}
                <IonToast
                    isOpen={error ? error !== "" : false}
                    onDidDismiss={() => false}
                    message={error}
                    duration={5000}
                    color='danger'
                />
            </IonContent>
        </IonPage>
    );
};

export default ShowAlarm;
