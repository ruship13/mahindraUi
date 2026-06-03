
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";
import { ViewGenerateRetrivalNonMesAndMesOrderDetails } from "../models/ViewGenerateRetrivalNonMesAndMesOrderDetails.model";

@Injectable({
    providedIn: 'root'
})
export class ViewGenerateRetrivalNonMesAndMesOrderDetailsService {


    constructor(private http: HttpClient) { }


    public fetchAllMESAndNonMesDetails() {
        return this.http.get<ViewGenerateRetrivalNonMesAndMesOrderDetails[]>(`${BASE_URL}ViewMesAndNonMesOrderDetails/getAllMannualDispatchOrderOfMesAndNonMesCurrentDate`);
    }



    public fetchManualDispatchDetailsByAllFilters(cDatetimeStart: string,
        cDatetimeEnd: string, dispatchOrderNumber: string, productVariantCode: string, shiftName: string,orderSourceDetails:string) {
        return this.http.get<ViewGenerateRetrivalNonMesAndMesOrderDetails[]>(`${BASE_URL}ViewMesAndNonMesOrderDetails/fetchMannualDispatchDetailsByAllFilters/${cDatetimeStart}/${cDatetimeEnd}/${dispatchOrderNumber}/${productVariantCode}/${shiftName}/${orderSourceDetails}`);
    }

}