import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";
import { inventorySummaryDashboardDetailsModel } from "../models/inventorySummaryDashboardDetailsModel.model";
import { Observable } from "rxjs";
import { CurrentPalletStockDetailsModel } from "../models/currentPalletStockDetails.model";



@Injectable({
  providedIn: 'root',
})
export class inventorySummaryReportService {

  constructor(private Http: HttpClient) { }

  // public fetchAllAgeingDaysDetails() {
  //     return this.Http.get<inventorySummaryDashboardDetailsModel[]>(`${BASE_URL}agingDaysReportdetails/findMaterialAboveAgeingDayaCount`);
  // }



  public fetchAllAgeingRangesDetais() {
    return this.Http.get<inventorySummaryDashboardDetailsModel[]>(`${BASE_URL}agingDaysReportdetails/findMaterialAboveAgeingDayaCount`);

  }

  findAgeingDays(): Observable<CurrentPalletStockDetailsModel[]> {
    return this.Http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}agingDaysReportdetails/findAgeingDays`);
  }


  
}
