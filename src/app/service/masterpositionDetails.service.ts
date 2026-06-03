import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterPositionDetailsModel } from "../models/masterpositionDetails.model";
import { BASE_URL } from "../utils/const";
import { MasterRackPositionModel } from "../models/masterRackPosition.model";
import { Observable } from "rxjs";
import { DuplicatePalletCodeDetails } from "../models/DuplicatePalletCodeDetails.model";

@Injectable({
  providedIn: 'root'
})
export class MasterPositionDetailsService {
  findByPositionName(destLocation: string) {
    throw new Error('Method not implemented.');
  }


  constructor(private http: HttpClient) { }
  public fetchMasterPositionDetailsByPositionName(positionName: string) {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/fetchAllMasterPositionDetailsByPositionName/${positionName}`)
  }
  public fetchMasterPositionDetailsByPositionId(positionId: number) {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/fetchAllMasterPositionDetailsByPositionId/${positionId}`)
  }
  public fetchMasterPositionDetailsByPositionIdAndPositionName(positionId: number, positionName: string) {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/fetchAllMasterPositionDetailsByPositionIdAndPositionName/${positionId}/${positionName}`)
  }
  public fetchMasterPositionDetailsByPositionNameAndPositionIsAllocatedAndEmptyPalletPositionAndPositionIsActive(positionName: string, positionIsAllocated: number, emptyPalletPosition: number, positionIsActive: number) {

    return this.http.get<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/fetchAllMasterPositionDetailsByPositionNameAndPositionIsAllocatedAndEmptyPalletPositionAndPositionIsActive/${positionName}/${positionIsAllocated}/${emptyPalletPosition}/${positionIsActive}`)
  }
  public fetchMasterPositionDetails() {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/fetchAllMasterPositionDetails`)
  }
  fetchMasterPositionDetailsByAreaIdAndFloorId(areaId: number, floorId: number) {
    return this.http.get<MasterRackPositionModel[]>(`${BASE_URL}masterPositionDetails/fetchMasterPositionDetailsByFloorId/${areaId}/${floorId}`);
  }
  fetchAllMasterPositionDetailsByAreaId(areaId: number) {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/fetchMasterPositionDetailsByAreaId/${areaId}`);
  }


  public updatIsManualDispatchInMasterPositionDetails(positionId: number) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/updatIsManualDispatchInMasterPositionDetails/${positionId}`, { observe: 'response' });
  }
  public lockSelectedPositionIsActive(positionId: number, reason: string, comment: string) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/lockSelectedPositionIsActive/${positionId}/${reason}/${comment}`, { observe: 'response' });
  }
  //   for delete data
  public UpdatePositionIsEmpty(positionId: number) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/UpdatePositionIsEmpty/${positionId}`, { observe: 'response' });
  }

  public lockAllSelectedPositionIsActive(positionId: number) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/lockSelectedPositionIsActive/${positionId}`, { observe: 'response' });
  }
  public unlockSelectedPositionIsActive(positionId: number, reason: string, comment: string) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/unlockSelectedPositionIsActive/${positionId}/${reason}/${comment}`, { observe: 'response' });
  }

  public updatePositionIsAllocated(positionID: number) {
    return this.http.put<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/updatePositionDetailsIsAllocated/${positionID}`, { observe: Response });
  }


  public updatePositionDetailsIsAllocatedAndEmpty(positionId: number) {
    console.log("positionId");
    console.log(positionId);
    return this.http.put<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/updatePositionDetailsIsAllocated/${positionId}`, { observe: 'response' });
  }


  findEmptyPositionAlarm(): Observable<HttpResponse<MasterPositionDetailsModel>> {
    return this.http.get<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/findEmptyPositionAlarm`, { observe: 'response' });
  }

  getAlarm(): Observable<HttpResponse<MasterPositionDetailsModel>> {
    return this.http.get<MasterPositionDetailsModel>(`${BASE_URL}masterPositionDetails/getAlarmAudio`, { observe: 'response' });
  }


  fetchAlarmDetails(): Observable<MasterPositionDetailsModel[]> {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/getAlarmData`);
  }


  public fetchAllMismatchCell(): Observable<HttpResponse<MasterPositionDetailsModel[]>> {
    return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}masterPositionDetails/getMismatchCellNames`, { observe: 'response' })
  }


  public fetchDuplicatePalletCode(): Observable<HttpResponse<DuplicatePalletCodeDetails[]>> {

    return this.http.get<DuplicatePalletCodeDetails[]>( `${BASE_URL}masterPositionDetails/findDuplicatePalletCode`, { observe: 'response' }
    );
  }
}