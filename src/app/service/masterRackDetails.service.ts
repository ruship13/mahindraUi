import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";
import { MasterRackDetailsModel } from "../models/masterRackDetails.model";

@Injectable({
    providedIn: 'root',
})

export class MasterRackDetailsService {



    constructor(private http: HttpClient) { }

    public fetchAllRackDetailsByAreaIdAndFloorId(areaId: number,floorId:number ) {
        return this.http.get<MasterRackDetailsModel[]>(`${BASE_URL}masterRackDetails/fetchByRackDetailsByAreaIdAndFloorId/${areaId}/${floorId}`);
    }

}