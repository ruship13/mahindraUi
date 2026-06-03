import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "../utils/const";
import { YokogawaTemperatureDetailsModel } from "../models/yokogawaTemperatureDetails.model";

@Injectable({
    providedIn: 'root'
})
export class YokogawaTemperatureDetailsService {


    constructor(private http: HttpClient) { }
    
public createYokogawaTemperatureDetails(){

    return this.http.get(`${BASE_URL}yokogawaTempDetails/check-connection`,{ responseType: 'text' });
    
}

   
    public fetchAllTemperatureDetails(){
        return this.http.get<YokogawaTemperatureDetailsModel[]>(`${BASE_URL}yokogawaTempDetails/fetchTempDetails`);
    }
  
    public fetchCurrentDateTemperature(){
        return this.http.get<YokogawaTemperatureDetailsModel>(`${BASE_URL}yokogawaTempDetails/currentDateTemp`)
    }
    
}