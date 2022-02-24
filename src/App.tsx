import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import {SecureRoute} from "./components/SecureRoute";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ValueList from "./pages/list/ValueList";
import ShowValue from "./pages/item/ShowValue";
import DataSourceList from "./pages/datasources/ListDataSource";
import ManageDataSource from "./pages/datasources/ManageDataSource";
import ManageDataPoint from "./pages/datasources/ManageDataPoint";
import Register from "./pages/register/Register";
import UserList from "./pages/register/UserList";
import AlarmList from "./pages/alarmlist/AlarmList";
import ShowAlarm from "./pages/alarmlist/ShowAlarm";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/home" component={Home} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <SecureRoute path="/values"  component={ValueList} exact={true} />
            <SecureRoute path="/values/show/:id"  component={ShowValue} exact={true} />
            <SecureRoute path="/datasources"  component={DataSourceList} exact={true} />
            <SecureRoute path="/datasources/:source"  component={ManageDataSource("edit")} exact={true} />
            <SecureRoute path="/datapoint/:source/:id"  component={ManageDataPoint("edit")} exact={true} />
            <SecureRoute path="/datapoint/:source/add"  component={ManageDataPoint("add")} exact={true} />
            <SecureRoute path="/users/"  component={UserList} exact={true} />
            <SecureRoute path="/users/add"  component={Register("add")} exact={true} />
            <SecureRoute path="/users/edit/:id"  component={Register("edit")} exact={true} />
            <SecureRoute path="/alarmlist"  component={AlarmList} exact={true} />
            <SecureRoute path="/alarmlist/:id"  component={ShowAlarm} exact={true} />
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
