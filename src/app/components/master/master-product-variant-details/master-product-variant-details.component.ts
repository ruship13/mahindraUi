import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MasterProductVariantDetailsModel } from 'src/app/models/masterProductVariantDetails.model';
import { MasterReasonDetailsModel } from 'src/app/models/masterReasonDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { FetchAllMasterProductVariantDetailsRequestPage, MasterProductVariantDetailsService } from 'src/app/service/masterProductVariantDetails.service';
import { MasterReasonDetailsService } from 'src/app/service/masterReasonDetails.service';
import { UserAuditTrailDetailsService } from 'src/app/service/userAuditTrailDetails.service';

@Component({
  selector: 'app-master-product-details',
  templateUrl: './master-product-variant-details.component.html',
  styleUrls: ['./master-product-variant-details.component.css']
})
export class MasterProductVariantDetailsComponent implements OnInit,OnDestroy {
  productDtOptions: DataTables.Settings = {};
private subcriptions:Subscription=new Subscription();
  masterProductVariantDetailsTableList: MasterProductVariantDetailsModel[] = [];
  deleteProductVariantDetailsForSelectedIdInstance: MasterProductVariantDetailsModel = new MasterProductVariantDetailsModel();
  editProductVariantDetailsInstance: MasterProductVariantDetailsModel = new MasterProductVariantDetailsModel();
  addProductVariantDetailsInstance: MasterProductVariantDetailsModel = new MasterProductVariantDetailsModel();
  selectedAddProductName!: string;
  selectedProductVariantRadioButton: any = 1;
  addActiveInActive: any;
  deleteProductVariantId: number = 0;
  prodVariantName!: string;
  prodVariantDesc!: string;
  materialDataDeleteDetails!: string;
  materialCodeDeleteDetails!: string;
  materialIdDeletedDetails!: string;
  materialCodeAndMaterialNameDeleteDetails!: string;
  materialDataDeletedByUserId!: string;
  materialCodeAndIdDeletedByUserId!: string;
  operatorsAction!: any;
  materialCode!: string;
  materialId!: number;
  by!: string;
  selectedAddReasonName!: string;
  masterReasonDetailsTableList: MasterReasonDetailsModel[] = [];
  reason!: string;
  totalElements: number = 0;
  itemsPerPage: number = 10;
  currentPage = 1;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  productVariantCode!: string;
  currentUser: MasterUserDetailsModel | undefined;
  constructor(private masterProductVariantDetailsService: MasterProductVariantDetailsService,
    private authService: AuthenticationService,
    private userAuditTrailDetailsService: UserAuditTrailDetailsService,
    private masterReasonDetailsService: MasterReasonDetailsService, private toastr: ToastrService) { }
  ngOnDestroy(): void {
   this.subcriptions.unsubscribe();
  }



    
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
     this.fetchMasterProductVariantData();
     this.fetchAllMasterReasonDetails();
    //   this.productDtOptions = {
    //     pagingType: 'simple_numbers'    
    // }

    this.productDtOptions = {
      ajax: () => {
        this.fetchMasterProductVariantData();
      }
    }
  }

  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }

  public fetchMasterProductVariantData() {
    this.masterProductVariantDetailsService.fetchAllMasterProductVariantDetails().subscribe(
      productVariantDetailsList => {
        $('#prodId').DataTable().clear().destroy();

        this.masterProductVariantDetailsTableList = productVariantDetailsList;
        this.prodVariantDesc = this.masterProductVariantDetailsTableList[0].productVariantDesc;
        this.materialCode = this.masterProductVariantDetailsTableList[0].productVariantCode;
        this.materialId = this.masterProductVariantDetailsTableList[0].productVariantId;

        // add this code with table id to convert data as Datatable
        $(function () {
          $("#prodId").DataTable();
        });
      }
    );
  }
  // initializeDataTable(): void {
  //   const dataTableOptions: DataTables.Settings = {
  //     "paging": false,

  //   };

  //   $(document).ready(() => {
  //     $('#prodId').DataTable(dataTableOptions);
  //   });
  // }
  // public fetchMasterProductVariantData(request: any): void {

  //   this.disableDateTime = true;
  //   this.disableSearchButton = false;

  //   this.masterProductVariantDetailsService.fetchAllMasterProductVariantDetailsList(request).subscribe(
  //     productvariantList => {
  //       this.masterProductVariantDetailsTableList = productvariantList['content'];
  //       this.totalElements = productvariantList['totalElements'];
  //       console.log("masterProductVariantDetailsTableList", this.masterProductVariantDetailsTableList);


  //       $('#prodId').DataTable().clear().destroy();


  //       this.initializeDataTable();
  //     },
  //     error => {
  //       console.log(error.error.message);
  //     }
  //   );
  // }
  // nextPage(event: PageEvent): void {
  //   this.currentPage = event.pageIndex + 1;
  //   const request: FetchAllMasterProductVariantDetailsRequestPage = {
  //     page: event.pageIndex,
  //     size: event.pageSize
  //   };
  //   this.fetchMasterProductVariantData(request);
  // }
  public addMasterProductVariantDetails(data: NgForm) {
    this.addProductVariantDetailsInstance.productVariantIsActive = this.selectedProductVariantRadioButton;
    this.addProductVariantDetailsInstance.userName = this.authService.currentUserValue.userName;
    this.addProductVariantDetailsInstance.userId = this.authService.currentUserValue.userId;
    this.addProductVariantDetailsInstance.productName = 'NA';
    this.addProductVariantDetailsInstance.productVariantDesc = this.prodVariantDesc;

    this.masterProductVariantDetailsService.addProductVariantDetails(this.addProductVariantDetailsInstance).subscribe((productVariantlist) => {



      if (productVariantlist.status == 200) {
        this.toastr.success(productVariantlist.message, 'success', { timeOut: 5000, });
        // this.fetchMasterProductVariantData();
        this.fetchMasterProductVariantData();
      }
      else {
        this.toastr.warning(productVariantlist.message, 'warning', { timeOut: 5000 },);
      }



    }, (error) => {
      this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
    }


    )


    data.reset();
  }
  addSelectedProductVariantctiveInActiveRadioButton(event: any) {
    if (event.target.value == "addProductVariantActiveRadioButton") {
      this.selectedProductVariantRadioButton = 1;
    }
    else {
      this.selectedProductVariantRadioButton = 0;
    }

  }
  public editMasterProductVariantDetails(editProductVariantDetailsInstance: MasterProductVariantDetailsModel) {
    this.editProductVariantDetailsInstance.productVariantIsActive = this.selectedProductVariantRadioButton;
    this.editProductVariantDetailsInstance.userId = this.authService.currentUserValue.userId;
    this.editProductVariantDetailsInstance.userName = this.authService.currentUserValue.userName;
    this.masterProductVariantDetailsService.updateProductVaraintDetails(this.editProductVariantDetailsInstance).subscribe(productVariantlist => {
      if (productVariantlist.status == 200) {
        this.toastr.success(productVariantlist.message, 'success', { timeOut: 5000, });
        // this.fetchMasterProductVariantData();
        this.fetchMasterProductVariantData();
      }

      // this.fetchMasterProductVariantData();
      this.fetchMasterProductVariantData();

    },
      (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
      });
  }



  editSelectedProductVariantActiveInActiveRadioButton(event: any) {
    if (event.target.value == "editProductVariantActiveRadioButton") {
      this.selectedProductVariantRadioButton = 1;
    }
    else {
      this.selectedProductVariantRadioButton = 0;
    }
  }

  public editProductVariantRow(editProductVariantDetailsInstance: MasterProductVariantDetailsModel) {
    this.editProductVariantDetailsInstance = Object.assign({}, editProductVariantDetailsInstance);


  }
  public deleteProductVariantDetails(DeleteMasterMaterialTable: NgForm) {
    this.materialDataDeleteDetails = "Material Data Deleted :" + " ";
    this.materialIdDeletedDetails = this.materialId.toString();
    this.materialCodeDeleteDetails = " " + this.materialCode;
    this.materialCodeAndMaterialNameDeleteDetails = this.materialIdDeletedDetails.toString().concat(this.materialCodeDeleteDetails.toString());
    this.by = " " + "by" + "  ";
    this.materialDataDeletedByUserId = this.by.concat(this.authService.currentUserValue.userName.toString());
    this.materialCodeAndIdDeletedByUserId = this.materialCodeAndMaterialNameDeleteDetails.concat(this.materialDataDeletedByUserId.toString());
    this.operatorsAction = this.materialDataDeleteDetails.concat(this.materialCodeAndIdDeletedByUserId.toString());
    this.reason = this.selectedAddReasonName;
    this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.materialId, this.reason, "NA", 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {

    })
    this.masterProductVariantDetailsService.deleteProductVariantDetails(this.deleteProductVariantId).subscribe((data) => {

      if (data.status == 200) {
        this.toastr.success(data.message, 'success', { timeOut: 5000, });
        // this.fetchMasterProductVariantData();
        this.fetchMasterProductVariantData();
      }
    }, (error) => {
      this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
    });
    DeleteMasterMaterialTable.reset();

  }
  public deleteProductVariantRow(ProductVariantId: number, productVariantNameValue: string, productVariantCode: string) {
    this.deleteProductVariantId = ProductVariantId;
    this.prodVariantName = productVariantNameValue;
    this.productVariantCode = productVariantCode;
  }
  public fetchAllMasterReasonDetails() {
    this.masterReasonDetailsService.fetchAllReasonDetails().subscribe(
      reasonDetailsList => {


        this.masterReasonDetailsTableList = reasonDetailsList;



      }
    );
  }
  selectReasonChangeHandler(data: string) {
    this.selectedAddReasonName = "";

    this.selectedAddReasonName = data;
  }


}
