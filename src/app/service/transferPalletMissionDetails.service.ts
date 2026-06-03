import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TransferPalletMissionDetailsModel } from "../models/transferPalletMissionDetails.model";
import { BASE_URL } from "../utils/const";
import { RegisterResponse } from "../models/responseHandler.model";

@Injectable({
  providedIn: 'root'
})
export class TransferPalletMissiontDetailsService {


  constructor(private http: HttpClient) { }

  // public addAllPalletMovementDetailsInTransferPalletMissionDetails(palletMovementMissionDetailsInstance:TransferPalletMissionDetailsModel){
  //     return this.http.post<TransferPalletMissionDetailsModel>(`${BASE_URL}transferPalletMissionDetails/addPalletMovementDetailsInTransferPalletMissionDetails`,palletMovementMissionDetailsInstance,{observe:'response'});

  // }

  public addAllPalletMovementDetailsInTransferPalletMissionDetails(currentPositionName: string, destinationPositionName: string, userId: number, userName: string) {
    return this.http.post<RegisterResponse>(
      `${BASE_URL}transferPalletMissionDetails/addPalletMovementDetailsInTransferPalletMissionDetails/${currentPositionName}/${destinationPositionName}/${userId}/${userName}`,
      { observe: 'response' }
    );
  }


}