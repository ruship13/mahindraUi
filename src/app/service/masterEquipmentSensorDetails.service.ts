import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterEquipmentSensorDetailsModel } from "../models/masterEquipmentSensorDetails.model";
import { BASE_URL } from "../utils/const";


@Injectable({
    providedIn:"root"
})
export class MasterEquipmentSensorDetailsService{
    
    constructor(private http:HttpClient){}

    public fetchAllEquipmentsensorDetails(){
        return this.http.get<MasterEquipmentSensorDetailsModel[]>(`${BASE_URL}masterEquipmentSensorDetails/fetchAllEquipmentsensorDetails`);
    }

    public  fetchAllSensorDiagramView(sensor: string){
        return  this.http.get<MasterEquipmentSensorDetailsModel[]>(
            `${BASE_URL}masterEquipmentSensorDetails/fetchAllSensorDiagramView/${sensor}`
        );
    }
}
    