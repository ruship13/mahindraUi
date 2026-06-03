import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MasterReasonDetailsModel } from 'src/app/models/masterReasonDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MasterReasonDetailsService } from 'src/app/service/masterReasonDetails.service';
import { UserAuditTrailDetailsService } from 'src/app/service/userAuditTrailDetails.service';

@Component({
  selector: 'app-master-reason-details',
  templateUrl: './master-reason-details.component.html',
  styleUrls: ['./master-reason-details.component.css']
})
export class MasterReasonDetailsComponent implements OnInit,OnDestroy {
private subscriptions: Subscription = new Subscription();
  reasonDtOptions: DataTables.Settings = {}

  masterReasonDetailsTableList: MasterReasonDetailsModel[] = [];
  deleteMasterReasonDetailsForSeletedIdInstance: MasterReasonDetailsModel = new MasterReasonDetailsModel();
  editReasonDetailsForSelectedIdInstance: MasterReasonDetailsModel = new MasterReasonDetailsModel();
  addReasonDetailsInstance: MasterReasonDetailsModel = new MasterReasonDetailsModel();
  reasonDataDeleteDetails!: string;
  operatorActionsDeleteDetails!:string;
  reasonDeletedDetails!:string;
  operatorActionsAndreasonDeleteDetails!: string;
  reasonDataDeletedByUserId!:string;
  operatorActionsAndreasonDeletedByUserId!:string;
  operatorsAction!:any;
  reasonId!:number;
  reason!:string;
  by!: string;
  selectedAddReasonName!: string;
   currentUser: MasterUserDetailsModel | undefined;
  constructor(private  masterReasonDetailsService: MasterReasonDetailsService,
     private authService:AuthenticationService,
     private userAuditTrailDetailsService: UserAuditTrailDetailsService,
     private toastr: ToastrService) { }
  ngOnDestroy(): void {
   this.subscriptions.unsubscribe();
  }
    
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.fetchAllMasterReasonDetails();
    this.reasonDtOptions = {
      pagingType: 'simple_numbers'    
  }
  }
  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  public fetchAllMasterReasonDetails() {
    this.masterReasonDetailsService.fetchAllReasonDetails().subscribe(
      reasonDetailsList => {
        this.masterReasonDetailsTableList = reasonDetailsList;
        $('#reasonId').DataTable().clear().destroy();
        // console.log(this.masterReasonDetailsTableList);
        this.reasonId= this.masterReasonDetailsTableList[0].reasonId;
        this.reason=this.masterReasonDetailsTableList[0].reason;
        // add this code with table id to convert data as Datatable
        $(function () {
          $("#reasonId").DataTable();
        });
      }
    );
  }
  selectReasonChangeHandler(data: string) {
    this.selectedAddReasonName = "";

    this.selectedAddReasonName = data;
  }


  public deleteMasterReasonDetails() {
    // this.reasonDataDeleteDetails = "Reason Data Deleted :" + " ";
    // this.operatorActionsDeleteDetails =this.reasonId.toString();
    // this.reasonDeletedDetails=" " +this.reason;
    // this.operatorActionsAndreasonDeleteDetails=this.operatorActionsDeleteDetails.toString().concat(this.reasonDeletedDetails.toString());
    // this.by = " " + "by" + "  ";
    // this.reasonDataDeletedByUserId = this.by.concat(this.authService.currentUserValue.userName.toString());
    // this.operatorActionsAndreasonDeletedByUserId = this.operatorActionsAndreasonDeleteDetails.concat(this.reasonDataDeletedByUserId.toString());
    // this.operatorsAction = this.reasonDataDeleteDetails.concat(this.operatorActionsAndreasonDeletedByUserId.toString());
    // this.reason=this.selectedAddReasonName;
    // this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction,this.reasonId,this.reason,"NA",1,2,this.authService.currentUserValue.userName).subscribe(reasonData => {
   
    // })
    this.masterReasonDetailsService.deleteReasonDetails(this.deleteMasterReasonDetailsForSeletedIdInstance.reasonId).subscribe(
      deleteReasonDetails => {
        if(deleteReasonDetails.status==200){
        this.toastr.success(deleteReasonDetails.message,'success', {timeOut: 5000,});
        this.fetchAllMasterReasonDetails();
        }

        
      },(error)=>{
        this.toastr.error(error.error.message,'Error', {timeOut: 5000,});
      }
    );
  }

  public deleteMasterReasonDetailsRow(deleteProductDetailsRowInstance: MasterReasonDetailsModel) {
    this.deleteMasterReasonDetailsForSeletedIdInstance = Object.assign({}, deleteProductDetailsRowInstance);
  }

  public editMasterReasonDetails() {
    this.masterReasonDetailsService.editReasonDetails(this.editReasonDetailsForSelectedIdInstance.reasonId,this.editReasonDetailsForSelectedIdInstance).subscribe(
      editNewReasonDetails => {
        if (editNewReasonDetails.status == 200) {
         
          this.toastr.success(editNewReasonDetails.message,'success', {timeOut: 5000,});
          this.fetchAllMasterReasonDetails();
        }
        
      },(error)=>{
        this.toastr.error(error.error.message,'Error', {timeOut: 5000,});
      }
    );
  }

  public editMasterReasonDetailsRow(editReasonDetailsRowInstance: MasterReasonDetailsModel) {
    // assigning object to another object.as curly '{}' braces are important
    this.editReasonDetailsForSelectedIdInstance = Object.assign({}, editReasonDetailsRowInstance);
  }

  public addMasterReasonDetails(addReasonDetailsModalForm: NgForm) {

    
    this.masterReasonDetailsService.addReasonDetails(this.addReasonDetailsInstance).subscribe(
      addNewReasonDetails => {

        
        if (addNewReasonDetails.status == 200) {
         
          this.toastr.success(addNewReasonDetails.message,'success', {timeOut: 5000,});
          this.fetchAllMasterReasonDetails();
        }
        else {
          this.toastr.warning(addNewReasonDetails.message,'warning', {timeOut: 5000},);
        }
        
      },(error)=>{
        this.toastr.error(error.error.message,'Error', {timeOut: 5000,});
      }
    )
    addReasonDetailsModalForm.reset();
  }
}
