import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { BASE_URL } from "../util/const";
import { EquipmentAlarmHistoryDetailsModel } from "../models/equipmentAlarmHistoryDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})
export class EquipmentAlarmHistoryDetailsService {

    constructor(private http: HttpClient) {

    }
    public findByEquipmentAlarmName() {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByEquipmentAlarmName`);
    }
     public findAllEquipmentByAlarmOccuredAndResolvedDateIsNull() {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findAllEquipmentByAlarmOccuredAndResolvedDateIsNull`);
    }

    public findAllEquipmentByAlarmOccuredAndResolvedDateIsNullByStacker(equipmentId:number) {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findAllEquipmentByAlarmOccuredAndResolvedDateIsNullByStacker/${equipmentId}`);
    }
    
    public fetchAllEquipmentAlarmHistory() {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/fetchAllEquipmentAlarmHistory`);
    }
    public getAllAlarmHistoryData() {
        return this.http.get<any[]>(`${BASE_URL}fetchAllEquipmentAlarmHistory`)
    }

    public getAllFilteredData(SelectedStartDatetime: String, SelectedEndDatetime: String, AlarmName: String, EquipmentName: String) {
        return this.http.get<any[]>(`${BASE_URL}fetchByAllFilters/${SelectedStartDatetime}/${SelectedEndDatetime}/${AlarmName}/${EquipmentName}`)
    }
    public fetchAllEquipmentAlaramStatus() {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/fetchAllEquipmentAlaramStatus`);
    }

    public fetchByWmsEquipmentAlarmHistoryId(wmsEquipmentAlarmHistoryId: number){
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(
            `${BASE_URL}equipmentAlarmHistory/fetchByWmsEquipmentAlarmHistoryId/${wmsEquipmentAlarmHistoryId}`
        );
    }
    // public fetchAllEquipmentAlarmHistoryDetails() {
    //     return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByCdatetime`);
    // }

    public fetchEquipmentAlarmHistoryDetailsByAllFilters(startDateTime: string, endDateTime: string, equipmentName: string) {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByAllFiltersDetails/${startDateTime}/${endDateTime}/${equipmentName}`);
    }
       
    public fetchAllEquipmentAlarmHistoryDetails() {
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByEquipmentAlarmOccurredDatetime`);
    }


    public fetchAllZone1AlarmDetails(){
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByAlarmZone1`);
    }

    public fetchAllZone2AlarmDetails(){
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByAlarmZone2`);
    }

    public fetchAllZone3AlarmDetails(){
        return this.http.get<EquipmentAlarmHistoryDetailsModel[]>(`${BASE_URL}equipmentAlarmHistory/findByAlarmZone3`);
    }
}