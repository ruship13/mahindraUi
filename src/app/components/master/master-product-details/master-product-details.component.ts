import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { MasterProductDetailsModel } from 'src/app/models/masterProductDetails.model';
import { MasterReasonDetailsModel } from 'src/app/models/masterReasonDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MasterProductDetailsService } from 'src/app/service/master-product-details.service';
import { MasterReasonDetailsService } from 'src/app/service/masterReasonDetails.service';
import { UserAuditTrailDetailsService } from 'src/app/service/userAuditTrailDetails.service';

@Component({
  selector: 'app-master-product-details',
  templateUrl: './master-product-details.component.html',
  styleUrls: ['./master-product-details.component.css']
})
export class MasterProductDetailsComponent implements OnInit,OnDestroy{
  productDtOptions: DataTables.Settings = {};
    subscriptions: Subscription = new Subscription();

  masterProductDetailsTableList: MasterProductDetailsModel[] = [];
  deleteProductDetailsForSelectedIdInstance: MasterProductDetailsModel = new MasterProductDetailsModel();
  editProductDetailsInstance: MasterProductDetailsModel = new MasterProductDetailsModel();
  addProductDetailsInstance: MasterProductDetailsModel = new MasterProductDetailsModel();
  selectedAddProductName!: string;
  selectedProductRadioButton: any = 1;
  addActiveInActive: any;
  deleteProductId: number = 0;
  productName!: string;
  productDesc!: string;
  materialDataDeleteDetails!: string;
  productDescDeleteDetails!: string;
  productIdDeletedDetails!: string;
  productDescAndProductNameDeleteDetails!: string;
  productDataDeletedByUserId!: string;
  productDescAndIdDeletedByUserId!: string;
  operatorsAction!: any;
  materialCode!: string;
  productId!: number;
  by!: string;
  selectedAddReasonName!: string;
  masterReasonDetailsTableList: MasterReasonDetailsModel[] = [];
  reason!: string;
  currentUser: MasterUserDetailsModel | undefined;

  constructor(private masterProductDetailsService: MasterProductDetailsService,
    private authService: AuthenticationService,
    private userAuditTrailDetailsService: UserAuditTrailDetailsService,
    private masterReasonDetailsService: MasterReasonDetailsService, private toastr: ToastrService) { }
  ngOnDestroy(): void {
 
    this.subscriptions.unsubscribe();
  }

   ngOnInit(): void {
   
    this.SessionClearMethod();

    this.currentUser = this.authService.currentUserValue;


    this.fetchMasterProductData();
    this.fetchAllMasterReasonDetails();

    // Data table configuration
    this.productDtOptions = {
      pagingType: 'simple_numbers'
    };

   
    
    
  }

   public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');  
    const userRoles = sessionStorage.getItem('userRoles');

    sessionStorage.clear();
    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('matser-product', 'true');
  }
  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }


  public fetchMasterProductData() {
    this.masterProductDetailsService.fetchAllMasterProductDetails().subscribe(
      productDetailsList => {
        $('#prodId').DataTable().clear().destroy();

        this.masterProductDetailsTableList = productDetailsList;
        this.productDesc = this.masterProductDetailsTableList[0].productDesc;
        this.productName = this.masterProductDetailsTableList[0].productName;
        this.productId = this.masterProductDetailsTableList[0].productId;

        // add this code with table id to convert data as Datatable
        $(function () {
          $("#prodId").DataTable();
        });
      }
    );
  }



  addMasterProductDetails(data: NgForm) {
    this.addProductDetailsInstance.productIsActive = this.selectedProductRadioButton;
    this.addProductDetailsInstance.userName = this.authService.currentUserValue.userName;
    this.addProductDetailsInstance.userId = this.authService.currentUserValue.userId;

    // Access values from the form object
    this.addProductDetailsInstance.productName = this.addProductDetailsInstance.productName;
    this.addProductDetailsInstance.productDesc = this.addProductDetailsInstance.productDesc;

    this.masterProductDetailsService.addProductDetails(this.addProductDetailsInstance).subscribe(
      (productlist) => {
        if (productlist.status === 200) {
          this.toastr.success(productlist.message, 'Success', { timeOut: 5000 });
          this.fetchMasterProductData();
        } else {
          this.toastr.warning(productlist.message, 'Warning', { timeOut: 5000 });
        }
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 5000 });
      }
    );


    data.resetForm();
  }

  addSelectedProductActiveInActiveRadioButton(event: any) {
    if (event.target.value == "addProductActiveRadioButton") {
      this.selectedProductRadioButton = 1;
    }
    else {
      this.selectedProductRadioButton = 0;
    }

  }

  public editMasterProductDetails(editProductDetailsInstance: MasterProductDetailsModel) {
    this.editProductDetailsInstance.productIsActive = this.selectedProductRadioButton;
    this.editProductDetailsInstance.userId = this.authService.currentUserValue.userId;
    this.editProductDetailsInstance.userName = this.authService.currentUserValue.userName;
    this.masterProductDetailsService.updateProductDetails(this.editProductDetailsInstance).subscribe(productVariantlist => {
      if (productVariantlist.status == 200) {
        this.toastr.success(productVariantlist.message, 'success', { timeOut: 5000, });
        this.fetchMasterProductData();
      }

      this.fetchMasterProductData();

    },
      (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
      });
  }



  editSelectedProductActiveInActiveRadioButton(event: any) {
    if (event.target.value == "editProductActiveRadioButton") {
      this.selectedProductRadioButton = 1;
    }
    else {
      this.selectedProductRadioButton = 0;
    }
  }

  public editProductRow(editProductDetailsInstance: MasterProductDetailsModel) {
    this.editProductDetailsInstance = Object.assign({}, editProductDetailsInstance);


  }
  public deleteProductDetails(DeleteMasterProductTable: NgForm) {
    this.materialDataDeleteDetails = "Material Data Deleted: ";
    this.productIdDeletedDetails = this.deleteProductId.toString();
    this.productDescDeleteDetails = this.productDesc ? this.productDesc : '';
    this.productDescAndProductNameDeleteDetails = this.productIdDeletedDetails.toString().concat(this.productDescDeleteDetails.toString());
    this.by = " " + "by" + "  ";
    this.productDataDeletedByUserId = this.by.concat(this.authService.currentUserValue.userName.toString());
    this.productDescAndIdDeletedByUserId = this.productDescAndProductNameDeleteDetails.concat(this.productDataDeletedByUserId.toString());
    this.operatorsAction = this.materialDataDeleteDetails.concat(this.productDescAndIdDeletedByUserId.toString());
    this.reason = this.selectedAddReasonName;
    this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.productId, this.reason, "NA", 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {

    })
    this.masterProductDetailsService.deleteProductDetails(this.deleteProductId).subscribe((data) => {

      if (data.status == 200) {
        this.toastr.success(data.message, 'success', { timeOut: 5000, });
        this.fetchMasterProductData();
      }
    }, (error) => {
      this.toastr.error(error.error.message, 'Error', { timeOut: 5000, });
    });
    DeleteMasterProductTable.reset();

  }
  public deleteProducttRow(ProductId: number, productName: string, productDesc: string) {
    this.deleteProductId = ProductId;
    this.productName = productName;
    this.productDesc = productDesc;
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
