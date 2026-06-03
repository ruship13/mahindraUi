import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterPalletInformationModel } from "../models/masterPalletInformation.model";
import { BASE_URL } from "../utils/const";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MasterPalletInformationService {

  constructor(private http: HttpClient) {

  }
  public fetchPalletInformationIdDesc(palletInformationId: number) {

    return this.http.get<MasterPalletInformationModel[]>(`${BASE_URL}masterPalletInformationDetails/fetchPalletInformationIdDesc/${palletInformationId}`);
  }
  public updatePalletInformationDetailsByPalletStatusName(palletStatusId: number, palletStatusName: string, palletCode: string, stationWorkdone: number) {
    return this.http.put<MasterPalletInformationModel[]>(`${BASE_URL}masterPalletInformationDetails/updatePalletInformationDetailsByPalletStatusName/${palletStatusId}/${palletStatusName}/${palletCode}/${stationWorkdone}`, {

    });
  }

  public updatePalletInformationDetailsByStationWorkdone(stationWorkdone: number, palletCode: string) {
    return this.http.put<MasterPalletInformationModel[]>(`${BASE_URL}masterPalletInformationDetails/updatePalletInformationDetailsByStationWorkdone/${stationWorkdone}/${palletCode}`, {

    });
  }


  addPalletInformationDetailsFillData(palletCode: String, productName: String, productVariantCode: String, productVariantName: String,
    location: String, batchNumber: String, modelNumber: String, quantity: number, userId: number, userName: String) {
    return this.http.post<MasterPalletInformationModel>(`${BASE_URL}addMasterPalletInformationFrom2DLayout/${palletCode}/${productName}/${productVariantCode}/${productVariantName}
            /${location}/${batchNumber}/${modelNumber}/${quantity}/${userId}/${userName}`, { observe: 'response' });
  }

  addOrUpdateMasterPalletInformation(masterPalletInfo: MasterPalletInformationModel): Observable<MasterPalletInformationModel> {
   
    return this.http.put<MasterPalletInformationModel>(`${BASE_URL}masterPalletInformationDetails/addMasterPalletInformation`, masterPalletInfo);
  }
}