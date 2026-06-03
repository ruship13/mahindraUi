import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DashboardDetailsModel } from "../models/dashboardDetails.model";
import { BASE_URL } from "../utils/const";
import { Observable } from "rxjs";
import { InfeedMissionRuntimeDetailsModel } from "../models/infeedMissionRuntimeDetails.model";
import { CurrentPalletStockDetailsModel } from "../models/currentPalletStockDetails.model";
import { OutfeedMissionRuntimeDetailsModel } from "../models/outfeedMissionRuntimeDetails.model";
export interface FetchAllCurrentPalletStockDetailsByQualityStausRequest {
  qualityStatus: string;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardDetailsService {


  constructor(private http: HttpClient) { }


  public fetchAllDashboardDetailsData() {
    return this.http.get<DashboardDetailsModel>(
      `${BASE_URL}dashboardDetails/fetchCurrentDayDashboardDetails`
    );
  }

  fetchAllCurrentPalletStockDetailsByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequest): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}dashboardDetails/OkMaterialByPage`,
      { params }
    );
  }



  fetchAllCurrentPalletStockDetailsByQualityStatusNOK(request: FetchAllCurrentPalletStockDetailsByQualityStausRequest): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}dashboardDetails/NOkMaterialByPage`,
      { params }
    );
  }



  fetchAllCurrentPalletStockDetailsBEVNOKByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequest): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/BevNOkMaterialByPage`,
      { params }
    );


  }
  public getProductionTrendData() {
    return this.http.get<DashboardDetailsModel[]>(`${BASE_URL}dashboardDetails/fetchProductionTrendDetails`);
  }


  public fetchDateTime() {
    return this.http.get<string[]>(`${BASE_URL}dashboardDetails/fetchDateTime`);
  }





  findBEVInfeedDetailsByCurrentDate(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findBEVInfeedDetailsByCurrentDate`);
  }

  findS230InfeedDetailsByCurrentDate(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findS230InfeedDetailsByCurrentDate`);
  }

  findOkCurrentStockByCurrentDate(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findOkCurrentStockByCurrentDate`);
  }

  findOkCurrentStockByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getOkMaterialCurrentStockDetails`);
  }

  findOkCurrentStockBevByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getOkBEVMaterialCurrentStockDetails`);
  }

  findNOkCurrentStockBevByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getNOkBEVMaterialCurrentStockDetails`);
  }
  findNOkCurrentStockS230ByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getNOkS230MaterialCurrentStockDetails`);
  }
  findOkCurrentStockS230ByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getOkS230MaterialCurrentStockDetails`);
  }
  findNOkCurrentStockByTotalCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getNOkMaterialCurrentStockDetails`);
  }
  public fetchBEVOutfeedMissionRuntimeDetails() {
    return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/getBevOutfeedDetailsByDate`);
  }
  public fetchS230OutfeedMissionRuntimeDetails() {
    return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/getS230OutfeedDetailsByDate`);
  }
  findbevOutfeedDetailsByCurrentDate(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findbevOutfeedDetailsByCurrentDate`);
  }

  findTotalOutfeedCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getOutfeedDetailsByDate`);
  }
  findTotalInfeedCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/getInfeedDetailsByDate`);
  }


  findCurrentStockTotalOkCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findOkCurrentStockByCurrentDate`);
  }
  findCurrentStockTotalNokCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findNOkCurrentStockByCurrentDate`);
  }

  findS230OutfeedDetailsByCurrentDate(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findS230OutfeedDetailsByCurrentDate`);
  }
  public fetchBEVInfeedMissionRuntimeDetails() {
    return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/getBevInfeedDetailsByDate`);
  }
  public fetchS230InfeedMissionRuntimeDetails() {
    return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/getS230InfeedDetailsByDate`);
  }

  public fetchOkCurrentStockRuntimeDetails() {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}dashboardDetails/getOkCurrentStockDetails`);
  }

  public fetchNOkCurrentStockRuntimeDetails() {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}dashboardDetails/getNOkCurrentStockDetails`);
  }
  findCurrentStockCountByCDatetime(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findTotalCurrentStockDetails`);
  }
  findEquipmentAlarmHistoryByCDatetime(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findEquipmentAlarmHistoryByCurrentDate`);
  }



  findTotalOrdersCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/totalOrdersCount`);
  }

  findExecutedOrder(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/executedOrder`);
  }

  findopenOrders(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/openOrders`);
  }

  findpercentageOrders(): Observable<string> {
    return this.http.get<string>(`${BASE_URL}dashboardDetails/percentageOrders`);
  }





  getDashboardDetails(): Observable<DashboardDetailsModel> {
    return this.http.get<DashboardDetailsModel>(`${BASE_URL}dashboardDetails/findAllDashboard`);
  }





  public fetchTotalOutfeedMissionRuntimeDetails() {
    return this.http.get<OutfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/TotalOutfeedCountList`);
  }



  public fetchTotalInfeedMissionRuntimeDetails() {
    return this.http.get<InfeedMissionRuntimeDetailsModel[]>(`${BASE_URL}dashboardDetails/TotalInfeedCountList`);
  }




  findAllDashboardTotalOutfeedCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findtotalOutfeedCount`);
  }

  findAllDashboardTotalInfeedCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}dashboardDetails/findtotalInfeedCount`);
  }


  
}