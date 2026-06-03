import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterProductDetailsModel } from "../models/masterProductDetails.model";
import { RegisterResponse } from "../models/responseHandler.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn:'root'
})
export class MasterProductDetailsService {

    constructor(private http:HttpClient){}

    public fetchAllMasterProductDetails() {
        return this.http.get<MasterProductDetailsModel[]>(`${BASE_URL}masterProductDetails/fetchAllMasterProductDetails`);
    }


    public deleteProductDetails(productId: number) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterProductDetails/deleteMasterProductDetails/${productId}`, {
            observe: 'response'
        });
    }

    
    public updateProductDetails(productObject2: MasterProductDetailsModel) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterProductDetails/updateMasterProductDetails`,productObject2);
    }
    

    public addProductDetails(productObject: MasterProductDetailsModel) {
        return this.http.post<RegisterResponse>(`${BASE_URL}masterProductDetails/create`, productObject);
    }
}
