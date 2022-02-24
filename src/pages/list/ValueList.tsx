import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
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
    RefresherEventDetail, IonLabel
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
    power,
    shieldCheckmark, alarm, bed
} from 'ionicons/icons';
import React, {useEffect} from 'react';
import { personCircle, search, star, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import '../../services/actions/security';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/reducers";
import {fetchValuesAction, fetchValuesActions} from "../../services/actions/values";
import {fetchValues} from "../../services/rest/values";
import {IconConverter} from "../../services/utils/iconconverter";


const ValueList: React.FC<RouteComponentProps> = ({ history }) => {

    const { values, isLoading, errorMessage } = useSelector((s:RootState) => s.values);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();

    useEffect(() => { if (values.length === 0) dispatch(fetchValuesAction()) }, []);

    const NoValuesInfo = () => !isLoading && values.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Values found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)


    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        console.log('Begin async operation on Value List');
        fetchValues(token)
            .then(values => dispatch(fetchValuesActions.success(values)))
            .then(() => event.detail.complete())
            .catch(err => dispatch(fetchValuesActions.failure(err)))
    }

    const ListValues = () => {

        const items = values.map(value => {

            let icon = water;
            let unit = "";
            if(value.visuals != null)
            {
                unit = " " + value.visuals!.unit!;
            }
            if(value.sample != null) {
                let valuetext = value.sample.value + unit;
                if (value.visuals != null) {
                    if (value.visuals.icon != null) {
                        icon = IconConverter(value.visuals.icon);
                    }

                    if (value.visuals.finalText != null) {
                        valuetext = value.visuals.finalText;
                    }
                }


            return (
                <IonItemSliding key={value.dataPoint.databaseName}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(value.dataPoint.databaseName) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.dataPoint.databaseName} onClick={() => history.push('/values/show/' +value.dataPoint.databaseName)}>
                        <IonIcon icon={icon} />
                        {value.dataPoint.name}
                        <div className="item-note" slot="end">
                            {valuetext}
                        </div>
                    </IonItem>
                </IonItemSliding>
            );
            }
        });
        return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo />;
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Value List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {isLoading ? <IonItem><IonSpinner />Loading Values...</IonItem> : <ListValues />}
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                
            </IonContent>
        </IonPage>
    );
};

export default ValueList;