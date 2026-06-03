
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';


import { MasterUserDetailsModel } from '../models/masterUserDetails.model';
import { BASE_URL } from '../utils/const';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {


  isAuthorized() {
    return true;
  }

  hasRole(role: any) {
    if (role == this.currentUserValue.roleName) {
      return true;
    }

    return false;


    // return this.isAuthorized() && this.user.role === role;
  }


  private currentUserSubject: BehaviorSubject<MasterUserDetailsModel>;
  public currentUser: Observable<MasterUserDetailsModel>;


  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<MasterUserDetailsModel>(JSON.parse(sessionStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): MasterUserDetailsModel {
    return this.currentUserSubject.value;
  }

  public get currentUserSub() {
    return this.currentUserSubject;
  }

  options!: {
    headers?: HttpHeaders | { [header: string]: string | string[] },
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
    reportProgress?: boolean,
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
    withCredentials?: boolean,
  }

  // login(username: string, password: string) {

  //   return this.http.post<MasterUserDetailsModel>(`${BASE_URL}login/authenticate?userName=${username}&userPassword=${password}`,
  //     this.options).subscribe((user: MasterUserDetailsModel) => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       if (user != null) {
  //         console.log(user)
  //         sessionStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //         this.router.navigate(['/dashboard']);
  //         alert("Login sucessfully...!")
  //       }
  //       else {
  //         alert('Login Failed')
  //         //this.toastrService.danger('', 'Login Failed');
  //       }
  //       return user;
  //     }

  //       ,
  //       error => {
  //         alert("error" + error);
  //       });
  // }
  // login(username: string, password: string) {
  //   this.http.post<MasterUserDetailsModel>(`${BASE_URL}login/authenticate?userName=${username}&userPassword=${password}`, this.options)
  //     .subscribe(
  //       (user: MasterUserDetailsModel) => {
  //         if (user) {
  //           sessionStorage.setItem('currentUser', JSON.stringify(user));
  //           this.currentUserSubject.next(user);
  //           this.router.navigate(['/dashboard']);
  //           this.toastr.success('Login successfully', 'Success', { timeOut: 5000 });
  //         } else {
  //           this.toastr.error('Login Failed', 'Error', { timeOut: 5000 });
  //         }
  //       },
  //       error => {
  //         console.error('Login error:', error);
  //         this.toastr.error('Login Failed', 'Error', { timeOut: 5000 });
  //       }
  //     );
  // }




  login(username: string, password: string) {

    // Create the payload to send in the body of the POST request
    
    const payload = {
    
    userName: username,
    
    userPassword: password
    
    };
    
    
    // Define the headers and options for the request
    
    const options = {
    
    headers: new HttpHeaders({
    
    'Content-Type': 'application/json',
    
    })
    
    };
    
    
    // Send the password in the body of the POST request (not in the URL)
    
    return this.http.post<MasterUserDetailsModel>(
    
    `${BASE_URL}login/authenticate`, // API endpoint
    
    payload, // Payload containing userName and userPassword
    
    options // Options containing headers (no need for "observe: 'body'" as it's default)
    
    ).subscribe(
    
    (user: MasterUserDetailsModel) => {
    
    if (user != null) {
    
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    this.currentUserSubject.next(user);
    
    this.router.navigate(['/dashboard']);
    
    this.toastr.success('You have successfully logged in');
    
    } else {
    
   
    this.toastr.error('Login Failed');
    }
    
    },
    
    error => {
    
    console.log("error", error);
    
    alert("Login Failed");
    
    } ); }

  // login(userName: string, userPassword: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('userName', userName)
  //     .set('userPassword', userPassword);

  //   return this.http.post<MasterUserDetailsModel>(`${BASE_URL}login/authenticate`, {}, { params }).pipe(
  //     tap((response: MasterUserDetailsModel) => {
  //       if (response && response.jwtToken) {
  //         sessionStorage.setItem('currentUser', JSON.stringify(response));
  //         this.currentUserSubject.next(response);
  //         this.router.navigate(['/dashboard']); // Navigate to the desired route after successful login
  //       }
  //     })
  //   );
  // }

  // login(userName: string, userPassword: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('userName', userName)
  //     .set('userPassword', userPassword);
  
  //   return this.http.post<any>(`${BASE_URL}login/authenticate`, {}, { params }).pipe(
  //     tap(response => {
  //       if (response && response.jwtToken) {
  //         sessionStorage.setItem('currentUser', JSON.stringify(response));
  //         this.currentUserSubject.next(response);
  //         this.router.navigate(['/dashboard']);
  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 409) {
  //         alert("User is already logged in on another machine.");
  //       } else if (error.status === 204) {
  //         alert("No content found for the provided credentials.");
  //       } else {
  //         alert("An error occurred. Please try again later.");
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }
  
  logout() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    this.currentUserSubject.next(null!);
  }

}
