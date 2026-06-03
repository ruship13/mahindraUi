import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MasterUserDetailsModel } from "../models/masterUserDetails.model";
import { BASE_URL } from "../utils/const";
import { RegisterResponse } from "../models/responseHandler.model";


@Injectable({
  providedIn: 'root'
})
export class MasterUserDetailsService {

  constructor(private http: HttpClient) { }

  public fetchAllUserDetails() {
    return this.http.get<MasterUserDetailsModel[]>(`${BASE_URL}masterUserDetails/fetchAllMasterUserDetails`);
  }

  public addMasterUserDetails(file: File, data: MasterUserDetailsModel) {

    const formData: FormData = new FormData();

    formData.append('file', file);

    let param = new HttpParams();

    param = param.append('firstName', data.firstName);
    param = param.append('lastName', data.lastName);
    param = param.append('userTitle', data.userTitle);
    param = param.append('userName', data.userName);
    param = param.append('userPassword', data.userPassword);
    param = param.append('contactNumber', data.contactNumber);
    param = param.append('emailId', data.emailId);
    param = param.append('gender', data.gender);
    // param = param.append('roleId', data.roleId);
    param = param.append('roleName', data.roleName);
    param = param.append('userIsDeleted', data.userIsDeleted);

    return this.http.post<RegisterResponse>(`${BASE_URL}masterUserDetails/addMasterUserDetails`, formData, {
      params: param
    });

  }


  public deleteUserDetails(userId: number) {
    return this.http.put<RegisterResponse>(`${BASE_URL}masterUserDetails/deleteMasterUserDetails/${userId}`, {
      observe: 'response'
    });

  }


  public updateUserDetails(userId: number, data: MasterUserDetailsModel, file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    let param = new HttpParams();
    param = param.append('userId', data.userId)
    param = param.append('firstName', data.firstName);
    param = param.append('lastName', data.lastName);
    param = param.append('userTitle', data.userTitle);
    param = param.append('userName', data.userName);
   // param = param.append('userPassword', data.userPassword);
    param = param.append('contactNumber', data.contactNumber);

    param = param.append('emailId', data.emailId);
    param = param.append('gender', data.gender);

    param = param.append('roleName', data.roleName);
    param = param.append('user', data.userIsDeleted);

    console.log(data);
    // console.log("file: " + file);
    return this.http.put<RegisterResponse>(`${BASE_URL}masterUserDetails/updateMasterUserDetails/${userId}`, formData, {
      params: param
    });
  }


  //   public addUserDetails(data:MasterUserDetailsModel,file:File,username:MasterUserDetailsModel) {
  //     return this.Http.post<MasterUserDetailsModel>('http://localhost:8080/masteruserdetails/create/{file}/{username}',data, {
  //         observe: 'response'
  //     });
  // }

}

