import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OutfeedMissionRuntimeDetailsModel } from "../models/outfeedMissionRuntimeDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: "root"
})
export class OutfeedMissionRuntimeDetailsService {

    constructor(private http: HttpClient) { }
    public fetchOutfeedMissionRuntimeDetails() {
        return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}outfeedmissionruntimedetails/fetchOutfeedMissionRuntimeDetails`);
    }
    public fetchOutfeedMissionRuntimeDetailsByCurrentDate() {
        return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}outfeedmissionruntimedetails/getbydate`);
    }
    public updateOutfeedMissionRuntimeDetails(outfeedMissionObj: OutfeedMissionRuntimeDetailsModel) {
        return this.http.put<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}outfeedmissionruntimedetails/updateOutfeedMissionRuntimeDetailsDetails`, outfeedMissionObj)
    }
    //     public fetchOutfeedMissionRuntimeDetailsByAllFilters(floorName:string, 
    //         areaName:string, outfeedMissionStatus:string, outfeedMissionCdatetimeStart:string, outfeedMissionCdatetimeEnd: string){
    //        return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}outfeedmissionruntimedetails/fetchOutfeedMissionRuntimeDetailsByAllFilters/${floorName}/${areaName}/${outfeedMissionStatus}/${outfeedMissionCdatetimeStart}/${outfeedMissionCdatetimeEnd}`);
    //    }


    // public fetchOutfeedMissionRuntimeDetailsByAllFilters(productName: string,
    //     palletStatus: string, outfeedMissionCdatetimeStart: string, outfeedMissionCdatetimeEnd: string) {
    //     return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}outfeedmissionruntimedetails/fetchOutfeedMissionRuntimeDetailsByAllFilters/${productName}/${palletStatus}/${outfeedMissionCdatetimeStart}/${outfeedMissionCdatetimeEnd}`);
    // }


    public fetchOutfeedMissionRuntimeDetailsByAllFilters(
        productName: string,
        palletStatus: string,
        outfeedMissionCdatetimeStart: string,
        outfeedMissionCdatetimeEnd: string,
        dispatchOrderNumber: string) {
        
        return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(
            `${BASE_URL}outfeedmissionruntimedetails/fetchOutfeedMissionRuntimeDetailsByAllFilters/${productName}/${palletStatus}/${outfeedMissionCdatetimeStart}/${outfeedMissionCdatetimeEnd}/${dispatchOrderNumber}`
        );
    }
    
}

