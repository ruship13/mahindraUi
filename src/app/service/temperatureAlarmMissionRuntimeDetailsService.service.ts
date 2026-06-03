import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BASE_URL } from "../utils/const";
import { TemperatureAlarmMissionRuntimeDetailsModel } from "../models/temperatureAlarmMissionRuntimeDetailsModel.model";
import { Observable } from "rxjs";
import { RegisterResponse } from "../models/responseHandler.model";


@Injectable({
    providedIn: "root"
})
export class TemperatureAlarmMissionRuntimeDetailsService {
    constructor(private http: HttpClient) { }

    public fetchTemperatureAlarmMissionRuntimeDetails() {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/fetchTempratureAlarmMissionStatusRuntimeDetails`);
    }


    public fetchAllAlarmMissionList() {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/getAllAlarmMission`);
    }

    public getAllAlarmMissionByAutoMission() {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/getAllAlarmMissionByAutoMission`);
    }


    public addMockDrillMissionDetails(areaName: string): Observable<any> {
        return this.http.post<RegisterResponse>(
            `${BASE_URL}tempratureAlarmMissionDetails/addMockDrillMissionDetails/${areaName}`, null
        );
    }


    public fetchAlarmMissionRuntimeDetailsByAllFilters(
        alarmMissionStartDateTime: string, alarmMissionEndDateTime: string) {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/fetchTemperatureAlarmMissionRuntimeDetailsByAllFilters/${alarmMissionStartDateTime}/${alarmMissionEndDateTime}`);
    }



    public fetchTemperatureAlarmMissionRuntimeDetailsByAllFiltersByAutoMission(
        alarmMissionStartDateTime: string, alarmMissionEndDateTime: string) {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/fetchTemperatureAlarmMissionRuntimeDetailsByAllFiltersByAutoMission/${alarmMissionStartDateTime}/${alarmMissionEndDateTime}`);
    }


    public fetchAllAlarmMissionRuntimeDetails() {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel[]>(`${BASE_URL}tempratureAlarmMissionDetails/getall`);
    }

    getAlarmForArea1(): Observable<HttpResponse<TemperatureAlarmMissionRuntimeDetailsModel>> {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel>(`${BASE_URL}tempratureAlarmMissionDetails/findByCurrentDateForArea1`, { observe: 'response' });
    }

    getAlarmForArea2(): Observable<HttpResponse<TemperatureAlarmMissionRuntimeDetailsModel>> {
        return this.http.get<TemperatureAlarmMissionRuntimeDetailsModel>(`${BASE_URL}tempratureAlarmMissionDetails/findByCurrentDateForArea2`, { observe: 'response' });
    }


}
