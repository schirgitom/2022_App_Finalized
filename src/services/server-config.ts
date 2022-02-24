class ServerConfig {
    private _host = "http://localhost:5010/api";
    private _loginURI = `${this._host}/User/Login`;
    private _UserURI = `${this._host}/User/`;
    private _valuesControllerURI = `${this._host}/Value/`;
    private _AlarmListControllerURI = `${this._host}/AlarmList/`;
    private _DataSourcesControllerURI = `${this._host}/DataSource/`;
    private _DataPointControllerURI = `${this._host}/DataPoint/`;
    private _VisualsControllerURI = `${this._host}/Visuals/`;

    public get host(): string {
        return this._host
    };

    public get loginURI(): string {
        return this._loginURI
    };

    public get getValuesControllerURI(): string {
        return this._valuesControllerURI
    };

    public get getDataSourceControllerURI(): string {
        return this._DataSourcesControllerURI
    };

    public get getAlarmListControllerURI(): string {
        return this._AlarmListControllerURI
    };

    public get getDataPointControllerURI(): string {
        return this._DataPointControllerURI
    };

    public get getDataPointVisualsURI(): string {
        return this._VisualsControllerURI
    };

    public get getUserURI(): string {
        return this._UserURI
    };



}

export default new ServerConfig()