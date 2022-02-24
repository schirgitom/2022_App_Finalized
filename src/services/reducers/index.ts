import { combineReducers } from "@reduxjs/toolkit";
import {user, admin} from "./security";
import { formBuilderReducer } from '../utils/formbuilder';
import {values} from "./values";
import {value} from "./value";
import {datasources} from "./datasources"
import {datasource} from "./datasource"
import {datapoint} from "./datapoints";
import {alarmlist} from "./alarmlist";

const rootReducer = combineReducers({
    user,
    values,
    value,
    datasources,
    alarmlist,
    datasource,
    datapoint,
    formBuilder: formBuilderReducer,
    admin: admin
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;