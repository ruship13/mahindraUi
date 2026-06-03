import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { MasterRoleDetailsModel } from 'src/app/models/masterRoleDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MasterRoleDetailsService } from 'src/app/service/masterRoleDetails.service';
import { MasterUserDetailsService } from 'src/app/service/masterUserDetailsService';

@Component({
  selector: 'app-master-user-details',
  templateUrl: './master-user-details.component.html',
  styleUrls: ['./master-user-details.component.css']
})
export class MasterUserDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  userDtOptions: DataTables.Settings = {};

  masterUserDetailsTableList: MasterUserDetailsModel[] = [];
  addUserDetailsInstance: MasterUserDetailsModel = new MasterUserDetailsModel();
  imageSrc!: string | ArrayBuffer | null;
  selectedAddImageFile: any;
  selectedUserTitle!: string;
  selectedUserGender!: string;
  selectedUserRole!: string;
  selectedEditUserRole!: string;
  deleteUserDetailsInstance: MasterUserDetailsModel = new MasterUserDetailsModel();
  editUserDetailsInstance: MasterUserDetailsModel = new MasterUserDetailsModel();
  editImageSrc!: string | ArrayBuffer | null;
  selectedEditImageFile: any;
  userRoleListFromRoleDetails: MasterRoleDetailsModel[] = [];
  currentUser: MasterUserDetailsModel | undefined;


  constructor(private masterUserDetailsService: MasterUserDetailsService,
    private masterRoleDetailsService: MasterRoleDetailsService, private toastr: ToastrService,
    private authService: AuthenticationService, private route: Router) { }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchAllMasterUserDetails();
    this.fetchAllMasterRoleDetails();
    this.currentUser = this.authService.currentUserValue;
  }
  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  public fetchAllMasterRoleDetails() {
    this.masterRoleDetailsService.fetchAllMasterRoleDetails().subscribe(
      roleDetailsList => {
        this.userRoleListFromRoleDetails = roleDetailsList;
      }
    );
  }

  public fetchAllMasterUserDetails() {
    this.masterUserDetailsService.fetchAllUserDetails().subscribe(
      userDetailsList => {
        this.masterUserDetailsTableList = userDetailsList;

        // add this code with table id to convert data as Datatable
        $(function () {
          $("#userId").DataTable();
        });
      }
    )
  }

  public addMasterUserDetails(addUserForm: NgForm) {

    this.addUserDetailsInstance.firstName = addUserForm.value.addUserFirstName;
    this.addUserDetailsInstance.lastName = addUserForm.value.addUserLastName;
    this.addUserDetailsInstance.userTitle = addUserForm.value.addUserTitle;
    this.addUserDetailsInstance.userName = addUserForm.value.addUserName;
    this.addUserDetailsInstance.userPassword = addUserForm.value.addUserPassword;
    if (this.addUserDetailsInstance.contactNumber == '') {

      this.addUserDetailsInstance.contactNumber = 'NA';
    } else {
      this.addUserDetailsInstance.contactNumber = addUserForm.value.addUserContactNumber;
    }

    if (this.addUserDetailsInstance.emailId == '') {
      this.addUserDetailsInstance.emailId = 'NA'
    } else {
      this.addUserDetailsInstance.emailId = addUserForm.value.addUserEmail;
    }

    this.addUserDetailsInstance.gender = addUserForm.value.userGender;

    this.addUserDetailsInstance.roleName = addUserForm.value.addUserRoleName;
    this.addUserDetailsInstance.userIsDeleted = 0;

    this.masterUserDetailsService.addMasterUserDetails(this.selectedAddImageFile, this.addUserDetailsInstance).subscribe(userData => {

      if (userData.status == 200) {
        this.toastr.success(userData.message, 'success', { timeOut: 5000, });
        this.fetchAllMasterUserDetails();
      }
      else if (userData.status == 502) {
        alert("image size exceeds 1 MB")
      }

    }, (error) => {
      this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
    }
    );
    addUserForm.reset();
    this.imageSrc = null;
  }

  selectedTitleEventChange(value: string) {

  }
  selectedUserGenderEventChange(value: string) {

  }

  selectedUserRoleEventChange(value: string) {
    this.selectedEditUserRole = '';
    this.selectedEditUserRole = value;
  }

  // Added selected user image
  userAddFileSelected(eventData: any) {

    const element = eventData.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {

      this.selectedEditImageFile = '';
      this.selectedAddImageFile = fileList[0];
    }

    // Display selected image on Add Modal

    if (eventData.target.files && eventData.target.files[0]) {
      const file = eventData.target.files[0];

      const addImageReader = new FileReader();
      addImageReader.onload = e => this.imageSrc = addImageReader.result;
      addImageReader.readAsDataURL(file);

    }
  }
  logout() {
    this.authService.logout();
    this.route.navigate(['/login'])

  }
  public deleteMasterUserDetails() {
    this.masterUserDetailsService.deleteUserDetails(this.deleteUserDetailsInstance.userId).subscribe(
      deleteUserDetails => {
        if (deleteUserDetails.status == 200) {
          if (this.currentUser?.userId == this.deleteUserDetailsInstance.userId) {
            this.toastr.warning('Session has been closed due to the deletion of the current user.', '', { timeOut: 5000 })
            // console.log(this.currentUser?.userId==this.deleteUserDetailsInstance.userId);
            this.logout();
          }
          else {
            this.toastr.success(deleteUserDetails.message, 'success', { timeOut: 5000, });
            this.fetchAllMasterUserDetails();
          }

        }
        else if (deleteUserDetails.status == 208) {
          this.toastr.warning(deleteUserDetails.message, 'warning', { timeOut: 5000, });
        }


      }, (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
      }
    );
  }

  public deleteMasterUserDetailsRow(deleteUserDetailsRowInstance: MasterUserDetailsModel) {
    this.deleteUserDetailsInstance = Object.assign({}, deleteUserDetailsRowInstance)
  }

  public editMasterUserDetailsRow(editUserDetailsRowInstance: MasterUserDetailsModel) {
    this.editUserDetailsInstance = Object.assign({}, editUserDetailsRowInstance);
    this.selectedEditUserRole = this.editUserDetailsInstance.roleName;
    this.editImageSrc = this.editUserDetailsInstance.userPhotoImageIn64Base;
    this.selectedEditImageFile = this.editUserDetailsInstance.userPhotoImageIn64Base;



  }

  // Edited selected user image
  userEditFileSelected(editEventData: any) {

    const element = editEventData.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedEditImageFile = fileList[0];
    }

    // Display selected image on Edit Modal
    if (editEventData.target.files && editEventData.target.files[0]) {
      const editFile = editEventData.target.files[0];

      const editImageReader = new FileReader();
      editImageReader.onload = e => this.editImageSrc = editImageReader.result;
      editImageReader.readAsDataURL(editFile);
    }

  }

  public updateMasterUserDetails() {
    this.editUserDetailsInstance.roleName = this.selectedEditUserRole;

    this.masterUserDetailsService.updateUserDetails(this.editUserDetailsInstance.userId, this.editUserDetailsInstance, this.selectedEditImageFile).subscribe(data => {
      if (data.status == 200) {

        this.toastr.success(data.message, 'success', { timeOut: 5000, });
        this.fetchAllMasterUserDetails();
      }
      else if (data.status == 208) {
        this.toastr.warning(data.message, 'warning', { timeOut: 5000, });
      }

    }, (error) => {
      this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
    }
    );

    this.editImageSrc = null;
  }



}
