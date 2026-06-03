import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterReasonDetailsModel } from "../models/masterReasonDetails.model";
import { BASE_URL } from "../utils/const";
import { RegisterResponse } from "../models/responseHandler.model";

@Injectable({
    providedIn: 'root',
})

export class MasterReasonDetailsService {

    constructor(private http: HttpClient) { }

    public fetchAllReasonDetails() {
        return this.http.get<MasterReasonDetailsModel[]>(`${BASE_URL}masterReasonDetails/fetchAllMasterReasonDetails`);
    }

    public deleteReasonDetails(reasonId: number) {
        return this.http.post<RegisterResponse>(`${BASE_URL}masterReasonDetails/deleteMasterReasonDetails/${reasonId}`, {
            observe: 'response'
        });
    }

    public editReasonDetails(reasonId: number, reasonObject2: MasterReasonDetailsModel) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterReasonDetails/updateMasterReasonDetails/${reasonId}`, reasonObject2);
          
        
    }

    public addReasonDetails(reasonObject:MasterReasonDetailsModel){
        return this.http.post<RegisterResponse>(`${BASE_URL}masterReasonDetails/addMasterReasonDetails`, reasonObject);
          
    }
}