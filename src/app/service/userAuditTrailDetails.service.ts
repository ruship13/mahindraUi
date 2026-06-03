import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserAuditTrailDetailsModel } from "../models/userAuditTrailDetails.model";
import { BASE_URL } from "../utils/const";
import { LockUnlockDetailModel } from "../models/lockUnlockDetails.model";

@Injectable({
    providedIn: 'root'
})
export class UserAuditTrailDetailsService {


    constructor(private http: HttpClient) { }
    
   
    public fetchAllUserAuditTrailDetails(){
        return this.http.post<UserAuditTrailDetailsModel[]>(`${BASE_URL}auditTrailDetails/fetchAllUserAuditTrailDetails`,{observe:'response'});
    
    }
    public addUserAuditTrailDetails(operatorsAction:any,positionId:number,reason:string,field:string,beforeValue:any,afterValue:any,userName:string){
        return this.http.post<UserAuditTrailDetailsModel[]>(`${BASE_URL}auditTrailDetails/addPositionLockUnLockDeleteReasonInUserAuditTrailReport/${operatorsAction}/${positionId}/${reason}/${field}/${beforeValue}/${afterValue}/${userName}`,{observe:'response'});
    
    }
       public fetchLatestLockreasonByPosition(position: string) {
            return this.http.get<LockUnlockDetailModel[]>(`${BASE_URL}auditTrailDetails/findLatestLock/${position}`);
        }
    
}