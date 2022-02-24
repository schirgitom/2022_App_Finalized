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
    shieldCheckmark, alarm, bed, skull
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
import {fetchUsersAction} from "../../services/actions/security";


const UserList: React.FC<RouteComponentProps> = ({ history }) => {

    const { userlist, isLoading, errorMessage } = useSelector((s:RootState) => s.admin);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(fetchUsersAction()) }, []);

    const NoValuesInfo = () => !isLoading && userlist?.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Users found...</IonCardTitle>
            </IonCardHeader>
        </IonCard>) : (<></>)

    const ListUsers = () => {

        const items = userlist!.map(value => {

            let icon = skull;

            let usertext = value.firstname + " " + value.lastname + " (" + value.role+")";
            return (
                <IonItemSliding key={value.id}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(value.id) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.id} onClick={() => history.push('/users/edit/' +value.id)}>
                        <IonIcon icon={icon} />
                        {usertext}
                    </IonItem>
                </IonItemSliding>
            );
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
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/users/add')}>
                            <IonIcon slot="icon-only" icon={add}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>User List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading Users...</IonItem> : <ListUsers />}
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

export default UserList;