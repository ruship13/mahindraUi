import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../utils/const";
import { masterAgingDaysDetails } from "../models/masterAgingDaysDetails.model";
import { Injectable } from "@angular/core";
import { RegisterResponse } from "../models/responseHandler.model";
@Injectable({
    providedIn: 'root'
})
export class MasterAgeingDaysDetailsService{

    constructor(private http: HttpClient) { }

    public fetchAllAgeingDaysDetais(){
        return this.http.get<masterAgingDaysDetails[]>(`${BASE_URL}masterAgeingDaysDetails/findAllAgeingDaysDetais`);
    
    }



    public updateMasterAgeingDaysDetails(productObject2: masterAgingDaysDetails) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterAgeingDaysDetails/updateMasterAgeingDaysDetails`,productObject2);
    }


   
}