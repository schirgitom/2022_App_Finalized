import React, {useEffect} from 'react'
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
import {ModbusDataSource, User} from '../../types/types';
import * as Validator from "../../services/utils/validators";
import {Dispatch} from 'redux';
import '../../services/actions/security';
import {RouteComponentProps} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import Login from "../login/Login";
import {executeDelayed} from "../../services/utils/asynchelper";
import {BuildForm, FormDescription} from "../../services/utils/formbuilder";
import {register} from "../../services/rest/security";
import {RootState} from "../../services/reducers";
import {fetchUserAction} from "../../services/actions/security";



const form= (mode: string): FormDescription<User> => ({
    name: 'registration',
    fields: [
        {
            name: 'userName', label: 'Username', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'firstname', label: 'Firstname', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'lastname', label: 'Lastname', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'role', label: 'Role', type: 'select', position: 'floating',
            color: 'primary', validators: [Validator.required],
            options :
                [
                    {key: "Admin", value : "Administrator"},
                    {key: "User", value : "User"}
                ]
        }
        ,

        {
            name: 'active', label: 'Active', type: 'select', position: 'floating',
            color: 'primary', validators: [Validator.required],
            options :
                [
                    {key: true, value : "Active"},
                    {key: false, value : "Inactive"}
                ]
        },
        {
            name: 'password', label: 'Password', type: 'password',
            position: 'floating', validators: [Validator.required, Validator.minLength(8)]
        }
    ],
    submitLabel:  mode === 'add' ? 'Save' : 'Update',
});




//export const Register: React.FunctionComponent<RouteComponentProps<any>> = (props) => {
export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string }>> => ({ history, match }) => {

    const dispatch = useDispatch();
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');

    const { user, isLoading, errorMessage } = useSelector((s:RootState) => s.admin);

    const {Form, loading , error} = BuildForm(form(mode));

    useEffect(() => {
        if(mode == 'edit' && (!user || user.id != match.params.id))
        {
            dispatch(fetchUserAction(match.params.id));
        }
    })


    const submit = (user: User) => {
        dispatch(loading(true));
        register(user, token)
            .then((result: {}) => {
                executeDelayed(100,() => history.replace('/users'))
            })
            .catch((err: Error) => {
                dispatch(error(err.message))
            })
            .finally(() => dispatch(loading(false)))
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login"/>
                    </IonButtons>
                    <IonTitle>{mode === 'add' ? 'New' : 'Edit'} User {user ? user.fullName : ""}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading User...</IonItem> :
                    mode === 'edit' ?  <Form handleSubmit={submit} initialState={user!}/> :  <Form handleSubmit={submit} />

                }
            </IonContent>
        </IonPage>
    )
}


