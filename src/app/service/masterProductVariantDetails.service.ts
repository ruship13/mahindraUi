import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterProductVariantDetailsModel } from "../models/masterProductVariantDetails.model";
import { BASE_URL } from "../utils/const";
import { RegisterResponse } from "../models/responseHandler.model";
import { Observable } from "rxjs";
export interface FetchAllMasterProductVariantDetailsRequestPage {
    page: number;
    size: number;
  
  }
@Injectable({
    providedIn:'root'
})
export class MasterProductVariantDetailsService{

    constructor(private http:HttpClient){}

    public fetchAllMasterProductVariantDetails() {
        return this.http.get<MasterProductVariantDetailsModel[]>(`${BASE_URL}masterProductVariantDetails/fetchAllMasterProductVariantDetails`);
    }


    fetchAllMasterProductVariantDetailsList(request: FetchAllMasterProductVariantDetailsRequestPage): Observable<any> {
        const params = {
          page: request.page.toString(),
          size: request.size.toString(),
        };
    
        return this.http.get<MasterProductVariantDetailsModel[]>(
          `${BASE_URL}masterProductVariantDetails/fetchAllMasterProductVariantDetails`,
          { params }
        );
      }
    public deleteProductVariantDetails(productVariantId: number) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterProductVariantDetails/deleteMasterProductVariantDetails/${productVariantId}`, {
            observe: 'response'
        });
    }

    public updateProductVaraintDetails(productObject2: MasterProductVariantDetailsModel) {
        return this.http.put<RegisterResponse>(`${BASE_URL}masterProductVariantDetails/updateMasterProductVariantDetails`,productObject2);
    }

        public addProductVariantDetails(productObject: MasterProductVariantDetailsModel) {
            return this.http.post<RegisterResponse>(`${BASE_URL}masterProductVariantDetails/addMasterProductVariantDetails`, productObject);
        }
}