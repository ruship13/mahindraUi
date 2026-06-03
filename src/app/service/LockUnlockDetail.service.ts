import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";
import { MasterPositionDetailsModel } from "../models/masterpositionDetails.model";

@Injectable({
    providedIn: "root"
})
export class LockUnlockCellDetailsService {

    constructor(private http: HttpClient) { }

    public fetchAllCurrentDateLockDetails() {
        return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}lockDetails/findByLockReport`);
    }
   

    public fetchLockCellDetailsByAllFilters( 
        areaId: number, floorId: number) {
        return this.http.get<MasterPositionDetailsModel[]>(`${BASE_URL}lockDetails/findByAllFilters/${areaId}/${floorId}`);
    }
    

}