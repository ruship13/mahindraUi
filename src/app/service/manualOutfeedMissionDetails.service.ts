import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ManualOutfeedMissionDetailsModel } from "../models/manualOutfeedMissionDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})
export class ManualOutfeedMissionDetailsService {


    constructor(private http: HttpClient) { }

    public addCurrentPalletStockdetailsInManualOutfeedMissionDetails(addCurrentPalletStockDetailsInstance:ManualOutfeedMissionDetailsModel){
        return this.http.post<ManualOutfeedMissionDetailsModel>(`${BASE_URL}manualOutfeedMissionDetails/addCurrentPalletStockdetailsInManualOutfeedMissionDetails`,addCurrentPalletStockDetailsInstance ,{observe:'response'});
    
    }

    public addSerialNumberStockDetailsInManualOutfeed(addCurrentPalletStockDetailsInstance:ManualOutfeedMissionDetailsModel){
        console.log("8888serila");
        return this.http.post<ManualOutfeedMissionDetailsModel>(`${BASE_URL}manualOutfeedMissionDetails/addSerialNumberCurrentPalletStockdetailsInManualOutfeedMissionDetails`,addCurrentPalletStockDetailsInstance ,{observe:'response'});
    
    }

    
}