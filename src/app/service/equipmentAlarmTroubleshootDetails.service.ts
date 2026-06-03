import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EquipmentAlarmTroubleshootDetailsModel } from "../models/equipmentAlarmTroubleshootDetails.model";
import { BASE_URL } from "../utils/const";


@Injectable({
    providedIn: 'root'
})
export class EquipmentAlarmTroubleshootDetailsService {
    
constructor(private http: HttpClient) {}

    public fetchByEquipmentAlarmId(equipmentAlarmId: number){
        return this.http.get<EquipmentAlarmTroubleshootDetailsModel[]>(
            `${BASE_URL}equipmentAlarmTroubleshootDetails/fetchByEquipmentAlarmId/${equipmentAlarmId}`
        );
    }
    public fetchAllEquipmentAlarmTroubleshootDetails() {
        return this.http.get<EquipmentAlarmTroubleshootDetailsModel[]>(`${BASE_URL}equipmentAlarmTroubleshootDetails/fetchAllEquipmentAlarmTroubleshootDetails`);
    }
    public findAllAlarmResolvedSteps(alarmResolveSteps: string) {
        return this.http.get<EquipmentAlarmTroubleshootDetailsModel[]>(
          `${BASE_URL}equipmentAlarmTroubleshootDetails/findAllAlarmResolvedSteps/${alarmResolveSteps}`
        );
      }
}