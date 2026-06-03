import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BufferDetailsModel } from "../models/bufferDetails.model";
import { BASE_URL } from "../utils/const";

export interface FetchAllBufferPalletStockDetailsRequestPage {
    page: number;
    size: number;

}

@Injectable({
    providedIn: 'root',
})
export class BufferDetailsService {

    constructor(private http: HttpClient) { }

    fetchAllBEVBufferPalletStockDetails(request: FetchAllBufferPalletStockDetailsRequestPage): Observable<any> {
        const params = {
            page: request.page.toString(),
            size: request.size.toString(),
        };

        return this.http.get<BufferDetailsModel[]>(
            `${BASE_URL}bufferDetails/findBufferPalletBEV`,
            { params }
        );
    }



    fetchAllS230BufferPalletStockDetails(request: FetchAllBufferPalletStockDetailsRequestPage): Observable<any> {
        const params = {
            page: request.page.toString(),
            size: request.size.toString(),
        };

        return this.http.get<BufferDetailsModel[]>(
            `${BASE_URL}bufferDetails/findBufferPalletS230`,
            { params }
        );
    }





    

}