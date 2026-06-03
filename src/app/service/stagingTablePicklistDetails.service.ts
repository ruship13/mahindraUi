import { HttpClient } from "@angular/common/http";
import { StagingTablePicklistDetailsModel } from "../models/stagingTablePicklistDetails.model";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})
export class StagingTablePicklistDetailsService {


    constructor(private http: HttpClient) { }
    public fetchStagingTablePicklistDetails() {
        return this.http.get<StagingTablePicklistDetailsModel[]>(
          `${BASE_URL}StagingTablePicklistDetails/fetchAllStagingTablePicklistDetails`);
      }
    
    public fetchAllMaterialCodeFromStagingTablePicklistDetailsByMaterialCode(materialCode:string) {
        return this.http.get<StagingTablePicklistDetailsModel[]>(
         `${BASE_URL}StagingTablePicklistDetails/fetchMaterialCodeFromStagingTablePicklistDetailsByMaterialCode/${materialCode}`);
         
      }
      public fetchAllSAPOrderNoFromStagingTablePicklistDetailsBySapOrderNo(sapOrderNo:string) {
        return this.http.get<StagingTablePicklistDetailsModel[]>(
            `${BASE_URL}StagingTablePicklistDetails/fetchSAPOrderNoFromStagingTablePicklistDetailsBySapOrderNo/${sapOrderNo}`);
         
      }

      public fetchStatgingTablePicklistDetailsByIsOrderFullfilled(isOrderFulfilled: number){
        return this.http.get<StagingTablePicklistDetailsModel[]>(
            `${BASE_URL}StagingTablePicklistDetails/fetchStagingTablePickListByIsOrderFullfilled/${isOrderFulfilled}`
        );
      }

      public updateStagingTableListByIsOrderFullfilled(isOrderFulfilled: number) {
        return this.http.post<StagingTablePicklistDetailsModel[]>(`${BASE_URL}StagingTablePicklistDetails/updateStagingTablePickListByIsOrderFullfilled/${isOrderFulfilled}`, {
    });
      }
      public updateAllMaterialBarcode(materialCode : string){
      return this.http.put<StagingTablePicklistDetailsModel>(`${BASE_URL}StagingTablePicklistDetails/updateMaterialBarcode/${materialCode}`, {
        observe: 'response'
      });
      }
     


}