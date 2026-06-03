import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterRoleDetailsModel } from "../models/masterRoleDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class MasterRoleDetailsService{
    
    constructor(private http:HttpClient){}

    public fetchAllMasterRoleDetails(){
        return this.http.get<MasterRoleDetailsModel[]>(`${BASE_URL}masterRoleDetails/fetchAllMasterRoleDetails`);
    }
}