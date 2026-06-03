import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Workbook } from 'exceljs';
import * as  fileServer from 'file-saver';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { FetchAllCurrentPalletStockDetailsRequestPage } from 'src/app/service/currentPalletStockDetails.service';

import { MasterFloorDetailsModel } from 'src/app/models/masterFloorDetails.model';
import { MasterProductVariantDetailsModel } from 'src/app/models/masterProductVariantDetails.model';


import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';
import { CurrentPalletStockDetailsService } from 'src/app/service/currentPalletStockDetails.service';
import { MasterFloorDetailsService } from 'src/app/service/masterFloorDetails.service';
import { MasterProductVariantDetailsService } from 'src/app/service/masterProductVariantDetails.service';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';
import { ManualOutfeedMissionDetailsService } from 'src/app/service/manualOutfeedMissionDetails.service';
import { ManualOutfeedMissionDetailsModel } from 'src/app/models/manualOutfeedMissionDetails.model';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/auth.service';
import { QualityInspectonStatusService } from 'src/app/service/qualityInspectionStatus.service';
import { QualityInspectionStatusModel } from 'src/app/models/qualityInspectionStatus.model';
import { formatDate } from '@angular/common';
import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { MasterPositionDetailsService } from 'src/app/service/masterpositionDetails.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Data } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BASE_URL } from 'src/app/utils/const';

import { CurrentStockDetails } from 'src/app/models/currentStockDetail';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { Role } from 'src/app/utils/role.enum';
import { MasterProductDetailsModel } from 'src/app/models/masterProductDetails.model';
import { MasterProductDetailsService } from 'src/app/service/master-product-details.service';
import { error } from 'jquery';
import { filter, interval, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { DashboardDetailsService } from 'src/app/service/dashboardDetails.service';
import { DashboardDetailsModel } from 'src/app/models/dashboardDetails.model';
import { inventorySummaryReportService } from 'src/app/service/inventorySummaryReportService.service';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';

@Component({
  selector: 'app-current-stock-details',
  templateUrl: './current-stock-details.component.html',
  styleUrls: ['./current-stock-details.component.css']
})
export class CurrentStockDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('addPalletCodeDetailsModalForm') addPalletCodeDetailsModalForm: NgForm | undefined;
  private subscriptions: Subscription = new Subscription();
  bevFullPalletCard: boolean = false;
  s230FullPalletcard: boolean = false;
  bevEmptyPalletCard: boolean = false;
  s230EmptyPalletCard: boolean = false;
  private dataTable: any;
  currentPalletStockDetailsDtOptions: DataTables.Settings = {
    searching: true,

  };
  isCardSelected = false; // Initialize with false
  allCurrentData: CurrentPalletStockDetailsModel[] = [];
  palletCodeList: CurrentPalletStockDetailsModel[] = [];
  currentUser: MasterUserDetailsModel | undefined;
  masterProductDetailsTableList: MasterProductDetailsModel[] = [];
  currentStockDetails: CurrentStockDetails = new CurrentStockDetails();
  currentPalletStockDetailsList: CurrentPalletStockDetailsModel[] = [];
  bevList: CurrentPalletStockDetailsModel[] = [];
  totalElements: number = 0;
  productVariantDropDownList: MasterProductVariantDetailsModel[] = [];
  floorDetailsDropDownList: MasterFloorDetailsModel[] = [];
  areaDetailsDropDownList: MasterAreaDetailsModel[] = [];
  selectedProduct!: string;
  selectedPalletStatus!: string;
  positionName!: string;
  fetchAllMasterPositionDetailsList: MasterPositionDetailsModel[] = [];
  startDateTime!: string;
  endDateTime!: string;
  areaName!: string;
  floorName!: string;
  productName!: string;
  productVariantCode!: string;
  palletCode!: string;
  productVariantName!: string;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  editCurrentPalletStockDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  dispatchCurrentDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  addManualOutfeedMissionInstance: ManualOutfeedMissionDetailsModel = new ManualOutfeedMissionDetailsModel();
  dashboardDetails: DashboardDetailsModel = new DashboardDetailsModel();
  manualOutfeedPalletCode!: string;
  manualOutfeedSerialNumber!: number;
  qualityInspectionStatusList: QualityInspectionStatusModel[] = [];
  EmptyPalletDetailsDetailsList: CurrentPalletStockDetailsModel[] = [];
  qualityInspectionStatusName!: String;
  data$: any;
  currentPage = 1;
  itemsPerPage: number = 10;
  responseData: any;
  intervalId: any;
  request = {};
  // bevList: CurrentPalletStockDetailsModel[] = [];
  s230List: CurrentPalletStockDetailsModel[] = [];
  bevList1!: string;
  S230List: CurrentPalletStockDetailsModel[] = [];
  isSearchFilterOpen: boolean = false;

  itemsPerPageEmpty: number = 10;
  totalElementsEmpty: number = 0;
  currentPagesEmpty: number = 1;

  itemsPerPageEmptyS230: number = 10;
  totalElementsEmptyS230: number = 0;
  currentPagesEmptyS230: number = 1;

  palletStatus!: string;
  palletStatusname!: string;

  palletStockList: CurrentPalletStockDetailsModel[] = [];
  responseData1: any;
  binLocation!: string;
  userName!: string;
  serialNumber!: number;
  serialNumberList: CurrentPalletStockDetailsModel[] = [];
  manualOutfeedserialNumber!: number;
  responseData2: any;
  responseData3: any;
  responseDataforAudio: any;
  responseDataMismatchCell: any;

  constructor(private currentPalletStockDetailsService: CurrentPalletStockDetailsService,
    private masterPositionDetailsService: MasterPositionDetailsService,
    private masterPrductVariantDetailsService: MasterProductVariantDetailsService,
    private masterFloorDetailsService: MasterFloorDetailsService,
    private masterAreaDetailsService: MasterAreaDetailsService,
    private manualOutfeedMissionDetailsService: ManualOutfeedMissionDetailsService,
    private qualityInspectonStatusService: QualityInspectonStatusService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private masterProductDetailsService: MasterProductDetailsService,
    private toastr: ToastrService,
    private dashboardDetailsService: DashboardDetailsService,
    private agingReportDetails: inventorySummaryReportService,
    private mockDrillMissionService: TemperatureAlarmMissionRuntimeDetailsService
  ) { }

  ngAfterViewInit(): void {

    $('#currentPalletStockDetailsDtOptions').DataTable();
  }
  intervalIds: any[] = [];
  ngOnInit(): void {
    this.SessionClearMethod();


    this.currentUser = this.authService.currentUserValue;


    this.loadInitialData();


    this.subscriptions.add(
      interval(120000).subscribe(() => {
        this.loadDashboardDetails();
        this.getAlarmForPosition();
        this.fetchAllMasterpositionDetails();
      })
    );


    this.subscriptions.add(
      interval(120000).subscribe(() => {
        this.getEmptyPositionAlarm();
      })
    );


    this.subscriptions.add(
      interval(300000).subscribe(() => {
        this.fetchAllMismatchCell();
      })
    );


    this.currentPalletStockDetailsDtOptions = {
      ajax: () => {
        this.fetchAllCurrentPalletStockDetails({ page: "0", size: "10" });
      }
    };

    this.isManualDispatchEnabled(this.positionName);
  }


  private loadInitialData(): void {
    this.loadDashboardDetails();
    this.fetchMasterProductData();
    this.fetchAllMasterProductVariantDetails();
    this.fetchAllMasterAreaDetails();
    this.fetchAllMasterFloorDetailsData();
    this.fetchAllMasterpositionDetails();
    this.loadAgeingDays();
    this.fetchAllMismatchCell();
  }
  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');
    const userRoles = sessionStorage.getItem('userRoles');

    sessionStorage.clear();


    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('currentStock', 'true');
  }

  ngOnDestroy(): void {
    // ✅ stop all polling
    this.subscriptions.unsubscribe();
  }




  resetData() {
    this.productVariantCode = "NA";
    this.areaName = "NA";
    this.floorName = "NA";
    this.startDateTime = "NA";
    this.endDateTime = "NA";
    this.productName = "NA"
  }

  public fetchAllMasterProductVariantDetails() {
    this.masterPrductVariantDetailsService.fetchAllMasterProductVariantDetails().subscribe(
      productVariantList => {
        this.productVariantDropDownList = productVariantList;
      }
    )
  }

  public fetchAllMasterFloorDetailsData() {
    this.masterFloorDetailsService.fetchAllMasterFloorDetails().subscribe(
      floorDetailsList => {
        this.floorDetailsDropDownList = floorDetailsList;
        // console.log("floordropDownlist ::"+this.floorDetailsDropDownList)
      }
    );
  }

  public fetchAllMasterAreaDetails() {
    this.masterAreaDetailsService.fetchAllAreaDetails().subscribe(
      areaDetailsList => {
        this.areaDetailsDropDownList = areaDetailsList;
      }
    )
  }

  public selectProductVariantCodeChangeHandler(value: string) {
    this.productVariantCode = value;
  }

  public selectProductNameChangeHandler(value: string) {
    this.productName = value;
  }

  public selectPalletStausChangeHandler(value: string) {
    // console.log("Selected Pallet Status:", value);
    this.selectedPalletStatus = value;


  }
  public selectAreaChangeHandler(value: string) {
    this.areaName = value;
  }

  public selectFloorChangeHandler(value: string) {

    this.floorName = value;
    // console.log("this.floorName ::" + this.floorName)
  }

  onResetClick(): void {

    this.fetchAllCurrentPalletStockDetails({ page: "0", size: "10" });
    this.currentPage = 1;
  }

  // initializeDataTable(): void {

  // }
  initializeDataTable(): void {
    const dataTableOptions: DataTables.Settings = {
      "paging": false,

    };

    $(document).ready(() => {
      $('#currentPalletStockTableId').DataTable(dataTableOptions);
    });
  }



  public fetchAllCurrentPalletStockDetails(request: any): void {
    this.resetData();
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetails(request).subscribe(
      currentPalletList => {
        this.currentPalletStockDetailsList = currentPalletList['content'];
        this.totalElements = currentPalletList['totalElements'];
        // console.log("currentPalletStockDetailsList", this.currentPalletStockDetailsList);

        $('#currentPalletStockTableId').DataTable().clear().destroy();
        this.initializeDataTable(); // Initialize DataTable after destroying the previous instance
      },
      error => {
        console.error(error.error.message);
      }
    );
  }







  public dateTimeValidation() {

    if (this.startDateTime != null && (this.endDateTime == null || this.endDateTime == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.startDateTime != null && this.endDateTime != null && this.endDateTime <= this.endDateTime) {
      this.disableSearchButton = false;
    }

    else if (this.startDateTime != null && this.endDateTime != null && this.startDateTime < this.endDateTime) {
      this.disableSearchButton = false;
    }


    else if (this.startDateTime == this.endDateTime) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }


  public fetchCurrentPalletStockDetailsByAllFilters() {
    // this.isSearchFilterOpen=isSearchOpen;
    if (this.startDateTime == undefined || this.startDateTime == null) {
      this.startDateTime = "NA"
    }
    if (this.endDateTime == undefined || this.endDateTime == null) {
      this.endDateTime = "NA"
    }
    if (this.productVariantCode == undefined || this.productVariantCode == null || this.productVariantCode.trim() == "") {
      this.productVariantCode = "NA"
    }
    if (this.areaName == undefined || this.areaName == null || this.areaName.trim() == "") {
      this.areaName = "NA"
    }
    if (this.floorName == undefined || this.floorName == null || this.floorName.trim() == "") {
      this.floorName = "NA"
    }
    if (this.productName == undefined || this.productName == null || this.productName.trim() == "") {
      this.productName = "NA"
    }

    if (this.selectedProduct == "BEV" && this.selectedPalletStatus == "FULL") {
      this.productName = 'BEV';
      this.palletStatus = 'FULL';
      // console.log(this.productName);
    }
    if (this.selectedProduct == "S230" && this.selectedPalletStatus == "FULL") {
      this.productName = 'S230';
      this.palletStatus = 'FULL';
      // console.log(this.productName);
    }

    if (this.palletStatus == undefined || this.palletStatus == null || this.palletStatus.trim() == "") {
      this.palletStatusname = "NA";
    }
    if (this.selectedPalletStatus === "EMPTY" && this.selectedProduct === "S230") {
      // console.log("1")
      this.palletStatusname = 'EMPTY';
      this.productName = 'S230';
    }
    if (this.selectedPalletStatus === "EMPTY" && this.selectedProduct === "BEV") {
      // console.log("1")
      this.palletStatusname = 'EMPTY';
      this.productName = 'BEV';

    }
    // else if (this.selectedPalletStatus === "FULL") {
    //   console.log("2")
    //   this.palletStatusname = 'FULL';
    // } 
    else {
      // console.log("3")
      this.palletStatusname = this.palletStatus?.trim() || "NA";
      this.productName = this.productName?.trim() || "NA";
    }

    this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByAllFilters(this.startDateTime, this.endDateTime, this.productVariantCode, this.floorName, this.areaName, this.productName, this.palletStatusname).subscribe(
      currentPalletStockDetails => {

        // this.currentPalletStockDetailsList = currentPalletStockDetails['content'];
        // this.totalElements = currentPalletStockDetails['totalElements'];
        // this.currentPalletStockDetailsList = currentPalletStockDetails;

        // console.log("currentPalletStockDetails......56:: ");
        // console.log(currentPalletStockDetails);
        $('#currentPalletStockTableId').DataTable().clear().destroy();
        this.currentPalletStockDetailsList = currentPalletStockDetails;

        $(function () {
          $("#currentPalletStockTableId").DataTable();
        });
      }
    );
  }


  // public fetchCurrentPalletStockDetailsByAllFilters() {
  //   // Default values for filters
  //   this.startDateTime = this.startDateTime || "NA";
  //   this.endDateTime = this.endDateTime || "NA";
  //   this.productVariantCode = this.productVariantCode?.trim() || "NA";
  //   this.areaName = this.areaName?.trim() || "NA";
  //   this.floorName = this.floorName?.trim() || "NA";

  //   // Determine productName
  //   if (this.selectedProduct === "BEV") {
  //     this.productName = 'BEV';
  //   } else if (this.selectedProduct === "S230") {
  //     this.productName = 'S230';
  //   } else {
  //     this.productName = this.productName?.trim() || "NA";
  //   }

  //   // Determine palletStatusname
  //   if (this.selectedPalletStatus === "EMPTY") {

  //     console.log("1")
  //     this.palletStatusname = 'EMPTY';
  //   } else if (this.selectedPalletStatus === "FULL") {

  //     console.log("2")
  //     this.palletStatusname = 'FULL';
  //   } else {

  //     console.log("3")
  //     this.palletStatusname = this.palletStatus?.trim() || "NA";
  //   }

  //   // Fetch data
  //   this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByAllFilters(
  //     this.startDateTime,
  //     this.endDateTime,
  //     this.productVariantCode,
  //     this.floorName,
  //     this.areaName,
  //     this.productName,
  //     this.palletStatusname
  //   ).subscribe(currentPalletStockDetails => {
  //     console.log(currentPalletStockDetails);
  //     $('#currentPalletStockTableId').DataTable().clear().destroy();
  //     this.currentPalletStockDetailsList = currentPalletStockDetails;

  //     $(function () {
  //       $("#currentPalletStockTableId").DataTable();
  //     });
  //   });
  // }


  public editCurrentPalletStockDetails() {
    this.currentPalletStockDetailsService.editCurrentPalletStockDetails(this.editCurrentPalletStockDetailsInstance.currentPalletStockDetailsId, this.editCurrentPalletStockDetailsInstance).subscribe(
      editCurrentPalletStockList => {
        if (editCurrentPalletStockList.status == 200) {
          this.toastr.success('Current pallet stock details updated successfully.', 'Success', { timeOut: 5000, });
          // this.fetchAllCurrentPalletStockDetails({ page: "0", size: "10" });
          if (this.bevFullPalletCard === true) {
            this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
          }
          else if (this.s230FullPalletcard === true) {
            this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
          }
          else if (this.bevEmptyPalletCard === true) {
            this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
          }
          else if (this.s230EmptyPalletCard === true) {
            this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
          }
          else {
            this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
          }
        }
        else {
          this.toastr.warning('Current pallet stock details already exists', '', { timeOut: 5000, });
        }
      }
    );
  }

  public editCurrentPalletStockDetailsRow(editCurrentPalletStockDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.editCurrentPalletStockDetailsInstance = Object.assign({}, editCurrentPalletStockDetailsRowInstance);
    if (this.bevFullPalletCard === true) {
      this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
    }
    else if (this.s230FullPalletcard === true) {
      this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
    }
    else if (this.bevEmptyPalletCard === true) {
      this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
    }
    else if (this.s230EmptyPalletCard === true) {
      this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
    }
    else {
      this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
    }
  }






  // isManualDispatchEnabled(positionName: string): boolean {
  //   const masterPositionDetails = this.fetchAllMasterPositionDetailsList.find(
  //     position => position.positionName === positionName
  //   );

  //   if (!!masterPositionDetails) {

  //     if (this.currentUser?.roleName === Role.Admin || this.currentUser?.roleName === Role.Superwise) {
  //       // return true;
  //       return !!masterPositionDetails && masterPositionDetails.isManualDispatch !== 1;
  //     }
  //   }

  //   return false;
  // }

  isManualDispatchEnabled(positionName: string): boolean {
    const masterPositionDetails = this.fetchAllMasterPositionDetailsList.find(
      position => position.positionName === positionName
    );

    // Return true if masterPositionDetails exists and isManualDispatch is not 1
    return !!masterPositionDetails && masterPositionDetails.isManualDispatch !== 1 && masterPositionDetails?.positionIsActive == 1;
  }


  // hasRequiredRoles(): boolean {

  //   if (this.currentUser?.roleName === Role.Admin || this.currentUser?.roleName === Role.Superwise) {
  //     return true;
  //   } else if (this.currentUser?.roleName === Role.Operator) {
  //     return false;
  //   }
  //   return false;
  // }

  // onDispatchButtonClick(): void {
  //   const currentStockDetails: any = this.currentStockDetails;

  //   if (!this.isManualDispatchEnabled(currentStockDetails.positionName)) {
  //     if (this.currentUser?.roleName === Role.Operator) {

  //       this.toastr.warning('Access Denied. You do not have the required roles.', '', { timeOut: 5000 });
  //     }
  //     return;
  //   }

  //   this.dispatchCurrentStockDetailsRow(currentStockDetails);
  // }

  // isDispatchButtonDisabled(): boolean {
  //   return this.currentUser?.roleName === Role.Operator;
  // }




  public fetchAllMasterpositionDetails() {
    this.masterPositionDetailsService.fetchMasterPositionDetails().subscribe(mastePositionList => {
      this.fetchAllMasterPositionDetailsList = mastePositionList;
    });
  }

  dispatchCurrentStockDetailsRow(dispatchCurrentDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.dispatchCurrentDetailsForSelectedIdInstance = Object.assign({}, dispatchCurrentDetailsRowInstance);
    this.manualOutfeedPalletCode = this.dispatchCurrentDetailsForSelectedIdInstance.palletCode;
    this.addManualOutfeedMissionInstance.userName = this.currentPalletStockDetailsList[0].userName;
    this.addManualOutfeedMissionInstance.userId = this.currentPalletStockDetailsList[0].userId;
    this.addManualOutfeedMissionInstance.palletCode = this.manualOutfeedPalletCode
    {
      this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
        (addNewProductDetails: { status: number; }) => {
          // console.log("list" + JSON.stringify(addNewProductDetails));
          if (addNewProductDetails.status == 200) {
            // console.log("status" + addNewProductDetails.status)

            this.toastr.success('Pallet Code Dispatched Succesfully.', 'Success', { timeOut: 5000, });
            // this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
            if (this.bevFullPalletCard === true) {
              this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
            }
            else if (this.s230FullPalletcard === true) {
              this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
            }
            else if (this.bevEmptyPalletCard === true) {
              this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
            }
            else if (this.s230EmptyPalletCard === true) {
              this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
            }
            else {
              this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
            }

          }
          else if (addNewProductDetails.status == 201) {
            this.toastr.warning('Position is locked', '', { timeOut: 5000, });
          }

          else if (addNewProductDetails.status == 204) {

            this.toastr.warning('Position is not Active!', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 226) {

            this.toastr.warning('Pallet code not found', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 203) {

            this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 202) {
            this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }

          else if (addNewProductDetails.status == 207) {
            this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 208) {
            this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
          }

          else {

            this.toastr.warning('Pallet Code Already Exists', '', { timeOut: 5000, });
          }
        }
      )
    }

  }



  dispatchCurrentStockDetailsSerialNumber(dispatchCurrentDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.dispatchCurrentDetailsForSelectedIdInstance = Object.assign({}, dispatchCurrentDetailsRowInstance);
    this.manualOutfeedserialNumber = this.dispatchCurrentDetailsForSelectedIdInstance.serialNumber;
    this.addManualOutfeedMissionInstance.userName = this.currentPalletStockDetailsList[0].userName;
    this.addManualOutfeedMissionInstance.userId = this.currentPalletStockDetailsList[0].userId;
    this.addManualOutfeedMissionInstance.serialNumber = this.manualOutfeedserialNumber
    {
      this.manualOutfeedMissionDetailsService.addSerialNumberStockDetailsInManualOutfeed(this.addManualOutfeedMissionInstance).subscribe(
        (addNewProductDetails: { status: number; }) => {
          // console.log("list" + JSON.stringify(addNewProductDetails));
          if (addNewProductDetails.status == 200) {
            // console.log("status" + addNewProductDetails.status)

            this.toastr.success('Serial Number Dispatched Succesfully.', 'Success', { timeOut: 5000, });
            // this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
            if (this.bevFullPalletCard === true) {
              this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
            }
            else if (this.s230FullPalletcard === true) {
              this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
            }
            else if (this.bevEmptyPalletCard === true) {
              this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
            }
            else if (this.s230EmptyPalletCard === true) {
              this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
            }
            else {
              this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
            }
          }
          else if (addNewProductDetails.status == 201) {
            this.toastr.warning('Position is locked', '', { timeOut: 5000, });
          }

          else if (addNewProductDetails.status == 204) {

            this.toastr.warning('Position is not Active!', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 226) {

            this.toastr.warning('Serial Number not found', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 203) {

            this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
          }

          else if (addNewProductDetails.status == 202) {
            this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }

          else if (addNewProductDetails.status == 207) {
            this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }
          else {

            this.toastr.warning('Serial Number Already Exists', '', { timeOut: 5000, });
          }
        }
      )
    }

  }


  //Insert Pallet code in dispatch button logic
  public addPalletCodeDetails(addPalletCodeDetailsModalForm: NgForm) {
    // alert(this.manualOutfeedPalletCode)
    this.addManualOutfeedMissionInstance.palletCode = this.manualOutfeedPalletCode;

    this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
      (addNewProductDetails: { status: number; }) => {

        if (addNewProductDetails.status == 200) {
          // console.log("status" + addNewProductDetails.status)
          this.toastr.success('Pallet Code Dispatched Succesfully.', 'success', { timeOut: 5000, });

          if (this.bevFullPalletCard === true) {
            this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
          }
          else if (this.s230FullPalletcard === true) {
            this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
          }
          else if (this.bevEmptyPalletCard === true) {
            this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
          }
          else if (this.s230EmptyPalletCard === true) {
            this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
          }
          else {
            this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
          }


        }
        else if (addNewProductDetails.status == 204) {
          this.toastr.warning('Position is not Active!', '', { timeOut: 5000, });
        }

        else if (addNewProductDetails.status == 208) {
          this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 226) {
          this.toastr.warning('Pallet Code not found', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 203) {
          this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 202) {
          this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }

        else if (addNewProductDetails.status == 207) {
          this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }

        else if (addNewProductDetails.status == 201) {
          this.toastr.warning('Position is locked', '', { timeOut: 5000, });
        }
        else {

          this.toastr.warning('Pallet Code Not Exists', '', { timeOut: 5000, });
        }
      }
    )
    addPalletCodeDetailsModalForm.reset();
  }


  public addSerialNumberDetails(addBPSerialNoForm: NgForm) {
    //  alert(this.manualOutfeedSerialNumber);
    this.addManualOutfeedMissionInstance.serialNumber = this.manualOutfeedSerialNumber;

    this.manualOutfeedMissionDetailsService.addSerialNumberStockDetailsInManualOutfeed(this.addManualOutfeedMissionInstance).subscribe(
      (addProductDetails: { status: number; }) => {

        if (addProductDetails.status == 200) {
          // console.log("status" + addProductDetails.status)
          this.toastr.success('Serial Number Dispatched Succesfully.', 'success', { timeOut: 5000, });
          // this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
          if (this.bevFullPalletCard === true) {
            this.selectedBEV({ page: '0', size: '10' }, 'BEV', 'FULL')
          }
          else if (this.s230FullPalletcard === true) {
            this.selectedS230({ page: '0', size: '10' }, 'S230', 'FULL')
          }
          else if (this.bevEmptyPalletCard === true) {
            this.fetchAllEmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'BEV')
          }
          else if (this.s230EmptyPalletCard === true) {
            this.fetchAllS230EmptyPalletList({ page: '0', size: '10' }, 'EMPTY', 'S230')
          }
          else {
            this.fetchAllCurrentStockDetails({ page: "0", size: "10" });
          }

        }
        else if (addProductDetails.status == 204) {
          this.toastr.warning('Position is not Active!', '', { timeOut: 5000, });
        }

        else if (addProductDetails.status == 208) {
          this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
        }
        else if (addProductDetails.status == 226) {
          this.toastr.warning('Serial Number Not Found', '', { timeOut: 5000, });
        }

        else if (addProductDetails.status == 203) {

          this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
        }
        else if (addProductDetails.status == 202) {
          this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }

        else if (addProductDetails.status == 207) {
          this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addProductDetails.status == 201) {
          this.toastr.error('Position is locked.', '', { timeOut: 5000, });
        }
        else {
          alert("Pallet Code not Exist");
          this.toastr.warning('Pallet Code Not Exists', '', { timeOut: 5000, });
        }
      }
    )
    addBPSerialNoForm.reset();
  }

  public generateCurrentPalletStockDetailsExcelReport() {
    if (this.currentPalletStockDetailsList.length === 0) {

      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
      return;
    }
    if (this.currentPalletStockDetailsList.length > 0) {


      //  const logoBase64Logo = "";
      const headerRowsCount = 13;

      // const title = 'Current Pallet Stock Details Report';
      const title = 'Current Pallet Stock Details Report' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');

      const header = ["Sr.No", "Pallet Code", "BP Serial Number", "Part No", "Part Name", "Model", "Batch Number", "Quantity", "Quality Status", "Ageing Days",
        "Pallet Status Name", "MFG Date", "Load Date Time", "Location",
      ];

      // Convert the id to sr.no
      for (let i = 0; i < this.currentPalletStockDetailsList.length; i++) {
        this.currentPalletStockDetailsList[i].currentPalletStockDetailsId = (i + 1)
      }

      const data = this.currentPalletStockDetailsList.map((obj) =>
        Object.values({

          currentPalletStockDetailsId: obj.currentPalletStockDetailsId,
          palletCode: obj.palletCode,
          serialNumber: obj.serialNumber,
          productVariantCode: obj.productVariantCode,

          productName: obj.productVariantName,
          productVaritantName: obj.productName,
          batchNumber: obj.batchNumber,
          quantity: obj.quantity,
          qualityStatus: obj.qualityStatus,
          ageingDays: obj.ageingDays,

          palletStatusname: obj.palletStatusname,

          mfgDate: obj.mfgDate,
          loadDatetime: obj.loadDatetime,

          positionName: obj.positionName,

        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Current Pallet Stock Details');

      // Add new row
      let titleRow = worksheet.addRow([title]);

      // Set font, size and style in title row.
      titleRow.font = { name: 'Calibri', family: 4, size: 22 };
      // Align the title in the center
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      //Merge Cells
      worksheet.mergeCells(`A${titleRow.number}:N${titleRow.number}`);
      // worksheet.mergeCells("S1:S3");

      // Blank Row
      worksheet.addRow([]);

      //Add row with current date
      //let subTitleRow = worksheet.addRow(['Date & Time : ' + (new Date().toLocaleString())]);

      // Add Image
      // let logo = workbook.addImage({
      //   base64: logoBase64Logo,
      //   extension: 'png',
      // });
      // worksheet.addImage(logo, 'S1:S3');

      //Add Header Row
      let headerRow = worksheet.addRow(header);
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' },
          // bgColor: { argb: 'FF0000FF' }
        }
        cell.font = {

          color: { argb: 'FFFFFF' },
          size: 12,
          bold: true,
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });



      // Add all data without formatting
      worksheet.addRows(data);

      // Used to delete the column
      // worksheet.spliceColumns(21, 10);
      // worksheet.spliceColumns(20,1);

      // To give the width to the column
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 15;
      worksheet.getColumn(7).width = 15;
      worksheet.getColumn(8).width = 15;
      worksheet.getColumn(9).width = 15;
      worksheet.getColumn(10).width = 15;
      worksheet.getColumn(11).width = 15;
      worksheet.getColumn(12).width = 15;
      worksheet.getColumn(13).width = 15;
      worksheet.getColumn(14).width = 30;
      worksheet.getColumn(15).width = 30;
      worksheet.getColumn(16).width = 20;
      worksheet.getColumn(17).width = 20;



      // worksheet.addRow([]);

      //Footer Row
      let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' }
      };
      footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      // Align the footer in the center
      worksheet.getCell('A' + (data.length + headerRowsCount + 1)).alignment = { vertical: 'middle', horizontal: 'center' };
      // console.log(data.length + headerRowsCount + 1);

      //Merge Cells
      worksheet.mergeCells(`A${footerRow.number}:N${footerRow.number}`);

      // Save the file in Excel format
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // const fileName="ProdData"+(new Date().getDay())+(new Date().getMonth())+(new Date().getFullYear())+(new Date().getTime())+(new Date().getMinutes())+(new Date().getSeconds());


        const todayDate = new Date();
        console.log(todayDate);

        const fileName = "CurrentPalletStockDetails_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
    }
  }

  header = [["Sr.No", "Pallet Code", "BP Serial Number", "Part No", "Part Name", "Model", "Batch Number", "Quantity", "Quality Status", "Ageing Days",
    "Pallet Status Name", "MFG Date", "Load Date Time", "Location"]];



  // createPdf() {

  //   if (this.currentPalletStockDetailsList.length === 0) {
  //     this.toastr.warning('Data is not available.', '', { timeOut: 5000, });
  //     return;
  //   }

  //   // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.currentPalletStockDetailsList.length; i++) {
  //     this.currentPalletStockDetailsList[i].currentPalletStockDetailsId = (i + 1);
  //   }
  //   const Tabledata = this.currentPalletStockDetailsList.map((obj) =>
  //     Object.values({
  //       currentPalletStockDetailsId: obj.currentPalletStockDetailsId,
  //       palletCode: obj.palletCode,
  //       serialNumber: obj.serialNumber,
  //       productVariantCode: obj.productVariantCode,
  //       productVariantName: obj.productVariantName,
  //       productVaritantName: obj.productName,
  //       batchNumber: obj.batchNumber,
  //       quantity: obj.quantity,
  //       qualityStatus: obj.qualityStatus,
  //       ageingDays: obj.ageingDays,

  //       palletStatusname: obj.palletStatusname,
  //       floorName: obj.floorName,
  //       loadDatetime: obj.loadDatetime,

  //       positionName: obj.positionName,

  //     }
  //     )

  //   );

  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('Current Pallet Stock Details Report', 11, 8);
  //   doc.text('User:', 150, 8); doc.text(this.authService.currentUserValue.userName, 165, 8);

  //   doc.setFontSize(12);
  //   doc.setTextColor(100);
  //   doc.setLineWidth(2);

  //   doc.text('', 10, 10);
  //   doc.setFont('Italic');
  //   //   alert('111')

  //   (doc as any).autoTable({

  //     head: this.header,
  //     body: Tabledata,

  //     theme: 'grid',
  //     didDrawCell: (data: { column: { index: any; }; }) => {
  //       console.log(data.column.index)
  //     },

  //   })


  //   const todayDate = new Date();
  //   const fileName = 'CurrentPalletStockDetails_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

  //   doc.save(fileName + '.pdf');

  // }

  createPdf() {
    if (this.currentPalletStockDetailsList.length === 0) {
      this.toastr.warning('Data is not available for the report.', '', { timeOut: 5000 });
      return;
    }

    // Assign Serial Number to each entry
    for (let i = 0; i < this.currentPalletStockDetailsList.length; i++) {
      this.currentPalletStockDetailsList[i].currentPalletStockDetailsId = (i + 1);
    }

    // Prepare Data for Table
    const Tabledata = this.currentPalletStockDetailsList.map((obj) =>
      Object.values({
        currentPalletStockDetailsId: obj.currentPalletStockDetailsId,
        palletCode: obj.palletCode,
        serialNumber: obj.serialNumber,
        productVariantCode: obj.productVariantCode,
        productVariantName: obj.productVariantName,
        productName: obj.productName,
        batchNumber: obj.batchNumber,
        quantity: obj.quantity,
        qualityStatus: obj.qualityStatus,
        ageingDays: obj.ageingDays,
        palletStatusname: obj.palletStatusname,
        mfgDate: obj.mfgDate,
        loadDatetime: obj.loadDatetime,
        positionName: obj.positionName,
      })
    );

    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

    // Add Title and User Information
    const title = 'CURRENT PALLET STOCK DETAILS REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);

    // Define Table Headers
    const headers = [['Sr.No', 'Pallet Code', 'Serial Number', 'Part No', 'Part Name', 'Product Name', 'Batch Number', 'Quantity', 'Quality Status', 'Ageing Days', 'Pallet Status', "MFG Date", 'Load Date Time', 'Position Name']];

    // Set Table with AutoTable Plugin
    (doc as any).autoTable({
      head: headers,
      body: Tabledata,
      startY: 50, // Start position for the table
      theme: 'grid',
      headStyles: {
        fillColor: [68, 114, 196], // Header background color
        textColor: [255, 255, 255], // White text
        fontSize: 12,
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      styles: {
        cellPadding: 4,
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.1,
        overflow: 'linebreak', // Handle overflow for long text
        columnWidth: 'wrap', // Set column width dynamically
      },
      columnStyles: {
        1: { cellWidth: 70 }, // Reduced width for Pallet Code
        2: { cellWidth: 60 }, // Reduced width for Serial Number
        3: { cellWidth: 60 },
        4: { cellWidth: 100 },
        5: { cellWidth: 100 },
        6: { cellWidth: 100 },
        7: { cellWidth: 60 },
        8: { cellWidth: 60 },
        9: { cellWidth: 60 },
        10: { cellWidth: 60 },
        11: { cellWidth: 100 },
        12: { cellWidth: 100 },
        13: { cellWidth: 80 },
        14: { cellWidth: 100 },
      },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'CurrentPalletStockDetails_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }




  //for toggle button 
  // toggleQualityApprovedStatus(data: any) {
  //   if (data.qualityApprovedStatus == 1) {
  //     data.qualityApprovedStatus = 0;
  //     this.editCurrentPalletStockDetailsRow(data)
  //   } else {
  //     data.qualityApprovedStatus = 1;
  //     this.editCurrentPalletStockDetailsRow(data)
  //   }
  // }

  // //for toggle button 
  // toggleRejectStatus(data: any) {
  //   if (data.rejectStatus == 1) {
  //     data.rejectStatus = 0;
  //     this.editCurrentPalletStockDetailsRow(data)
  //   } else {
  //     data.rejectStatus = 1;
  //     this.editCurrentPalletStockDetailsRow(data)
  //   }
  // }

  public fetchMasterProductData() {
    this.masterProductDetailsService.fetchAllMasterProductDetails().subscribe(
      productDetailsList => {
        $('#prodId').DataTable().clear().destroy();

        this.masterProductDetailsTableList = productDetailsList;
        // console.log("this.masterProductDetailsTableList" + this.masterProductDetailsTableList)
        // add this code with table id to convert data as Datatable
        $(function () {
          $("#prodId").DataTable();
        });
      }
    );
  }







  public fetchAllCurrentStockDetails(request: any) {
    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetails(request).subscribe(currentStockList => {
      // $('#stockTableId').DataTable().clear().destroy();


      this.currentPalletStockDetailsList = currentStockList['content'];
      this.totalElements = currentStockList['totalElements'];
      // console.log("currentPalletStockDetailsList", this.currentPalletStockDetailsList);


      this.bevList = this.currentPalletStockDetailsList.filter(list => list.productName == "BEV");
      // console.log("11111111" + JSON.stringify(this.bevList))

      this.s230List = this.currentPalletStockDetailsList.filter(item => item.productName == "S230");

      // console.log("1111")
      // console.log("bevList44444444444444" + JSON.stringify(this.bevList));
      // console.log("s230List" + JSON.stringify(this.s230List));

      //  $('#currentPalletStockTableId').DataTable().clear().destroy();


      //this.initializeDataTable();
    },
      error => {
        console.log(error.error.message);
      }
    );

  }



  // public selectedPouch(request:any) {
  //   $('#currentPalletStockTableId').DataTable().clear().destroy();

  //   this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetails(request).subscribe(currentStockList =>{

  //     this.currentPalletStockDetailsList = currentStockList['content'];
  //     this.totalElements = currentStockList['totalElements'];
  //     console.log("currentPalletStockDetailsList1", this.currentPalletStockDetailsList);

  //     this.bevList=this.currentPalletStockDetailsList.filter(item => item.productName==="BEV");
  //     this.bevList1=(JSON.stringify(this.bevList));
  //     console.log("00000"+JSON.stringify(this.bevList))
  //    $('#currentPalletStockTableId').DataTable().clear().destroy();


  //    // this.initializeDataTable();
  //   },
  //   error => {
  //     console.log(error.error.message);
  //   }
  // );
  //   //console.log("pouchDetailsList"+JSON.stringify(this.pouchDetailsList));
  //   //console.log("TinDetailsList"+JSON.stringify(this.TinDetailsList));
  // }


  dataType: string = '';



  public selectedBEV(request: any, dataType: string, dataType1: string): void {
    this.bevFullPalletCard = true;
    this.dataType = dataType;
    this.dataType1 = dataType1;
    this.resetData();
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.selectedProduct = "BEV";
    this.selectedPalletStatus = "FULL"
    // console.log("selectedProduct!!!!" + this.selectedProduct)
    if (dataType === 'BEV' && dataType1 === 'FULL') {
      this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsBev(request).subscribe(
        currentPalletList => {

          this.currentPalletStockDetailsList = currentPalletList['content'];

          this.totalElements = currentPalletList['totalElements'];
          // console.log("currentPalletStockDetailsList11111111111" + this.currentPalletStockDetailsList);
          // console.log(this.currentPalletStockDetailsList);
        },
        error => {
          console.log(error.error.message);
        }
      );
    } else {

      this.fetchAllCurrentPalletStockDetails(request);
    }
  }



  public selectedS230(request: any, dataType: string, dataType1: string): void {
    this.dataType = dataType;
    this.s230FullPalletcard = true;
    this.dataType1 = dataType1;
    this.resetData();
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.selectedProduct = "S230";
    this.selectedPalletStatus = "FULL"
    if (dataType === 'S230' && dataType1 === 'FULL') {
      this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsS230(request).subscribe(
        currentPalletList => {
          this.currentPalletStockDetailsList = currentPalletList['content'];
          this.totalElements = currentPalletList['totalElements'];
          // console.log("currentPalletStockDetailsList" + this.currentPalletStockDetailsList);
        },
        error => {
          console.log(error.error.message);
        }
      );
    } else {

      this.fetchAllCurrentPalletStockDetails(request);
    }
  }



  // Modify nextPage method to handle pagination for BEV
  nextPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsRequestPage = {
      page: event.pageIndex,
      size: event.pageSize
    };

    if (this.dataType === 'BEV' && this.dataType1 === 'FULL') {
      this.selectedBEV(request, this.dataType, this.dataType1);
    }
    else if (this.dataType === 'S230' && this.dataType1 === 'FULL') {
      this.selectedS230(request, this.dataType, this.dataType1);
    }
    else if (this.dataType === 'EMPTY' && this.dataType1 === 'BEV') {
      this.fetchAllEmptyPalletList(request, this.dataType, this.dataType1);
    }
    else if (this.dataType === 'EMPTY' && this.dataType1 === 'S230') {
      this.fetchAllS230EmptyPalletList(request, this.dataType, this.dataType1);
    }
    // else if(this.isSearchFilterOpen) {
    //   this.fetchCurrentPalletStockDetailsByAllFilters(request, true);
    // }
    else {
      this.fetchAllCurrentPalletStockDetails(request);
    }
  }





  getEmptyPositionAlarm(): void {
    this.masterPositionDetailsService.findEmptyPositionAlarm().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData = response.body;
          const message = this.responseData.message;
          // console.log('Response from backend:', message);

          $('#confirmationModel1').modal('show');
        }
      },
      error => {
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }

  getAlarmForPosition(): void {

    this.masterPositionDetailsService.getAlarm().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseDataforAudio = response.body;
          const message = this.responseDataforAudio.message;
          // console.log('Response from backend**********:', message);
          // console.log("Fetching alarm...");
          $('#confirmationModel1').modal('show');

        }
        else if (response.status === 208) {
          $('#confirmationModel1').modal('hide');
        }
      },
      error => {
        $('#confirmationModel1').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }

  loadDashboardDetails(): void {
    const startTime = performance.now(); // Start time tracking

    this.dashboardDetailsService.getDashboardDetails().subscribe(
      data => {
        this.dashboardDetails = data;
        const endTime = performance.now(); // End time tracking
        // console.log(`Dashboard data loaded in ${endTime - startTime} ms`);
        // console.log(this.dashboardDetails.bevInfeedCount);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  dataType1: string = '';

  fetchAllEmptyPalletList(request: any, dataType: string, dataType1: string): void {
    this.bevEmptyPalletCard = true;
    this.dataType = dataType;
    this.dataType1 = dataType1;
    this.resetData();
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.selectedPalletStatus = "EMPTY";
    this.selectedProduct = "BEV"
    if (dataType === 'EMPTY' && dataType1 === 'BEV') {
      this.currentPalletStockDetailsService.fetchAllEmptyPalletList(request).subscribe(
        emptyDetailsList => {
          this.currentPalletStockDetailsList = emptyDetailsList['content'];
          this.totalElementsEmpty = emptyDetailsList['totalElements'];
          // console.log("CurrentStockS230DetailsList", this.currentPalletStockDetailsList);
        },
        error => {
          console.log(error.error.message);
        }
      );
    } else {
      this.fetchAllCurrentPalletStockDetails(request);
    }
  }





  fetchAllS230EmptyPalletList(request: any, dataType: string, dataType1: string): void {
    this.s230EmptyPalletCard = true;
    this.dataType = dataType;
    this.dataType1 = dataType1;
    this.resetData();
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.selectedPalletStatus = "EMPTY";
    this.selectedProduct = "S230"
    if (dataType === 'EMPTY' && dataType1 === 'S230') {
      this.currentPalletStockDetailsService.fetchAllEmptyPalletListS230(request).subscribe(
        emptyS230DetailsList => {
          this.currentPalletStockDetailsList = emptyS230DetailsList['content'];
          this.totalElementsEmptyS230 = emptyS230DetailsList['totalElements'];
          // console.log("CurrentStockS230DetailsList", this.currentPalletStockDetailsList);
        },
        error => {
          console.log(error.error.message);
        }
      );
    } else {
      this.fetchAllCurrentPalletStockDetails(request);
    }
  }


  loadAgeingDays(): void {
    this.agingReportDetails.findAgeingDays().subscribe(
      (data: CurrentPalletStockDetailsModel[]) => {
        this.palletStockList = data;
        // console.log('Pallet Stock Data:', data);
      },
      error => {
        console.error('Error loading pallet stock data:', error);
      }
    );
  }

  public findPalletDetailsByPalletCode(event: Event) {
    event.preventDefault();
    this.palletCodeList = [];

    this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByPalletCode(this.palletCode).subscribe(
      palletCodeListData => {
        this.palletCodeList = palletCodeListData;


        if (this.palletCodeList.length > 0) {

          this.binLocation = this.palletCodeList[0].positionName;
          this.userName = this.palletCodeList[0].userName;
        } else {

          this.binLocation = 'N/A';
          this.userName = 'N/A';
        }
        // console.log("pallet code  List: ", this.palletCodeList);
        // console.log("Searched Pallet Code: ", this.palletCode);
      },
      error => {
        console.error("Error fetching palletCodeList details: ", error);
      }
    );
  }



  public findPalletDetailsBySerialNumber(event: Event) {
    event.preventDefault();
    this.serialNumberList = [];

    this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsBySerialNumber(this.serialNumber).subscribe(
      SerialListData => {
        this.serialNumberList = SerialListData;

        if (this.serialNumberList.length > 0) {

          this.binLocation = this.serialNumberList[0].positionName;
          this.userName = this.serialNumberList[0].userName;
        } else {

          this.binLocation = 'N/A';
          this.userName = 'N/A';
        }

        // console.log("Serial Number List: ", this.serialNumberList);
        // console.log("Searched Serial Number: ", this.serialNumber);
      },
      error => {
        console.error("Error fetching serial number details: ", error);
      }
    );
  }



  onAddMockDrillMission(areaName: string): void {
    // console.log('Area Name:', areaName);
    this.mockDrillMissionService.addMockDrillMissionDetails(areaName).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.toastr.success('Mission added successfully.', '', { timeOut: 5000 })
          $('#confirmationModel2').modal('hide');
        }
        else if (response.status === 226) {
          this.toastr.error('Empty Pallet Not Found.', '', { timeOut: 5000 })

        } else if (response.status === 208) {
          this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

        } else if (response.status === 201) {
          this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

        }


      },
      (error) => {
        console.error(`${areaName} - Error adding mission details:`, error);
      }
    );
  }


  onAddMockDrillMissionForArea2(areaName: string): void {
    // console.log('Area Name:', areaName);
    this.mockDrillMissionService.addMockDrillMissionDetails(areaName).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.toastr.success('Mission added successfully.', '', { timeOut: 5000 })
          $('#confirmationModel3').modal('hide');
        }
        else if (response.status === 226) {
          this.toastr.error('Empty Pallet Not Found.', '', { timeOut: 5000 })

        } else if (response.status === 208) {
          this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

        } else if (response.status === 201) {
          this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

        }


      },
      (error) => {
        console.error(`${areaName} - Error adding mission details:`, error);
      }
    );
  }


  getAlarmForArea1(): void {
    // console.log("Fetching alarm...");
    this.mockDrillMissionService.getAlarmForArea1().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData2 = response.body;
          const message = this.responseData2.message;
          console.log('Response from backend**********:', message);

          $('#confirmationModel2').modal('show');

          // $('#confirmationModel1').modal('hide');


        }
        else if (response.status === 208) {
          $('#confirmationModel2').modal('hide');
        }
      },
      error => {
        $('#confirmationModel2').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    )
  }


  getAlarmForArea2(): void {
    // console.log("Fetching alarm...");
    this.mockDrillMissionService.getAlarmForArea2().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData3 = response.body;
          const message = this.responseData3.message;
          // console.log('Response from backend**********:', message);

          $('#confirmationModel3').modal('show');
          // $('#confirmationModel1').modal('hide');
        }
        else if (response.status === 208) {
          $('#confirmationModel3').modal('hide');
        }
      },
      error => {
        $('#confirmationModel3').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }



  fetchAllMismatchCell(): void {
    this.masterPositionDetailsService.fetchAllMismatchCell().subscribe(
      (response: HttpResponse<any>) => {

        if (response.status === 200) {
          this.responseDataMismatchCell = response.body;
          const message = this.responseDataMismatchCell.message;
          // console.log(message)
          $('#confirmationModel77').modal('show');
        }
        else if (response.status === 208) {
          $('#confirmationModel77').modal('hide');
        }

      },
      error => {
        $('#confirmationModel5').modal('hide');
        // console.error('Error fetching empty data mismatch:', error);
      }
    );

  }

}









