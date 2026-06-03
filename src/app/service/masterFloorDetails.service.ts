import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterFloorDetailsModel } from "../models/masterFloorDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})

export class MasterFloorDetailsService {

    constructor(private http:HttpClient){}

    public fetchAllMasterFloorDetails(){
        return this.http.get<MasterFloorDetailsModel[]>(`${BASE_URL}masterFloorDetails/fetchallmasterfloordetails`);
    }
}