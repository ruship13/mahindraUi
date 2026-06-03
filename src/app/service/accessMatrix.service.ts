import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsrsOrderDetailsModel } from "../models/asrsOrderDetails.model";
import { BASE_URL } from "../utils/const";
import { Observable } from "rxjs";
import { AccessMatrixModel } from "../models/accessMatrix.model";


@Injectable({
    providedIn: 'root',
})
export class AccessMatrixService {
   
    constructor(private http: HttpClient) { }


    public getAllAccessMatrixDetails() {
        return this.http.get<AccessMatrixModel[]>(`${BASE_URL}accessMatrix/fetchAllAccessMatrixDetails`);
    }
 

    updateAccessMatrix(accessMatrix: AccessMatrixModel): Observable<any> {
        return this.http.put<AccessMatrixModel>(`${BASE_URL}accessMatrix/update`, accessMatrix);
      }
}