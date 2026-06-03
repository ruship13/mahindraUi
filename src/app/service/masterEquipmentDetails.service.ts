import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterEquipmentDetailsModel } from "../models/masterEquipmentDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class MasterEquipmentDetailsService{

    constructor(private http:HttpClient){}

    public fetchAllEquipmentDetails(){
        return this.http.get<MasterEquipmentDetailsModel[]>(`${BASE_URL}masterEquipmentDetails/fetchByEquipmentDetailsIsDeleted`);
    }
    public updateAllMasterEquipmentDetails(equipmentObj: MasterEquipmentDetailsModel) {
        return this.http.put<MasterEquipmentDetailsModel[]>(`${BASE_URL}masterEquipmentDetails/updateMasterEquipmentDetails`, equipmentObj)
    }
}