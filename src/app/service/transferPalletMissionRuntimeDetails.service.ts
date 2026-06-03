import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TransferPalletMissionDetailsModel } from "../models/transferPalletMissionDetails.model";
import { BASE_URL } from "../utils/const";
import { TransferPalletMissionRuntimeDetailsModel } from "../models/transferPalletMissionRuntimeDetails.model";

@Injectable({
    providedIn:"root"
})
export class TransferPalletMissionRuntimeDetailsService{
    constructor(private http:HttpClient){}

    public fetchTransferPalletMissionRuntimeDetails(){
        return this.http.get<TransferPalletMissionRuntimeDetailsModel[]>(`${BASE_URL}transferPalletmissionruntimedetails/fetchTransferPalletMissionStatusRuntimeDetails`);
    }
    public fetchAllTransferPalletMissionDetailsDetails() {
        return this.http.get<TransferPalletMissionRuntimeDetailsModel[]>(`${BASE_URL}transferPalletmissionruntimedetails/fetchAllTransferPalletMissionDetails`);
    }
    public updateTransferPalletMissionRuntimeDetailsDetails(palletMissionObj: TransferPalletMissionRuntimeDetailsModel) {
        return this.http.put<TransferPalletMissionRuntimeDetailsModel[]>(`${BASE_URL}transferPalletmissionruntimedetails/updatePalletMissionRuntimeDetailsDetails`, palletMissionObj);
    }

    public fetchAllTransferPalletMissionRuntimeDetailsByCdateTime() {
        return this.http.get<TransferPalletMissionRuntimeDetailsModel[]>(`${BASE_URL}transferPalletmissionruntimedetails/getAllTransferPalletMissionRuntimeDetails`);
    }

    public fetchTransferPalletMissionRuntimeDetailsByAllFilters(cDatetimeStart: string,
        cDatetimeEnd: string, palletCode: string, productVariantCode: string) {
        return this.http.get<TransferPalletMissionRuntimeDetailsModel[]>(`${BASE_URL}transferPalletmissionruntimedetails/fetchTransferPalletMissionRuntimeDetailsByAllFilters/${cDatetimeStart}/${cDatetimeEnd}/${palletCode}/${productVariantCode}`);
    }
}
