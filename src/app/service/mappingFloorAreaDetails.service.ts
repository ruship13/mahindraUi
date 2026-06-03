import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MappingFloorAreaDetailsModel } from "../models/mappingFloorAreaDetails.model";
import { BASE_URL } from "../utils/const";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MappingFloorAreaDetailsService {


    constructor(private http: HttpClient) { }
    public fetchMappingFloorAreaDetails() {
        return this.http.get<MappingFloorAreaDetailsModel[]>(`${BASE_URL}mappingFloorAreaDetails/fetchAllMappingFloorAreaDetails`)

    }
    public fetchMappingFloorAreaDetailsByAreaId(areaId: number) {
        return this.http.get<MappingFloorAreaDetailsModel[]>(`${BASE_URL}mappingFloorAreaDetails/fetchMappingFloorAreaByAreaId/${areaId}`)
    }

    public updatAllMappingFloorAreaDetails(mappingObj: MappingFloorAreaDetailsModel) {
        return this.http.put<MappingFloorAreaDetailsModel[]>(`${BASE_URL}mappingFloorAreaDetails/updateMappingFloorAreaDetails`, mappingObj)
    }
    public updatAllLockFloorAreaDetails(details: MappingFloorAreaDetailsModel) {
        return this.http.put<MappingFloorAreaDetailsModel[]>(`${BASE_URL}mappingFloorAreaDetails/updateLockFloorAreaDetails`, details)
    }
    public updatAllMappingFloorAreaDetailsByareaId(infeedIsActive: number, outfeedIsActive: number, areaId: number) {
        return this.http.put<MappingFloorAreaDetailsModel[]>(`${BASE_URL}mappingFloorAreaDetails/updateMappingFloorAreaDetailsByareaId/${infeedIsActive}/${outfeedIsActive}/${areaId}`, {
        });
    }

    // fetchMappingFloorAreaDetailsByAreaIdAndFloorName( areaId: number,floorName: string) {
    //     console.log("get.....")
    //     return this.http.get<MappingFloorAreaDetailsModel>(`${BASE_URL}mappingFloorAreaDetails/fetchMappingFloorAreaDetailsByAreaIdAndFloorName/${areaId}/${floorName}`)

    // }

    fetchMappingFloorAreaDetailsByAreaIdAndFloorName(areaId: number, floorName: string): Observable<MappingFloorAreaDetailsModel> {
        const url = `${BASE_URL}mappingFloorAreaDetails/fetchMappingFloorAreaDetailsByAreaIdAndFloorName/${areaId}/${floorName}`;
        return this.http.get<MappingFloorAreaDetailsModel>(url);
    }
}