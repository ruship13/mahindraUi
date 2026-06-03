import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OtpEntity } from 'src/app/models/otpEntity.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { LoginService } from 'src/app/service/loginService.service';
import 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subcription: Subscription = new Subscription();
  capsLockOn: boolean = false;

  constructor(private auth: AuthenticationService,
    private loginservice: LoginService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }



  otpEntity: OtpEntity = new OtpEntity();
  userName!: string
  password!: string
  visible: boolean = true;
  changetype: boolean = true;



  newPassword1: string = '';
  newPassword2: string = '';
  showModal: boolean = false;
  ngOnInit(): void {
    this.viewpass();
  }

  login() {
    // alert(this.userName)
    this.auth.login(this.userName, this.password)
  }


  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
  checkCapsLock(event: KeyboardEvent) {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }



  sendOtp() {
    if (this.otpEntity.email) {
      this.loginservice.sendOtp(this.otpEntity.email).subscribe(
        (response: string) => {
          this.toastr.success('OTP sent on Registered EmailId.', 'Success', { timeOut: 5000 });
          $('#forgotPasswordModal').modal('hide');
          $('#OtpVerificationModal').modal('show');
        },
        (error) => {
          console.error('Error sending OTP:', error);

          if (error instanceof HttpErrorResponse && error.status === 400) {
            this.toastr.warning('Email does not exist.', '', { timeOut: 5000 });
            $('#forgotPasswordModal').modal('show');
          } else {
            this.toastr.warning('An error occurred while sending OTP.', '', { timeOut: 5000 });
            $('#forgotPasswordModal').modal('show');
          }
        }
      );
    }
  }







  verifyOtp() {
    this.loginservice.verifyOtp(this.otpEntity.otp).subscribe(
      (response: number) => {
        console.log("Otp" + JSON.stringify(this.otpEntity.otp));
        this.toastr.success('OTP verified successfully.', 'Success', { timeOut: 5000 });
        $('#OtpVerificationModal').modal('hide');
        $('#NewPasswordModal').modal('show');

      },

      (error) => {
        console.error('Error verifying OTP:', error);

        if (error.status === 400) {
          this.toastr.warning('Invalid OTP. Please enter a valid OTP.', 'Warning', { timeOut: 5000 });
          $('#NewPasswordModal').modal('hide');
          $('#OtpVerificationModal').modal('show');
          console.log("wrong otp...")
        } else {


          this.toastr.warning('OTP verification failed. Please try again later.', 'Warning', { timeOut: 5000 });
          $('#NewPasswordModal').modal('hide');
          $('#OtpVerificationModal').modal('show');
        }
      }
    );
  }



  changePassword() {

    if (this.newPassword1 && this.newPassword2) {
      this.loginservice.changePassword(this.newPassword1, this.newPassword2).subscribe(
        (response: string) => {
          this.toastr.success('Password updated successfully.', 'Success', { timeOut: 5000 });

          console.log('Password changed successfully:', response);
          $('#NewPasswordModal').modal('hide');
          $('#OtpVerificationModal').modal('hide');
          $('#forgotPasswordModal').modal('hide');
          // this.showModal;
        },
        (error) => {

          console.error('Error changing password:', error);
          if (error.status === 400) {
            this.toastr.warning('Password does not match.', 'Warning', { timeOut: 5000 });

          }

        }
      );
    }
  }




}
