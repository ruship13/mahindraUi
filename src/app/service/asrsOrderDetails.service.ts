import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsrsOrderDetailsModel } from "../models/asrsOrderDetails.model";
import { BASE_URL } from "../utils/const";


@Injectable({
    providedIn: 'root',
  })
  export class AsrsOrderDetailsService {
    [x: string]: any;
    constructor(private http: HttpClient) {}
  
  
  public fetchAllAsrsOrderDetails(){
    return this.http.get<AsrsOrderDetailsModel>(
        `${BASE_URL}asrsOrderDetails/fetchCurrentDayAsrsOrderDetails`
    );
}
}