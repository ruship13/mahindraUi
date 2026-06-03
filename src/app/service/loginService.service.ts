import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AuditTrailDetailsModel } from "../models/auditTrailDetails.model";
import { BASE_URL } from "../utils/const";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class LoginService {
  modalEvent: any;

    constructor(private Http: HttpClient) { }
    // sendOtp(emailId: string): Observable<string> {
    //   const url = `${BASE_URL}sendOtp/${emailId}`;
    //   return this.Http.post<string>(url, {});
    // }

    // verifyOtp(otp: number): Observable<string> {
    //   const url = `${BASE_URL}verifyOtp/${otp}`;
    //   return this.Http.post<string>(url, {});
    // }
    sendOtp(email: string): Observable<any> {
        const url = `${BASE_URL}login/sendOtp/${email}`;
       console.log("email"+email);
        return this.Http.post<any>(url, null, { responseType: 'text' as 'json' })  // Set responseType to 'text'
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Error in sendOtp:', error);
              return throwError(error);
            })
          );
      }

     
    verifyOtp(otp: number): Observable<any> {
        const url = `${BASE_URL}login/verifyOtp/${otp}`;
    
        return this.Http.post<any>(url, null, { responseType: 'text' as 'json' })  // Set responseType to 'text'
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Error in verifyOtp:', error);
              return throwError(error);
            })
          );

      }

      changePassword(newPassword1: string, newPassword2: string): Observable<string> {
        const url = `${BASE_URL}login/changePassword`;
    
        const formData = new FormData();
        formData.append('newPassword1', newPassword1);
        formData.append('newPassword2', newPassword2);
    
        return this.Http.post<string>(url, formData, { responseType: 'text' as 'json' });
      }
    // public verifyOtp(otp: number): Observable<string> {
    //     const url = `${BASE_URL}login/verifyOtp`;
    //     const requestBody = { otp: otp }; // The OTP is sent as part of the request body
    
    //     return this.Http.post<string>(url, requestBody);
    //   }
}