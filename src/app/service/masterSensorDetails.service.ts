import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterSensorDetailsModel } from "../models/masterSensorDetails.model";
import { BASE_URL } from "../utils/const";


@Injectable({
    providedIn: 'root'
  })
export class MasterSensorDetailsService{
    
    constructor(private http:HttpClient){}

    // public fetchAllEquipmentsensorDetails(selectedEquipmentName:string){
    //     return this.http.get<masterWmsEquipmentSensorDetailsModule[]>(`${BASE_URL}equipmentSensor/fetchAllEquipmentSensorDetails`);
    // }

    public fetchByWmsEquipmentId(wmsEquipmentId:number){
        return this.http.get<MasterSensorDetailsModel[]>(`${BASE_URL}masterSensor/fetchByWmsEquipmentId/${wmsEquipmentId}`);
    }
    public fetchAllMasterSensorDetails(){
        return this.http.get<MasterSensorDetailsModel[]>(`${BASE_URL}masterSensor/fetchAllMasterSensorDetails`);
    }

     public fetchAllByEquipmentSensorStatus(){
        return this.http.get<MasterSensorDetailsModel[]>(`${BASE_URL}masterSensor/fetchAllByEquipmentSensorStatus`);
    }
    public findByIsBabySensor(){
        return this.http.get<MasterSensorDetailsModel[]>(`${BASE_URL}masterSensor/findAllByIsBabySensor`);  
    }
   
    // public fetchAllEquipmentsensorDetails(selectedEquipmentName:string){
    //     return this.http.get<MasterSensorDetailsModel[]>(`${BASE_URL}fetchAllEquipmentsensorDetails/${selectedEquipmentName}`);
    // }
    
}