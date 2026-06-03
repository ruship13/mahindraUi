import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { MasterProductDetailsModel } from "../models/masterProductDetails.model";
import { PalletOperationHistoryModel } from "../models/palletOperationHistory.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})

export class PalletOperationHistoryService {

    constructor(private http: HttpClient) { }

    public fetchAllPalletOperationInfeedMissionDetails() {
        return this.http.get<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/findByLoadDatetimeAndOperationInfeedMissionDetails`);
    }

    public fetchPalletOperationDetailsByAllFilters(startDateTime: String, endDateTime: String, productVariantCode: String, area: String, floor: String, operation: string) {
        return this.http.get<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/findByAllFilters/${startDateTime}/${endDateTime}/${productVariantCode}/${area}/${floor}/${operation}`);
    }

    public fetchAllPalletOpertaionHistoryDetails() {
        return this.http.get<MasterProductDetailsModel[]>(`${BASE_URL}palletOperationHistory/fetchAllPalletOperationHistoryDetails`);
    }

    public fetchAllPalletOperationOutfeedMissionDetails() {
        return this.http.get<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/findByLoadDateTimeAndOperationOutfeedMissionDetails`);
    }

    public fetchPalletOperationDetailsByOperation(operation:string){
        return this.http.get<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/findByOperation/${operation}`);
    }
    public fetchPalletOperationHistory() {
      return this.http.get<PalletOperationHistoryModel[]>(
        `${BASE_URL}addPalletOperationHistory`);
    }
    public updateAllPalletOperationHistory(palletCode:string,productVariantCode:string){
      return this.http.post<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/updatePalletOperationHistory/${palletCode}/${productVariantCode}`, {
        observe: 'response'
      });
      }
      public addAllPalletOperationHistoryDetails( addPalletOperationHistoryInstance: PalletOperationHistoryModel){
          return this.http.post<PalletOperationHistoryModel>(`${BASE_URL}palletOperationHistory/addPalletOperationHistoryDetails`,addPalletOperationHistoryInstance,{observe:'response'});
      
      }
      public fetchAllPalletOperationHistoryDetails() {
        return this.http.get<PalletOperationHistoryModel[]>(
          `${BASE_URL}palletOperationHistory/fetchAllPalletOperationHistoryDetails`);

        
      }
      public fetchPalletOperationDataBywmsTransferOrderId(wmsTransferOrderId: string) {
        return this.http.get<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/findByWmsTransferOrderId/${wmsTransferOrderId}`);
    }
      public addPalletOperationHistory(addPalletOperationHistoryInstance: PalletOperationHistoryModel) {
        return this.http.post<PalletOperationHistoryModel[]>(`${BASE_URL}palletOperationHistory/addPalletOperationHistory`, addPalletOperationHistoryInstance, { observe: 'response' });
    } 
    
}