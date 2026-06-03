import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CurrentPalletStockDetailsModel } from "../models/currentPalletStockDetails.model";
import { BASE_URL } from "../utils/const";
import { RegisterResponse } from "../models/responseHandler.model";

import { Observable } from "rxjs";
import { MannualRetrivalOrderModel } from "../models/mannual-retrival-order.model";
import { MasterProductDetailsModel } from "../models/masterProductDetails.model";

export interface FetchAllCurrentPalletStockDetailsRequestPage {
  page: number;
  size: number;

}
export interface FetchAllCurrentPalletStockDetailsByQualityStausRequests {
  qualityStatus: string;
  page: number;
  size: number;
}
@Injectable({
  providedIn: 'root',
})
export class CurrentPalletStockDetailsService {
  [x: string]: any;



  constructor(private http: HttpClient) { }
  //   fetchPagedCurrentPalletStockDetails(page: number, size: number): Observable<CurrentPalletStockDetailsModel[]> {

  //     const url = `${BASE_URL}/fetchAllCurrentPalletStockDetails?page=${page}&size=${size}`;
  //     return this.http.get<CurrentPalletStockDetailsModel[]>(url);
  // }

  fetchAllCurrentPalletStockDetails(request: FetchAllCurrentPalletStockDetailsRequestPage): Observable<any> {
    const params = {
      page: request.page.toString(),
      size: request.size.toString(),
    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/data`,
      { params }
    );
  }

  fetchAllCurrentPalletStockDetailsBev(request: FetchAllCurrentPalletStockDetailsRequestPage): Observable<any> {
    const params = {
      page: request.page.toString(),
      size: request.size.toString(),
    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/findByBEV`,
      { params }
    );
  }

  fetchAllCurrentPalletStockDetailsS230(request: FetchAllCurrentPalletStockDetailsRequestPage): Observable<any> {
    const params = {
      page: request.page.toString(),
      size: request.size.toString(),
    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/findByS230`,
      { params }
    );
  }

  fetchAllEmptyPalletList(request: FetchAllCurrentPalletStockDetailsRequestPage): Observable<any> {
    const params = {
      page: request.page.toString(),
      size: request.size.toString(),
    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/findEmptyPalletList`,
      { params }
    );
  }

  fetchAllEmptyPalletListS230(request: FetchAllCurrentPalletStockDetailsRequestPage): Observable<any> {
    const params = {
      page: request.page.toString(),
      size: request.size.toString(),
    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/findEmptyPalletListS230`,
      { params }
    );
  }

  fetchAllCurrentPalletStockDetailsBEVOKByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequests): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/BevOkMaterialByPage`,
      { params }
    );


  }
  fetchAllCurrentPalletStockDetailsBEVNOKByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequests): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/BevNOkMaterialByPage`,
      { params }
    );


  }

  fetchAllCurrentPalletStockDetailsS230OKByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequests): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/S230OkMaterialByPage`,
      { params }
    );


  }

  fetchAllCurrentPalletStockDetailsS230NOKByQualityStatus(request: FetchAllCurrentPalletStockDetailsByQualityStausRequests): Observable<any> {
    const params = {
      qualityStatus: request.qualityStatus,
      page: request.page.toString(),
      size: request.size.toString(),

    };

    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/S230NOkMaterialByPage`,
      { params }
    );


  }

  findBEVCurrentStockCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}currentPalletStockDetails/findBEVCurrentStockDetails`);
  }

  findS230CurrentStockCount(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}currentPalletStockDetails/findS230CurrentStockDetails`);
  }

  // public deleteCurrentStockDetailsByPositionId(positionId: number) {


  //   return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/deleteCurrentStockDetailsByPositionId/${positionId}`, {
  //     observe: 'response'
  //   });
  // }

  public deleteCurrentStockDetailsByPositionId(positionId: number): Observable<any> {
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/deleteCurrentStockDetailsByPositionId/${positionId}`, {
      observe: 'response'
    });
  }
  public findByPalletCode(palletCode: string) {

    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/fetchAllCurrentPalletStockDetailsByPalletCode/${palletCode}`);
  }
  public addCurrentPalletStockDetails(palletObj: CurrentPalletStockDetailsModel) {
    return this.http.post<RegisterResponse>(`${BASE_URL}currentPalletStockDetails/addCurrentPalletStockDetails`, palletObj, {

    });
  }


  public fetchCurrentPalletStockDetailsByAllFilters(startDateTime: string, endDateTime: string, productVariantCode: string, floorName: string, areaName: string, productName: string, palletStatusname: string): Observable<any> {
    // const params = {
    //   page: request.page.toString(),
    //   size: request.size.toString(),
    // };
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByAllFiltersDetails/${startDateTime}/${endDateTime}/${productVariantCode}/${floorName}/${areaName}/${productName}/${palletStatusname}`);
  }

  public editCurrentPalletStockDetails(currentPalletStockDetailsId: number, object2: CurrentPalletStockDetailsModel) {
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/update/${currentPalletStockDetailsId}`, object2, {
      observe: 'response'
    })
  }
  public fetchCurrentPalletStockDetails() {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchAllCurrentPalletStockDetails`);
  }
  public fetchCurrentPalletStockDetailsByPalletCode(palletCode: string) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchAllCurrentPalletStockDetailsByPalletCode/${palletCode}`);

  }
  public fetchCurrentPalletStockDetailsBySerialNumber(serialNumber: number) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchAllCurrentPalletStockDetailsBySerialNumber/${serialNumber}`);

  }
  
  public fetchAllRemainingQty(quantity: number) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchRemainingAndPartialQtyByQuantity/${quantity}`);

  }


  // public updateCurrentPalletStockDetailsUnloadingOperation(palletCode: string, productVariantCode: string, quantity: number, binLocation: string, userId: number, userName: String) {
  //   return this.http.post<RegisterResponse>(
  //     `${BASE_URL}currentPalletStockDetails/updateCurrentPalletStockDetailsUnloadingOperation/${palletCode}/${productVariantCode}/${quantity}/${binLocation}/${userId}/${userName}`,
  //     { observe: 'response' }
  //   );
  // }
  // public deleteAllCurrentPalletStockDetailsUnloadingOperation(productVariantCode:string){
  //   return this.http.put<CurrentPalletStockDetailsModel[]>(`http://localhost:8080/deleteCurrentPalletStockDetailsUnloadingOperation/${productVariantCode}`, {
  //     observe: 'response'
  //   });
  //   }
  public deleteAllCurrentPalletStockDetailsUnloadingOperationByCurrentPalletStockDetailsId(currentPalletStockDetailsId: number) {
    return this.http.put<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/deleteCurrentPalletStockDetailsUnloadingOperationByCurrentPalletStockDetailsId/${currentPalletStockDetailsId}`, {
      observe: 'response'
    });
  }

  public deleteAllCurrentPalletStockDetailsUnloadingOperationByProductVariantCodeAndPalletCodeAndCurrentPalletStockDetailsId(productVariantCode: string, palletCode: string, currentPalletStockDetailsId: number) {
    return this.http.put<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/deleteCurrentPalletStockDetailsUnloadingOperationByProductVariantCodeAndPalletCodeAndCurrentPalletStockDetailsId/${productVariantCode}/${palletCode}/${currentPalletStockDetailsId}`, {
      observe: 'response'
    });
  }
  public fetchAllCurrentPalletStockDetailsByPositionName(positionName: string) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchCurrentPalletStockDetailsByPositionName/${positionName}`);

  }
  public fetchCurrentPalletStockDetailsbyAreaName(areaName: string) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(
      `${BASE_URL}currentPalletStockDetails/fetchAllCurrentPalletStockDetailsbyAreaName/${areaName}`);

  }
  public findAllByPositionId(positionId: number) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/fetchByPositionId/${positionId}`);
  }

  public updateAllCurrentStockDetails(curretnStockDetailsobj: CurrentPalletStockDetailsModel) {
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/updateCurrentStockDetails`, curretnStockDetailsobj, { observe: 'response' });

  }
  public deleteAllCurrentPalletStockDetailsByCurrentStockId(currentPalletStockDetailsId: number) {

   
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/deleteCurrentPalletStockDetailsByCurrentStockId/${currentPalletStockDetailsId}`, { observe: 'response' });

  }
  public updateCurrentStockDetailsByPositionId(quantity: number, palletCode: string, productVariantCode: string, positionId: number, editCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel) {


    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/updateCurrentStockDetailsByPositionId/${quantity}/${palletCode}/${productVariantCode}/${positionId}`, editCurrentStockDetailsForSelectedIdInstance, { observe: 'response' });

  }
  public updateCurrentStockData(currentStockObj: CurrentPalletStockDetailsModel): Observable<any> {
    return this.http.put<RegisterResponse>(`${BASE_URL}currentPalletStockDetails/updateCurrentStockDetails`, currentStockObj, { observe: 'response' });
  }

  public updateCurrentStockDataByPositionId(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}currentPalletStockDetails/addCurrentStockDataByPositionId`, dispatchCurrentStockDetailsInstance, { observe: 'response' });
  }

  public deleteCurrentStockDetailsDataByPositionId(positionId: number) {
    return this.http.put<CurrentPalletStockDetailsModel>(`${BASE_URL}deleteCurrentStockDetailsByPositionId/${positionId}`, {
      observe: 'response'
    });
  }
  // addOrUpdateMasterPalletInformation(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel): Observable<any> {
  //   return this.http.post(`${BASE_URL}currentPalletStockDetails/addOrUpdateMasterPalletInformation`, dispatchCurrentStockDetailsInstance);
  // }

  addOrUpdateMasterPalletInformation(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel): Observable<any> {
    return this.http.post<RegisterResponse>(`${BASE_URL}currentPalletStockDetails/addOrUpdateMasterPalletInformation`, dispatchCurrentStockDetailsInstance);
  }



  // findBySerialNumberBetween(serialNumber1: number, serialNumber2: number,dispatchOrderNumber:string,shiftId:number,shiftName:string): Observable<CurrentPalletStockDetailsModel[]> {

  //   return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween2/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}`);

  // }

  // findBySerialNumberBetween(serialNumber1: number, serialNumber2: number, dispatchOrderNumber: string, shiftId: number, shiftName: string): Observable<HttpResponse<CurrentPalletStockDetailsModel[]>> {
  //   return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}`, { observe: 'response' });
  // }


  // findBySerialNumberBetween1(serialNumber1: number, serialNumber2: number, dispatchOrderNumber: string, shiftId: number, shiftName: string): Observable<HttpResponse<CurrentPalletStockDetailsModel[]>> {
  //   return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween1/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}`, { observe: 'response' });
  // }






  // public findBySerialNumberBetween(mannualRetrivalOrderModel: MannualRetrivalOrderModel) {


  //   return this.http.post<HttpResponse<RegisterResponse>>(`${BASE_URL}generateManualRetrievalOrder/findByserialNumberBetween1`, mannualRetrivalOrderModel);
  // }



  //   public findBySerialNumberBetween1(currentPalletStockDetailsModel: CurrentPalletStockDetailsModel) {


  //     return this.http.post<HttpResponse<RegisterResponse>>(`${BASE_URL}generateManualRetrievalOrder/findByserialNumberBetween2`, currentPalletStockDetailsModel);
  // }




  // findBySerialNumberBetween(serialNumber1: number, serialNumber2: number,dispatchOrderNumber:string,shiftId:number,shiftName:string): Observable<CurrentPalletStockDetailsModel[]> {

  //   return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}`);

  // }



  // findBySerialNumberBetween1(serialNumber1: number, serialNumber2: number,dispatchOrderNumber:string,shiftId:number,shiftName:string): Observable<CurrentPalletStockDetailsModel[]> {

  //   return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween1/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}`);

  // }



  findBySerialNumberBetween(serialNumber1: number, serialNumber2: number, dispatchOrderNumber: string, shiftId: number, shiftName: string, productName: string,orderBatchNumber:string): Observable<any> {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}/${productName}/${orderBatchNumber}`);
  }

  findBySerialNumberBetween1(serialNumber1: number, serialNumber2: number, dispatchOrderNumber: string, shiftId: number, shiftName: string,productName: string,orderBatchNumber:string): Observable<any> {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/findByserialNumberBetween1/${serialNumber1}/${serialNumber2}/${dispatchOrderNumber}/${shiftId}/${shiftName}/${productName}/${orderBatchNumber}`);
  }



  public validatePalletCode(palletCode: string) {
    return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/getPalletCode/${palletCode}`, { observe: 'response' });
  }

  public validateProductName(productName: string) {
    return this.http.get<MasterProductDetailsModel[]>(`${BASE_URL}currentPalletStockDetails/getProductName/${productName}`, { observe: 'response' });
  }


public findAllDetails(){
  return this.http.get<CurrentPalletStockDetailsModel[]>(`${BASE_URL}/currentPalletStockDetails/findAllDetails`);
}
 

}


