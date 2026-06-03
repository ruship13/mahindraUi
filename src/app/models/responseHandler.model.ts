import { HttpStatusCode } from "@angular/common/http";

export interface RegisterResponse {
    status: HttpStatusCode;
    message: string;
    data:any
  }