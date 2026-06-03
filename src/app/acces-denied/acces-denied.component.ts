import { Component } from '@angular/core';
import { MasterUserDetailsModel } from '../models/masterUserDetails.model';
import { AuthenticationService } from '../service/auth.service';
import { Role } from '../utils/role.enum';

@Component({
  selector: 'app-acces-denied',

  templateUrl: './acces-denied.component.html',
  styleUrls: ['./acces-denied.component.css']
})
export class AccesDeniedComponent {

  currentUser: MasterUserDetailsModel | undefined;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
   
    this.currentUser = this.authService.currentUserValue;
    console.log("role Name ::"+this.authService.currentUserValue.roleName);
  }


  isOperator(): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser && currentUser.roleName === Role.Operator;
  }

  isSuperwiser(){
    const currentUser=this.authService.currentUserValue;
    return currentUser && currentUser.roleName === Role.Superwise;
  }

  otherRoleORAdmin(){
    const currentUser=this.authService.currentUserValue;
    return currentUser && currentUser.roleName === Role.Admin;
  }
}
