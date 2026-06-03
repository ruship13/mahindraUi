import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StackerPositionDetailsModel } from "../models/stackerPositionDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class StackerPositionDetailsService{
    constructor(private http: HttpClient){

    }
    public fetchStackerPositionDetails(){
        return this.http.get<StackerPositionDetailsModel[]>(`${BASE_URL}stackerPositionDetails/fetchAllStckerPositionDetails`);
      }
    }