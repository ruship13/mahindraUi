import { HttpClient, HttpResponse } from "@angular/common/http";
import { RegisterResponse } from "../models/responseHandler.model";
import { BASE_URL } from "../utils/const";
import { MannualRetrivalOrderModel } from "../models/mannual-retrival-order.model";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { generateRetrivalMissionTypeDetailsModel } from "../models/generateRetrivalMissionTypeDetails.model";
import { MesConnectionDetails } from "../models/MesConnectionDetails.model";
import { MesDispatchControl } from "../models/MesDispatchControl.model";
@Injectable({
    providedIn: 'root'
})
export class MannualRetrivalOrderService {


    constructor(private http: HttpClient) {

    }
    updateDispatchStart(engineDispatchScheduleHistoryData: any) {
        return this.http.put<any>(`${BASE_URL}generateManualRetrievalOrder`, engineDispatchScheduleHistoryData);
    }
    updateEngineScheduleIsDispatchStart(data: any): Observable<any> {
        return this.http.put<any>(`${BASE_URL}generateManualRetrievalOrder/updateDispatchButton`, data);
    }

    updateEngineScheduleIsDispatchCancel(data: any): Observable<any> {
        return this.http.put<any>(`${BASE_URL}generateManualRetrievalOrder/updateDispatchCanceled`, data);
    }



    public fetchAllManualDispatchDetails() {
        return this.http.get<MannualRetrivalOrderModel[]>(`${BASE_URL}generateManualRetrievalOrder/getAllMannualDispatchOrderOfCurrentDate`);
    }
    public fetchAllMannualDispatchDetailsForAll() {
        return this.http.get<MannualRetrivalOrderModel[]>(`${BASE_URL}generateManualRetrievalOrder/fetchAllDispatchOrderNumberDetails`);
    }
    // public addMannualRetrivalDetails(mannualRetrivalOrderModel: MannualRetrivalOrderModel) {
    //     return this.http.post<RegisterResponse>(`${BASE_URL}generateManualRetrievalOrder/addMannualRetrivalOrder`, mannualRetrivalOrderModel);
    // }

    public addMannualRetrivalDetails(mannualRetrivalOrderModel: MannualRetrivalOrderModel) {
        console.log("get2")
        return this.http.post<HttpResponse<RegisterResponse>>(`${BASE_URL}generateManualRetrievalOrder/addMannualRetrivalOrder`, mannualRetrivalOrderModel);
    }



    public addMannualRetrivalDetails1(mannualRetrivalOrderModel: MannualRetrivalOrderModel) {
        return this.http.post<HttpResponse<RegisterResponse>>(`${BASE_URL}generateManualRetrievalOrder/addMannualRetrivalOrder1`, mannualRetrivalOrderModel);
    }


    public fetchManualDispatchDetailsByAllFilters(cDatetimeStart: string,
        cDatetimeEnd: string, dispatchOrderNumber: string, productVariantCode: string, shiftName: string) {
        return this.http.get<MannualRetrivalOrderModel[]>(`${BASE_URL}generateManualRetrievalOrder/fetchMannualDispatchDetailsByAllFilters/${cDatetimeStart}/${cDatetimeEnd}/${dispatchOrderNumber}/${productVariantCode}/${shiftName}`);
    }



    updateOrderCancelledStatus(dispatchHistoryId: number, isOrderCancelled: number): Observable<any> {
        return this.http.put(`${BASE_URL}generateManualRetrievalOrder/updateOrderCancelledStatus/${dispatchHistoryId}`, isOrderCancelled);
    }

    updateOrderdelete(dispatchHistoryId: number, isOrderDeleted: number): Observable<any> {
        return this.http.put(`${BASE_URL}generateManualRetrievalOrder/updateOrderIsDeleted/${dispatchHistoryId}`, isOrderDeleted);
    }




    updateEngineScheduleIsDispatchTriggered(data: any): Observable<any> {
        return this.http.put<any>(`${BASE_URL}generateManualRetrievalOrder/updateDispatchTriggered`, data);
    }



    public fetchAllMissionTypeData() {
        return this.http.get<generateRetrivalMissionTypeDetailsModel[]>(`${BASE_URL}generateManualRetrievalOrder/fetchAllMissionTypeData`);
    }

    public fetchMesConnectionDetails() {
        return this.http.get<MesConnectionDetails[]>(`${BASE_URL}mesConnectionDetails/fetchMesConnectionDetails`);
    }

    public getMesControlMode() {
        return this.http.get<MesDispatchControl>(`${BASE_URL}mesDispatchControl/fetchMesDispatchControlDetails`);
    }

    public updateMesReadMode(data: any): Observable<any> {

   
        return this.http.put<any>(`${BASE_URL}mesDispatchControl/updateMesDispatchControl`, data);
    }

    public deleteManualOrderByCurrentDate(): Observable<any> {
        return this.http.put<any>(`${BASE_URL}generateManualRetrievalOrder/updateCurrentDateRetrivalOrderIsDeleted`, null);
    }

    // public updateMesOrderDelete(data: any): Observable<any> {
    //     return this.http.put<any>(`${BASE_URL}mesDispatchControl/updateMesDispatchControl`, data);
    // }

}
