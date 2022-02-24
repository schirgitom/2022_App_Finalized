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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonToast,
} from '@ionic/react';
import {
    information,
trophy
} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import '../../services/actions/security';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/reducers";
import {DataSourcesResult, fetchDataSourcesAction, fetchDataSourcesActions} from "../../services/actions/datasources";
import {ModbusDataSource, MQTTDataSource} from "../../types/types";


const DataSourceList: React.FC<RouteComponentProps> = ({ history }) => {

    const { dataSources, isLoading, errorMessage } = useSelector((s:RootState) => s.datasources);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();
    const [availablesources, setAvailableSources] = useState<any[]>([]);
    const [sources, setSources] = useState<any[] | null>([]);
    const thunkDispatch: ThunkDispatch<RootState, null, DataSourcesResult> = useDispatch();
    let datasources : any[];
    useEffect(() => {
        if (!dataSources) {
            thunkDispatch(fetchDataSourcesAction()).then(() => {
                setSources(dataSources);
            });

            for (var i = 0; i < sources!.length; i++) {
                if (sources![i] != null) {
                    let scr = sources![i];
                    const src = {key: scr.name, value: scr.name}
                    datasources.push(src);
                }


            }
        //    console.log(dataSources);
            setAvailableSources(datasources);
        }
    }, []);

    const NoValuesInfo = () => !isLoading && availablesources.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No DataSource found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)


    const ListDatasourceValues = () => {

        const items = dataSources?.map(value => {
            let icon = trophy;
            const text = value.name!;
                let detailledinfo = "";
            if(value.type == "MQTTDataSource")
            {
                const mqttobj = value as MQTTDataSource;
                detailledinfo = "Host: " + mqttobj.host + " - Port: " + mqttobj.port;
            }
            else
            {
                const modobj = value as ModbusDataSource;
                detailledinfo = "Host: " + modobj.host + " - Port: " + modobj.port  + " Slave ID: " + modobj.slaveID;
            }
            //console.log(typeof value);

            return (
                <IonItemSliding key={text}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(text) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={text} onClick={() => history.push('/datasources/' +text)}>
                        <IonIcon icon={icon} />
                        {text}
                        <div className="item-note" slot="end">
                            {detailledinfo}
                        </div>
                    </IonItem>
                </IonItemSliding>
            );
        });
        if(items && items.length > 0)
        {
            return (<IonList>{items}</IonList>);
        }
        else
        {
            return <NoValuesInfo />
        }
    //    return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo />;
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Data Source List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading Values...</IonItem> : <ListDatasourceValues />}
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

export default DataSourceList;