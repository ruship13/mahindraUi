import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InfeedMissionRuntimeDetailsModel } from "../models/infeedMissionRuntimeDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: "root"
})
export class InfeedMissionRuntimeDetailsService {

    constructor(private http: HttpClient) { }

    public fetchAllInfeedMissionRuntimeDetails() {
        return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/getall`);
    }
    public fetchInfeedMissionRuntimeDetailsByCurrentDate() {
        return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/getbydate`);
    }
    public fetchInfeedMissionRuntimeDetails() {
        return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/fetchInfeedMissionRuntimeDetails`);
    }
    public updateInfeedMissionRuntimeDetailsDetails(infeedMissionObj: InfeedMissionRuntimeDetailsModel) {
        return this.http.put<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/updateInfeedMissionRuntimeDetailsDetails`, infeedMissionObj)
    }
    // public fetchInfeedMissionRuntimeDetailsByAllFilters(floorName: string,
    //     areaName: string, infeedMissionStatus: string, infeedMissionStartCdatetime: string, infeedMissionEndCdatetime: string) {
    //     return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/fetchInfeedMissionRuntimeDetailsByAllFilters/${floorName}/${areaName}/${infeedMissionStatus}/${infeedMissionStartCdatetime}/${infeedMissionEndCdatetime}`);
    // }

    public fetchInfeedMissionRuntimeDetailsByAllFilters(productName: string, 
        palletStatus: string, infeedMissionStartCdatetime: string, infeedMissionEndCdatetime: string) {
        return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}infeedmissionruntimedetails/fetchInfeedMissionRuntimeDetailsByAllFilters/${productName}/${palletStatus}/${infeedMissionStartCdatetime}/${infeedMissionEndCdatetime}`);
    }
    

}