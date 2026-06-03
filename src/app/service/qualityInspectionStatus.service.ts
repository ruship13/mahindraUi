import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QualityInspectionStatusModel } from "../models/qualityInspectionStatus.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class QualityInspectonStatusService{
    constructor(private http:HttpClient){}


    // public fetchAllQuantityInspectionStatusDetails() {
    //     return this.http.get<QualityInspectionStatusModel[]>(`${BASE_URL}qualityInspectionStatus/fetchAllQualityInspectionStatusDetails`);
    //   }
    }