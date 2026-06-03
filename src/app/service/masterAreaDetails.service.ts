import { HttpClient } from "@angular/common/http"

import { Injectable } from "@angular/core"

import { BASE_URL } from "../utils/const"
import { MasterAreaDetailsModel } from "../models/masterAreaDetails.model"








@Injectable({
    providedIn: 'root'
})
export class MasterAreaDetailsService {
    


    constructor(private http: HttpClient) { }
    public fetchAllAreaDetails() {
        return this.http.get<MasterAreaDetailsModel[]>(`${BASE_URL}masterAreaDetails/fetchAllAreaDetails`)
    }
    public fetchAreaDetailsDetailsByAreaId(areaId: number) {
        return this.http.get<MasterAreaDetailsModel[]>(`${BASE_URL}masterAreaDetails/fetchAllAreaDetailsDetailsByAreaId/${areaId}`)
    }
  
    
  
}