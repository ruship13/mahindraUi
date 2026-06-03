import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QRCodeDetailsModel } from "../models/qrCodeDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class QRCodeDetailsService{
    constructor(private http:HttpClient){}


    public fetchAllQRCodeDetails() {
        return this.http.get<QRCodeDetailsModel[]>(
          `${BASE_URL}qrCodeDetails/fetchAllQRCodeDetails`
        );
      }

    public addQRCodeDetails(addQRCodeDetailsInstnace: QRCodeDetailsModel) {
        return this.http.post<QRCodeDetailsModel>(`${BASE_URL}qrCodeDetails/addQRCodeDetails`, addQRCodeDetailsInstnace, {
            observe: 'response'
        });
    }
    public saveData(data:any){
        return this.http.post(`${BASE_URL}qrCodeDetails/addQRCodeDetails`,data);
        
    }

}