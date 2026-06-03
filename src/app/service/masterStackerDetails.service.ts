import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterEquipmentDetailsModel } from "../models/masterEquipmentDetails.model";
import { BASE_URL } from "../utils/const";
import { MasterStackerDetailsModel } from "../models/masterStackerDetails.model";

@Injectable({
    providedIn:'root'
})
export class MasterStackerDetailsService{

    constructor(private http:HttpClient){}

    public fetchAllStackerDetails(){
        return this.http.get<MasterStackerDetailsModel[]>(`${BASE_URL}masterStackerDetails/fetchByStackerDetailsIsDeleted`);
    }
    
}