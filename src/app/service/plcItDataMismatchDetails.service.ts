import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterPositionDetailsModel } from "../models/masterpositionDetails.model";
import { BASE_URL } from "../utils/const";
import { MasterRackPositionModel } from "../models/masterRackPosition.model";
import { Observable } from "rxjs";
import { PlcItDataMismatchModel } from "../models/plcItDataMismatchDetails.model";
import { RegisterResponse } from "../models/responseHandler.model";
import { CurrentPalletStockDetailsModel } from "../models/currentPalletStockDetails.model";

@Injectable({
    providedIn: 'root'
})
export class PlcItDataMismatchDetailsService {



    constructor(private http: HttpClient) { }


    addPlcItData(plcitData: any): Observable<HttpResponse<PlcItDataMismatchModel>> {
        return this.http.post<PlcItDataMismatchModel>(`${BASE_URL}plcItDataMismatch/addPlcItData`, plcitData, { observe: 'response' });
    }

    public fetchPlcItDataMismatchDetails() {
        return this.http.get<PlcItDataMismatchModel[]>(`${BASE_URL}plcItDataMismatch/findByIsDataUpdated`);
    }


    addOrUpdateMasterPalletInformation(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel): Observable<any> {
        return this.http.post<RegisterResponse>(`${BASE_URL}plcItDataMismatch/addOrUpdateMasterPalletInformationfromDataMismatch`, dispatchCurrentStockDetailsInstance);
    }


    public fetchDataMismatchDetailsByAllFilters(plcItDataMismatchStartCdatetime: string, plcItDataMismatchEndCdatetime: string) {
        return this.http.get<PlcItDataMismatchModel[]>(`${BASE_URL}plcItDataMismatch/fetchDataMismatchDetailsByAllFilters/${plcItDataMismatchStartCdatetime}/${plcItDataMismatchEndCdatetime}`);
    }

}