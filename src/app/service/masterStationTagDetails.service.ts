import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterStationTagDetailsModel } from "../models/masterStationTagDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class MasterStationTagDetailsService{

    constructor(private http: HttpClient){

    }
    public fetchAllStationTagDetails() {
        return this.http.get<MasterStationTagDetailsModel[]>(`${BASE_URL}masterStationTagDetails/fetchAllStationTagDetails`);
    }
    public fetchStationDetailsDataByStationId(stationId: number) {

        return this.http.get<MasterStationTagDetailsModel[]>(`${BASE_URL}masterStationTagDetails/fetchAllStationDetailsByStationId/${stationId}`);
    }
    public updateStationDetailsByCurrentValue(currentValue: string) {
        return this.http.put<MasterStationTagDetailsModel[]>(`${BASE_URL}masterStationTagDetails/updateStationTagDetailsTable/${currentValue}`, {
    });
      }
}
