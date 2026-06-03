import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BASE_URL } from "../utils/const";
import { Observable } from "rxjs";
import { StackerSensorDetailsModel } from "../models/stackerSensorDetails.model";


@Injectable({
    providedIn:'root'
})
export class StackerSensorDetailsService{

    constructor(private http:HttpClient){}

    public fetchStackerSensorDetails(): Observable<StackerSensorDetailsModel[]> {
        return this.http.get<StackerSensorDetailsModel[]>(`${BASE_URL}masterStackerSensorDetails/fetchStackerSensorDetails`);
    }


    public fetchByStackerId(stackerId:number){
        return this.http.get<StackerSensorDetailsModel[]>(`${BASE_URL}masterStackerSensorDetails/fetchByStackerId/${stackerId}`);
    }
    
}