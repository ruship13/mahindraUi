import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuditTrailDetailsModel } from "../models/auditTrailDetails.model";
import { BASE_URL } from "../utils/const";

@Injectable({
    providedIn: 'root'
})

export class AuditTrailDetailsService {

    constructor(private Http: HttpClient) { }

    public fetchAllAuditTrailDetails() {
        return this.Http.get<AuditTrailDetailsModel[]>(`${BASE_URL}auditTrailDetails/findByCdatetime`);
    }

    public fetchAuditTrailDetailsByAllFilters(startDateTime: string, endDateTime: string, username: string) {
        return this.Http.get<AuditTrailDetailsModel[]>(`${BASE_URL}auditTrailDetails/findByAllFilters/${startDateTime}/${endDateTime}/${username}`);
    }

}