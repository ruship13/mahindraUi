import { Component } from '@angular/core';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent {
  currentUser: MasterUserDetailsModel | undefined;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
   
    this.currentUser = this.authService.currentUserValue;
  }
}
