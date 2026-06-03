import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../service/auth.service';




@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;
   // alert(currentUser.userName)
    if (currentUser && currentUser.jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.jwtToken}`
         
        }

      });
     

    }

    return next.handle(request);
  }







  /*
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


     if (token && !req.url.includes('/login')) {
       const modifiedReq = req.clone({
         // tslint:disable-next-line: max-line-length
         headers: req.headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXN0ZXJfdXNlciIsImV4cCI6MTU4MjcyODk0OSwiaWF0IjoxNTgyNjkyOTQ5fQ.vAv9HdIc0KNP08fd-fSSQhmjJdgMF-e7ozh7Ld0aorc'),
       });
       return next.handle(modifiedReq);
     } else {
       return next.handle(req);
     }

   }
 }
 */

}

