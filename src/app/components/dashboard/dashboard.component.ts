import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import ApexCharts from 'apexcharts';
import { Modal } from 'bootstrap';
import { ChartComponent } from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject, Subscription } from 'rxjs';
import { MesConnectionDetails } from 'src/app/models/MesConnectionDetails.model';
import { AsrsOrderDetailsModel } from 'src/app/models/asrsOrderDetails.model';
import { BufferDetailsModel } from 'src/app/models/bufferDetails.model';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { CurrentStockDetails } from 'src/app/models/currentStockDetail';
import { DashboardDetailsModel } from 'src/app/models/dashboardDetails.model';
import { InfeedMissionRuntimeDetailsModel } from 'src/app/models/infeedMissionRuntimeDetails.model';
import { MannualRetrivalOrderModel } from 'src/app/models/mannual-retrival-order.model';
import { ManualOutfeedMissionDetailsModel } from 'src/app/models/manualOutfeedMissionDetails.model';
import { MasterShiftDetailsModel } from 'src/app/models/master-shift-details.model';
import { MasterProductVariantDetailsModel } from 'src/app/models/masterProductVariantDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { OutfeedMissionRuntimeDetailsModel } from 'src/app/models/outfeedMissionRuntimeDetails.model';
import { AsrsOrderDetailsService } from 'src/app/service/asrsOrderDetails.service';
import { AuthenticationService } from 'src/app/service/auth.service';
import { BufferDetailsService, FetchAllBufferPalletStockDetailsRequestPage } from 'src/app/service/bufferDetails.service';
import { CurrentPalletStockDetailsService, FetchAllCurrentPalletStockDetailsByQualityStausRequests, FetchAllCurrentPalletStockDetailsRequestPage } from 'src/app/service/currentPalletStockDetails.service';

import { DashboardDetailsService, FetchAllCurrentPalletStockDetailsByQualityStausRequest } from 'src/app/service/dashboardDetails.service';
import { MannualRetrivalOrderService } from 'src/app/service/mannual-retrival-order.service';
import { ManualOutfeedMissionDetailsService } from 'src/app/service/manualOutfeedMissionDetails.service';
import { MasterShiftDetailsService } from 'src/app/service/master-shift-details.service';
import { MasterProductVariantDetailsService } from 'src/app/service/masterProductVariantDetails.service';
import { MasterPositionDetailsService } from 'src/app/service/masterpositionDetails.service';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
import { Options } from 'src/app/utils/column-chartoptions';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('addEngineDispatchScheduleModalForm') dispatchForm!: NgForm;
  private subscriptions: Subscription = new Subscription();
  dashboardUpdated: Subject<void> = new Subject<void>();
  currentUser: MasterUserDetailsModel | undefined;
  selectedShiftName: string = "";
  dispatchOrderNumber!: string;
  dispatchStatus: string = "READY"
  shiftId!: number;
  shiftName!: string;
  serialNumber1!: number;
  serialNumber2!: number;
  productName!: string;
  orderBatchNumber!: string;
  validationMessage: string = '';
  isproductNameValidated: boolean = false;
  palletStockDetails: CurrentPalletStockDetailsModel[] = [];
  currentStockDetails: CurrentStockDetails = new CurrentStockDetails();
  allCurrentPalletStockDetailsDtOptions: DataTables.Settings = {
    searching: true,

  };
  showBEVInfeedTable: boolean = false;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  mesConnectionDetailsList: MesConnectionDetails[] = [];
  infeedMissionDtOptions: DataTables.Settings = {};
  dashboardDetails: DashboardDetailsModel = new DashboardDetailsModel();
  productVariantDropDownList: MasterProductVariantDetailsModel[] = [];
  dashboardDetailsList: DashboardDetailsModel = new DashboardDetailsModel();
  dashboardDetailsList2: DashboardDetailsModel = new DashboardDetailsModel();
  manualRetrivalOrderList: MannualRetrivalOrderModel[] = [];
  dashboardDetailsokCountList: DashboardDetailsModel = new DashboardDetailsModel();
  dashboardDetailsList1: DashboardDetailsModel = new DashboardDetailsModel();
  infeedMissionRuntimeDetailsList: InfeedMissionRuntimeDetailsModel[] = [];
  s230infeedMissionRuntimeDetailsList: InfeedMissionRuntimeDetailsModel[] = [];
  outfeedMissionRuntimeDetailsList: OutfeedMissionRuntimeDetailsModel[] = [];
  totalInfeedMissionRuntimeDetailsList: InfeedMissionRuntimeDetailsModel[] = [];
  totalOutfeedMissionRuntimeDetailsList: OutfeedMissionRuntimeDetailsModel[] = [];
  CurrentStockDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockOkDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockBEVOkDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockBEVNOkDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockS230OkDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockS230NOkDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockBevDetailsList: CurrentPalletStockDetailsModel[] = [];
  CurrentStockS230DetailsList: CurrentPalletStockDetailsModel[] = [];
  EmptyPalletDetailsDetailsList: CurrentPalletStockDetailsModel[] = [];
  S230EmptyPalletDetailsDetailsList: CurrentPalletStockDetailsModel[] = [];
  BufferDetailsList: BufferDetailsModel[] = [];
  S230BufferPalletDetails: BufferDetailsModel[] = [];
  CurrentStockNOkDetailsList: CurrentPalletStockDetailsModel[] = [];
  editCurrentPalletStockDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  dispatchCurrentDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  addManualOutfeedMissionInstance: ManualOutfeedMissionDetailsModel = new ManualOutfeedMissionDetailsModel();
  manualOutfeedPalletCode!: string;
  currentPalletStockDetailsList: CurrentPalletStockDetailsModel[] = [];
  fetchAllMasterPositionDetailsList: MasterPositionDetailsModel[] = [];
  current: CurrentPalletStockDetailsModel[] = [];

  //for ASRS Order Details
  asrsOrderDetailsList: AsrsOrderDetailsModel = new AsrsOrderDetailsModel;
  // dtOptions: DataTables.Settings = {};

  productionTrendData!: number[];
  // currentStockData: number[] = [];
  totalCurrentStockCount: number[] = [];
  alarmCountData: number[] = [];
  bevInfeedCount: number[] = [];
  bevOutfeedCount: number[] = [];
  s230InfeedCount: number[] = [];
  s230OutfeedCount: number[] = [];
  dateTimeChart: string[] = [];
  qualityStatus: string = 'OK';
  qualityStatus1: string = 'NOK';


  totalElements: number = 0;
  itemsPerPage: number = 10;
  currentPage = 1;


  itemsPerPageNOK: number = 10;
  totalElementsNOK: number = 0;
  currentPagesNOK: number = 1;

  itemsPerPageS230OK: number = 10;
  totalElementsS230OK: number = 0;
  currentPagesS230OK: number = 1;

  itemsPerPageS230NOK: number = 10;
  totalElementsS230NOK: number = 0;
  currentPagesS230NOK: number = 1;


  itemsPerPageS230: number = 10;
  totalElementsS230: number = 0;
  currentPagesS230: number = 1;

  itemsPerPageBev: number = 10;
  totalElementsBev: number = 0;
  currentPagesBev: number = 1;
  data: any;
  responseData: any;
  duplicatePallet: any;


  itemsPerPageEmpty: number = 10;
  totalElementsEmpty: number = 0;
  currentPagesEmpty: number = 1;



  itemsPerPageS230Empty: number = 10;
  totalElementsS230Empty: number = 0;
  currentPagesS230Empty: number = 1;




  itemsPerPageBufferPallet: number = 10;
  totalElementsBufferPallet: number = 0;
  currentPagesBufferPallet: number = 1;



  itemsPerPageS230BufferPallet: number = 10;
  totalElementsS230BufferPallet: number = 0;
  currentPagesS230BufferPallet: number = 1;
  dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  responseData1: any;
  responseData2: any;
  responseDataforRetrival: any;
  responseDataforAudio: any;
  responseDataforNoEmpty: any;
  responseDataMismatchCell: any;
  private intervalIds: any[] = []; // Store all interval IDs
  // ngOnDestroy() {
  //   console.log("destroy timer")
  //   clearInterval(this.intervalId)
  // }


  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }

  chartDataUpdate() {
    var chart = new ApexCharts(
      document.querySelector("#column-chart"),
      this.chartOptions
    );


    chart.render();


    // this.intervalId = setInterval(() => {
    this.ngZone.run(() => {

      this.fetchProductionsTrendDetailsWithInterval();

      chart.updateSeries([{
        name: 'BEV PickList Count',
        data: this.bevOutfeedCount,

      }, {
        name: 'S230 PickList Count',
        data: this.s230InfeedCount,
      }, {
        name: 'BEV Put Away Count',
        data: this.bevInfeedCount,
      }, {
        name: 'S230 Put Away Count',
        data: this.s230OutfeedCount,
      }
      ]);

    });

    // }, 120000);


  }
  ngOnInit(): void {
    this.SessionClearMethod();


    this.loadShiftDetails();


    this.currentUser = this.authService.currentUserValue;


    this.loadDashboardData();
    this.fetchAllMismatchCell();
    this.fetchAllDuplicatePalletCode();

    this.subscriptions.add(
      interval(120000).subscribe(() => {
        this.loadDashboardData();
      })
    );


    this.subscriptions.add(
      interval(300000).subscribe(() => {
        this.fetchAllMismatchCell();
        this.fetchAllDuplicatePalletCode();
      })
    );
  }



  private loadShiftDetails(): void {
    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        if (currentShift) {
          this.selectedShiftName = currentShift.shiftName;
          this.shiftId = currentShift.shiftId;
        }
      },
      (error) => {
        console.error('Error fetching current shift:', error);
      }
    );
  }

  private loadDashboardData(): void {
    this.loadDashboardDetails();
    this.getTotalOutfeedCount();
    this.getTotalInfeedCount();
    this.fetchProductionsTrendDetailsWithInterval();
    this.fetchMesConnectionDetails();
    this.getEmptyPositionAlarm();
    this.getAlarmForPosition();
  }

  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }


  public fetchMesConnectionDetails() {
    this.mannualRetrivalService.fetchMesConnectionDetails().subscribe(fetchMesList => {
      this.mesConnectionDetailsList = fetchMesList;

    })
  }

  public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');  // If you store user details
    const userRoles = sessionStorage.getItem('userRoles'); // If you store roles/permissions

    sessionStorage.clear(); // Clear all session storage

    // Restore only authentication-related values to prevent logout
    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('dashboardLoaded', 'true'); // Mark dashboard as loaded
  }


  gotoList() {
    this.router.navigate(['monitor/current-stock-details/']);
  }

  goToBatteryAlarm() {
    console.log("gett link")
    window.open(
      'http://10.192.65.167:8085/BatteryPackalarmdashboard', '_blank'
    );
  }

  ngAfterViewInit(): void {

    $('#currentPalletStockDetailsDtOptions').DataTable();
  }
  @ViewChild("production-trend-chart")
  columnchart!: ChartComponent;
  public chartOptions!: Partial<Options> | any;



  intervalId: any;
  totalInfeedCount!: number;
  totalOutfeedCount!: number;
  dashboardTotalOutfeedCount!: number;
  dashboardTotalInfeedCount!: number;




  constructor(private dashboardDetailsService: DashboardDetailsService,
    private shiftDetailsService: MasterShiftDetailsService,
    private asrsOrderDetailsService: AsrsOrderDetailsService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private manualOutfeedMissionDetailsService: ManualOutfeedMissionDetailsService,
    private masterPrductVariantDetailsService: MasterProductVariantDetailsService,
    private masterPositionDetailsService: MasterPositionDetailsService,
    private currentPalletStockDetailsService: CurrentPalletStockDetailsService,
    private mannualRetrivalService: MannualRetrivalOrderService,
    private bufferDetaislService: BufferDetailsService,
    private mockDrillMissionService: TemperatureAlarmMissionRuntimeDetailsService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthenticationService,) {

    this.fetchProductionsTrendDetailsWithInterval();



    this.chartOptions = {
      series: [
        // {
        //   name: "BEV Dispatch Count",
        //   group: "BEV",
        //   data: this.bevOutfeedCount,
        // },
        // {
        //   name: "S230 Dispatch Count",
        //   group: "S230",
        //   data: this.s230OutfeedCount,
        // },
        // {
        //   name: "BEV IN Count",
        //   group: "BEV",
        //   data: this.bevInfeedCount,
        // },
        // {
        //   name: "S230 IN Count",
        //   group: "S230",
        //   data: this.s230InfeedCount,
        // }

        {
          name: "BEV IN Count",
          group: "BEV",
          data: this.bevInfeedCount,
        },
        {
          name: "S230 IN Count",
          group: "S230",
          data: this.s230InfeedCount,
        },
        {
          name: "BEV Dispatch Count",
          group: "BEV",
          data: this.bevOutfeedCount,
        },
        {
          name: "S230 Dispatch Count",
          group: "S230",
          data: this.s230OutfeedCount,
        },

      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: '100%'
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '80%',
        }
      },
      xaxis: {
        categories: this.dateTimeChart
      },
      fill: {
        opacity: 1
      },
      // colors: ["#008FFB", "#008FFB", "#00E396", "#FFA500"], 
      colors: ["#00E396", "#FFA500", "#008FFB", "#A020F0",],
      yaxis: {
        min: 0,
        // max: 1000, // Set a fixed maximum value based on your expected data range
        tickAmount: 5,
        labels: {
          formatter: (val: number) => {
            return val.toFixed(0);
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: '14px',
      }
    };



  }

  public fetchAllMasterpositionDetails() {
    this.masterPositionDetailsService.fetchMasterPositionDetails().subscribe(mastePositionList => {
      this.fetchAllMasterPositionDetailsList = mastePositionList;
    });
  }

  manualOutfeedPalletCodeOk: string = '';
  manualOutfeedPalletCodeNok: string = '';

  public addPalletCodeDetails(qualityStatus: string, addPalletCodeDetailsModalForm: NgForm) {
    const palletCode = qualityStatus === 'OK' ? this.manualOutfeedPalletCodeOk : this.manualOutfeedPalletCodeNok;

    this.addManualOutfeedMissionInstance.palletCode = palletCode;

    this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
      (addNewProductDetails: { status: number; }) => {
        if (addNewProductDetails.status == 200) {
          // console.log("status" + addNewProductDetails.status);
          this.toastr.success('Pallet Code Added Successfully.', 'Success', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 204) {
          this.toastr.warning('Position is not Active!', '', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 208) {
          this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 202) {
          this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 201) {
          this.toastr.warning('Position is locked', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 207) {
          this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 203) {

          this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 226) {

          this.toastr.warning('Pallet code not found', '', { timeOut: 5000, });
        }
        else {
          this.toastr.warning('Pallet Code not Exist', '', { timeOut: 5000 });
        }
      }
    );

    addPalletCodeDetailsModalForm.reset();
  }
  public addPalletCodeDetailsNok(addPalletCodeDetailsModalForm: NgForm) {
    this.addPalletCodeDetails('NOK', addPalletCodeDetailsModalForm);
  }

  public addPalletCodeDetailsOk(addPalletCodeDetailsModalForm: NgForm) {
    this.addPalletCodeDetails('OK', addPalletCodeDetailsModalForm);
  }






  manualOutfeedPalletCodeS230Ok: string = '';
  manualOutfeedPalletCodeS230Nok: string = '';

  public addPalletCodeDetailsS230(qualityStatus: string, addPalletCodeDetailsModalForm: NgForm) {
    const palletCode = qualityStatus === 'OK' ? this.manualOutfeedPalletCodeS230Ok : this.manualOutfeedPalletCodeS230Nok;

    this.addManualOutfeedMissionInstance.palletCode = palletCode;

    this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
      (addNewProductDetails: { status: number; }) => {
        if (addNewProductDetails.status == 200) {
          // console.log("status" + addNewProductDetails.status)

          this.toastr.success('Pallet Code Added Successfully.', 'Success', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 204) {
          this.toastr.warning('Position is not Active!', '', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 208) {
          this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 202) {
          this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 201) {
          this.toastr.warning('Position is locked', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 207) {
          this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 203) {

          this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 226) {
          this.toastr.warning('Pallet Code not found', '', { timeOut: 5000, });
        }
        else {
          this.toastr.warning('Pallet Code not Exist', '', { timeOut: 5000 });
        }
      }
    );

    addPalletCodeDetailsModalForm.reset();
  }
  public addPalletCodeDetailsS230Nok(addPalletCodeDetailsModalForm: NgForm) {
    this.addPalletCodeDetailsS230('NOK', addPalletCodeDetailsModalForm);
  }

  public addPalletCodeDetailsS230Ok(addPalletCodeDetailsModalForm: NgForm) {
    this.addPalletCodeDetailsS230('OK', addPalletCodeDetailsModalForm);
  }




  manualOutfeedPalletCodeOkBEV: string = '';
  manualOutfeedPalletCodeOkS230: string = '';
  public addPalletCodeDetailsCurrentStock(addPalletCodeDetailsModalForm: NgForm, tableType: string) {
    let palletCode: string = '';

    if (tableType === 'BEV') {
      palletCode = this.manualOutfeedPalletCodeOkBEV;
    } else if (tableType === 'S230') {
      palletCode = this.manualOutfeedPalletCodeOkS230;
    }

    this.addManualOutfeedMissionInstance.palletCode = palletCode;

    this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
      (addNewProductDetails: { status: number; }) => {
        if (addNewProductDetails.status == 200) {
          // console.log("status" + addNewProductDetails.status);
          this.toastr.success('Pallet Code Added Successfully.', 'Success', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 204) {
          this.toastr.warning('Position is not Active!', '', { timeOut: 5000 });
        }
        else if (addNewProductDetails.status == 208) {
          this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 202) {
          this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 201) {
          this.toastr.warning('Position is locked', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 207) {
          this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 203) {

          this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
        }
        else if (addNewProductDetails.status == 226) {
          this.toastr.warning('Pallet Code not found', '', { timeOut: 5000, });
        }
        else {
          this.toastr.warning('Pallet Code not Exist', '', { timeOut: 5000 })
        }
      }
    );

    addPalletCodeDetailsModalForm.reset();
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
    return !!masterPositionDetails && masterPositionDetails.isManualDispatch !== 1;
  }

  // isManualDispatchEnabled(positionName: string): boolean {
  //   const masterPositionDetails = this.fetchAllMasterPositionDetailsList.find(
  //     position => position.positionName === positionName
  //   );

  //   // Return true if masterPositionDetails exists and isManualDispatch is not 1
  //   return !!masterPositionDetails && masterPositionDetails.isManualDispatch !== 1;
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





  // fetchProductionsTrendDetailsWithInterval() {

  //   this.dashboardDetailsService.fetchDateTime().subscribe(dateTimeData => {


  //     this.dateTimeChart = dateTimeData.map((dateString: string) => {
  //       const date = new Date(dateString);
  //       return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  //     });
  //   });

  //   this.dashboardDetailsService.getProductionTrendData().subscribe(data => {

  //     if (data != null && data.length > 0) {
  //       this.totalCurrentStockCount = data.map(obj => obj.totalInfeedCount);

  //       this.alarmCountData = data.map(alarmCountObj => alarmCountObj.totalOutfeedCount);

  //       this.options.series = [

  //         {
  //           name: "PickList Count",
  //           data: this.alarmCountData,


  //         },
  //         {
  //           name: "Put Away Count",
  //           data: this.totalCurrentStockCount,

  //         }
  //       ];

  //       console.log("Populated dateTimeChart:", this.dateTimeChart);






  //     }
  //   });

  // }

  // fetchProductionsTrendDetailsWithInterval(): void {
  //   this.dashboardDetailsService.fetchDateTime().subscribe(dateTimeData => {


  //     this.dateTimeChart = dateTimeData.map((dateString: string) => {
  //       const date = new Date(dateString);
  //       return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  //     });
  //   });
  //   // console.log("  this.dateTimeChart ******");
  //   // console.log(this.dateTimeChart);
  //   this.dashboardDetailsService.getProductionTrendData().subscribe(
  //     data => {
  //       if (data && data.length > 0) {
  //         this.bevInfeedCount = data.map(obj => obj.bevInfeedCount);
  //         this.bevOutfeedCount = data.map(obj => obj.bevOutfeedCount);
  //         this.s230InfeedCount = data.map(obj => obj.s230InfeedCount);
  //         this.s230OutfeedCount = data.map(obj => obj.s230OutfeedCount);

  //         // Update the series data
  //         this.chartOptions = {
  //           ...this.chartOptions,

  //           series: [
  //             {
  //               name: "BEV IN Count",
  //               group: "BEV",
  //               data: this.bevInfeedCount,
  //             },
  //             {
  //               name: "S230 IN Count",
  //               group: "S230",
  //               data: this.s230InfeedCount,
  //             },
  //             {
  //               name: "BEV Dispatch Count",
  //               group: "BEV",
  //               data: this.bevOutfeedCount,
  //             },
  //             {
  //               name: "S230 Dispatch Count",
  //               group: "S230",
  //               data: this.s230OutfeedCount,
  //             },


  //           ]
  //         };


  //       }
  //     },
  //     error => {
  //       console.error('Error fetching production trend data:', error);
  //     }
  //   );
  // }

  fetchProductionsTrendDetailsWithInterval(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dashboardDetailsService.fetchDateTime().subscribe(dateTimeData => {
        this.dateTimeChart = dateTimeData.map((dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        });

        this.dashboardDetailsService.getProductionTrendData().subscribe(
          data => {
            if (data && data.length > 0) {
              this.bevInfeedCount = data.map(obj => obj.bevInfeedCount);
              this.bevOutfeedCount = data.map(obj => obj.bevOutfeedCount);
              this.s230InfeedCount = data.map(obj => obj.s230InfeedCount);
              this.s230OutfeedCount = data.map(obj => obj.s230OutfeedCount);

              // Update series and x-axis categories
              this.chartOptions.series = [
                { name: "BEV IN Count", group: "BEV", data: this.bevInfeedCount },
                { name: "S230 IN Count", group: "S230", data: this.s230InfeedCount },
                { name: "BEV Dispatch Count", group: "BEV", data: this.bevOutfeedCount },
                { name: "S230 Dispatch Count", group: "S230", data: this.s230OutfeedCount }
              ];
            }
            resolve();
          },
          error => {
            console.error('Error fetching production trend data:', error);
            reject();
          }
        );
      });
    });
  }


  public fetchBEVAllInfeedMissionRuntimeDetails() {           //this is for BEV INfeed Details of CurrentDate
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchBEVInfeedMissionRuntimeDetails().subscribe(
      infeedMissionRuntimeDetailsList => {
        $('#BEVinfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.infeedMissionRuntimeDetailsList = infeedMissionRuntimeDetailsList;

        $(function () {
          $("#BEVinfeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("bev" + this.infeedMissionRuntimeDetailsList);
      }
    )
  }





  public fetchS230AllInfeedMissionRuntimeDetails() {
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchS230InfeedMissionRuntimeDetails().subscribe(
      infeedMissionRuntimeDetailsList => {
        $('#S230infeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.infeedMissionRuntimeDetailsList = infeedMissionRuntimeDetailsList;

        $(function () {
          $("#S230infeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("s23" + this.infeedMissionRuntimeDetailsList);
      }
    )
  }
  public fetchBEVAllOutfeedMissionRuntimeDetails() {           //this is for BEV Outfeed Details of CurrentDate
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchBEVOutfeedMissionRuntimeDetails().subscribe(
      outfeedMissionRuntimeDetailsList => {
        $('#BEVOutfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.outfeedMissionRuntimeDetailsList = outfeedMissionRuntimeDetailsList;

        $(function () {
          $("#BEVOutfeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("bev" + this.outfeedMissionRuntimeDetailsList);
      }
    )
  }

  public fetchS230AllOutfeedMissionRuntimeDetails() {           //this is for S230 Outfeed Details of CurrentDate
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchS230OutfeedMissionRuntimeDetails().subscribe(
      outfeedMissionRuntimeDetailsList => {
        $('#S230OutfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.outfeedMissionRuntimeDetailsList = outfeedMissionRuntimeDetailsList;

        $(function () {
          $("#S230OutfeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("bev" + this.outfeedMissionRuntimeDetailsList);
      }
    )
  }


  public fetchAllInfeedMissionRuntimeDetails() {           //this is for S230 Outfeed Details of CurrentDate
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchTotalInfeedMissionRuntimeDetails().subscribe(
      allInfeedMissionRuntimeDetailsList => {
        $('#getInfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.totalInfeedMissionRuntimeDetailsList = allInfeedMissionRuntimeDetailsList;

        $(function () {
          $("#getInfeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("totalInfeedMissionRuntimeDetailsList" + this.totalInfeedMissionRuntimeDetailsList);
      }
    )
  }



  public fetchAllOutfeedMissionRuntimeDetails() {           //this is for S230 Outfeed Details of CurrentDate
    this.disableDateTime = true;
    this.disableSearchButton = false;
    this.dashboardDetailsService.fetchTotalOutfeedMissionRuntimeDetails().subscribe(
      allOutfeedMissionRuntimeDetailsList => {
        $('#getOutfeedMissionRuntimeDetailsId').DataTable().clear().destroy();
        this.totalOutfeedMissionRuntimeDetailsList = allOutfeedMissionRuntimeDetailsList;

        $(function () {
          $("#getOutfeedMissionRuntimeDetailsId").DataTable();
        });
        // console.log("totalInfeedMissionRuntimeDetailsList" + this.totalInfeedMissionRuntimeDetailsList);
      }
    )
  }


  public editCurrentPalletStockDetailsRow(editCurrentPalletStockDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.editCurrentPalletStockDetailsInstance = Object.assign({}, editCurrentPalletStockDetailsRowInstance);
  }

  dispatchCurrentStockDetailsRow(dispatchCurrentDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.dispatchCurrentDetailsForSelectedIdInstance = Object.assign({}, dispatchCurrentDetailsRowInstance);
    this.manualOutfeedPalletCode = this.dispatchCurrentDetailsForSelectedIdInstance.palletCode;
    this.addManualOutfeedMissionInstance.userName = this.CurrentStockOkDetailsList[0].userName;
    this.addManualOutfeedMissionInstance.userId = this.CurrentStockOkDetailsList[0].userId;

    this.addManualOutfeedMissionInstance.palletCode = this.manualOutfeedPalletCode
    {
      this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.addManualOutfeedMissionInstance).subscribe(
        (addNewProductDetails: { status: number; }) => {
          // console.log("list" + JSON.stringify(addNewProductDetails));
          if (addNewProductDetails.status == 200) {
            // console.log("status" + addNewProductDetails.status)
            this.toastr.success('Pallet Code Added Successfully.', 'Success', { timeOut: 5000 });
          } else if (addNewProductDetails.status == 204) {
            this.toastr.warning('Position is not Active!', '', { timeOut: 5000 });
          }
          else if (addNewProductDetails.status == 201) {
            this.toastr.warning('Position is locked', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 202) {
            this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 208) {
            this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 207) {
            this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 203) {

            this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
          }
          else if (addNewProductDetails.status == 226) {

            this.toastr.warning('Pallet code not found', '', { timeOut: 5000, });
          }
          else {
            this.toastr.warning('"Pallet Code Already Exists.', '', { timeOut: 5000 });
          }
        }
      )
    }

  }

  public editCurrentPalletStockDetailsOk() {
    this.currentPalletStockDetailsService.editCurrentPalletStockDetails(this.editCurrentPalletStockDetailsInstance.currentPalletStockDetailsId, this.editCurrentPalletStockDetailsInstance).subscribe(
      editCurrentPalletStockList => {
        if (editCurrentPalletStockList.status == 200) {
          this.toastr.success('Current pallet stock details updated successfully', '', { timeOut: 5000 });
          this.fetchAllCurrentPalletStockDetailsBYPage({ qualityStatus: 'OK', page: 0, size: 10 });
        }
        else {
          this.toastr.warning('Current pallet stock details already exists', '', { timeOut: 5000 });
        }
      }
    );
  }

  public editCurrentPalletStockDetailsNOk() {
    this.currentPalletStockDetailsService.editCurrentPalletStockDetails(this.editCurrentPalletStockDetailsInstance.currentPalletStockDetailsId, this.editCurrentPalletStockDetailsInstance).subscribe(
      editCurrentPalletStockList => {
        if (editCurrentPalletStockList.status == 200) {
          this.toastr.success('Current pallet stock details updated successfully', '', { timeOut: 5000 });
          this.fetchAllCurrentPalletStockDetailsBYPageNOK({ qualityStatus: 'NOK', page: 0, size: 10 });
        }
        else {
          this.toastr.warning('Current pallet stock details already exists', '', { timeOut: 5000 });
        }
      }
    );
  }
  // public fetchOkCurrentStockRuntimeDetails() {
  //   this.disableDateTime = true;
  //   this.disableSearchButton = false;
  //   this.dashboardDetailsService.fetchOkCurrentStockRuntimeDetails().subscribe(
  //     CurrentStockDetailsList => {
  //       $('#okCurrentStockDetailsId').DataTable().clear().destroy();
  //       this.CurrentStockDetailsList = CurrentStockDetailsList;

  //       $(function () {
  //         $("#okCurrentStockDetailsId").DataTable();
  //       });
  //       console.log("s23" + this.CurrentStockDetailsList);
  //     }
  //   )
  // }





  initializeDataTable(tableId: string): void {

    $(`#${tableId}`).DataTable().clear().destroy();

    // Initialize a new DataTable instance for the specified table
    const dataTableOptions: DataTables.Settings = {
      "paging": false,

    };

    $(document).ready(() => {
      $(`#${tableId}`).DataTable(dataTableOptions);
    });
  }


  public fetchAllCurrentPalletStockDetailsBYPage(request: any): void {

    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.dashboardDetailsService.fetchAllCurrentPalletStockDetailsByQualityStatus(request).subscribe(
      dashboardDetailsList => {
        this.CurrentStockOkDetailsList = dashboardDetailsList['content'];
        this.totalElements = dashboardDetailsList['totalElements'];
        // console.log("CurrentStockOkDetailsList..1324...", this.CurrentStockOkDetailsList);
        $('#okCurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('okCurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }




  nextPage(event: PageEvent): void {

    this.currentPage = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsByQualityStausRequests = {
      qualityStatus: 'OK',
      page: event.pageIndex,
      size: event.pageSize
    };
    this.fetchAllCurrentPalletStockDetailsBEVOKBYPage(request);
  }





  public fetchAllCurrentPalletStockDetailsBYPageNOK(request: any): void {

    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.dashboardDetailsService.fetchAllCurrentPalletStockDetailsByQualityStatusNOK(request).subscribe(
      nokDetailsList => {
        this.CurrentStockNOkDetailsList = nokDetailsList['content'];
        this.totalElements = nokDetailsList['totalElements'];
        // console.log("CurrentStockNOkDetailsList.....", this.CurrentStockNOkDetailsList);
        $('#NokCurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('NokCurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }
  public fetchAllCurrentPalletStockDetailsBEVOKBYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsBEVOKByQualityStatus(request).subscribe(
      okdetailsList => {
        this.CurrentStockBEVOkDetailsList = okdetailsList['content'];
        this.totalElements = okdetailsList['totalElements'];
        // console.log("CurrentStockBEVOkDetailsList", this.CurrentStockBEVOkDetailsList);
        $('#okBEVCurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('okBEVCurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }


  nextPagesNOK(event: PageEvent): void {
    this.currentPagesNOK = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsByQualityStausRequests = {
      qualityStatus: 'NOK',
      page: event.pageIndex,
      size: event.pageSize
    };
    this.fetchAllCurrentPalletStockDetailsBEVNOKBYPage(request);
  }

  fetchAllCurrentPalletStockDetailsBEVNOKBYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsBEVNOKByQualityStatus(request).subscribe(
      nokDetailsList => {
        this.CurrentStockBEVNOkDetailsList = nokDetailsList['content'];
        this.totalElementsNOK = nokDetailsList['totalElements']; // Update totalElementsNOK
        // console.log("CurrentStockBEVNOkDetailsList", this.CurrentStockBEVNOkDetailsList);
        $('#NokBEVCurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('NokBEVCurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  nextPagesS230OK(event: PageEvent): void {
    this.currentPagesS230OK = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsByQualityStausRequests = {
      qualityStatus: 'OK',
      page: event.pageIndex,
      size: event.pageSize
    };
    this.fetchAllCurrentPalletStockDetailsS230OKBYPage(request);
  }

  fetchAllCurrentPalletStockDetailsS230OKBYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsS230OKByQualityStatus(request).subscribe(
      s230OkDetailsList => {
        this.CurrentStockS230OkDetailsList = s230OkDetailsList['content'];
        this.totalElementsS230OK = s230OkDetailsList['totalElements'];
        // console.log("CurrentStockS230OkDetailsList", this.CurrentStockS230OkDetailsList);
        $('#okS230CurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('okS230CurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  nextPagesS230NOK(event: PageEvent): void {
    this.currentPagesS230NOK = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsByQualityStausRequests = {
      qualityStatus: 'NOK',
      page: event.pageIndex,
      size: event.pageSize
    };
    this.fetchAllCurrentPalletStockDetailsS230NOKBYPage(request);
  }

  fetchAllCurrentPalletStockDetailsS230NOKBYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsS230NOKByQualityStatus(request).subscribe(
      s230NOkDetailsList => {
        this.CurrentStockS230NOkDetailsList = s230NOkDetailsList['content'];
        this.totalElementsS230NOK = s230NOkDetailsList['totalElements'];
        // console.log("CurrentStockS230NOkDetailsList", this.CurrentStockS230NOkDetailsList);
        $('#nokS230CurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('nokS230CurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  nextPagesBev(event: PageEvent): void {
    this.currentPagesBev = event.pageIndex + 1;
    const request: FetchAllCurrentPalletStockDetailsRequestPage = {

      page: event.pageIndex,
      size: event.pageSize
    };
    this.fetchAllCurrentPalletStockDetailsBevBYPage(request);
  }

  fetchAllCurrentPalletStockDetailsBevBYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsBev(request).subscribe(
      bevDetailsList => {
        this.CurrentStockBevDetailsList = bevDetailsList['content'];
        this.totalElementsBev = bevDetailsList['totalElements'];
        // console.log("CurrentStockBevDetailsList", this.CurrentStockBevDetailsList);
        $('#bevCurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('bevCurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  nextPagesS230(event: PageEvent): void {

    const pageNumber = event.pageIndex;
    const pageSize = event.pageSize;

    this.currentPagesS230 = pageNumber + 1;
    const request: FetchAllCurrentPalletStockDetailsRequestPage = {
      page: pageNumber,
      size: pageSize
    };

    this.fetchAllCurrentPalletStockDetailsS230BYPage(request);
  }





  fetchAllCurrentPalletStockDetailsS230BYPage(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllCurrentPalletStockDetailsS230(request).subscribe(
      s230DetailsList => {
        this.CurrentStockS230DetailsList = s230DetailsList['content'];
        this.totalElementsS230 = s230DetailsList['totalElements'];
        // console.log("CurrentStockS230DetailsList", this.CurrentStockS230DetailsList);
        $('#S230CurrentStockDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('S230CurrentStockDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  fetchAllEmptyPalletList(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllEmptyPalletList(request).subscribe(
      emptyDetailsList => {
        this.EmptyPalletDetailsDetailsList = emptyDetailsList['content'];
        this.totalElementsEmpty = emptyDetailsList['totalElements'];
        // console.log("CurrentStockS230DetailsList", this.EmptyPalletDetailsDetailsList);
        $('#emptyPalletDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('emptyPalletDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  nextPageEmptyBEV(event: PageEvent): void {

    const pageNumber = event.pageIndex;
    const pageSize = event.pageSize;

    this.currentPagesEmpty = pageNumber + 1;
    const request: FetchAllCurrentPalletStockDetailsRequestPage = {
      page: pageNumber,
      size: pageSize
    };

    this.fetchAllEmptyPalletList(request);
  }



  fetchAllEmptyPalletListS230(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.currentPalletStockDetailsService.fetchAllEmptyPalletListS230(request).subscribe(
      emptyDetailsList => {
        this.S230EmptyPalletDetailsDetailsList = emptyDetailsList['content'];
        this.totalElementsS230Empty = emptyDetailsList['totalElements'];
        // console.log("CurrentStockS230DetailsList", this.S230EmptyPalletDetailsDetailsList);
        $('#S230EmptyPalletDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('S230EmptyPalletDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }



  nextPageEmptyS230(event: PageEvent): void {

    const pageNumber = event.pageIndex;
    const pageSize = event.pageSize;

    this.currentPagesS230Empty = pageNumber + 1;
    const request: FetchAllCurrentPalletStockDetailsRequestPage = {
      page: pageNumber,
      size: pageSize
    };

    this.fetchAllEmptyPalletListS230(request);
  }

  // loadDashboardDetails(): void {
  //   this.dashboardDetailsService.getDashboardDetails().subscribe(
  //     data => {
  //       this.dashboardDetails = data;
  //       console.log(this.dashboardDetails.bevInfeedCount)
  //     },

  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }
  loadDashboardDetails(): void {
    const startTime = performance.now(); // Start time tracking

    this.dashboardDetailsService.getDashboardDetails().subscribe(
      data => {
        this.dashboardDetails = data;
        const endTime = performance.now(); // End time tracking
        const timeInSeconds = (endTime - startTime) / 1000; // Convert time to seconds
        console.log(`Dashboard data loaded in ${timeInSeconds} seconds`);
        // console.log(this.dashboardDetails.bevInfeedCount);
      },
      (error) => {
        console.error(error);
      }
    );
  }




  fetchAllBufferPalletDetails(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.bufferDetaislService.fetchAllBEVBufferPalletStockDetails(request).subscribe(
      bufferDetailsList => {
        this.BufferDetailsList = bufferDetailsList['content'];
        this.totalElementsBufferPallet = bufferDetailsList['totalElements'];
        // console.log("BufferDetailsList", this.BufferDetailsList);
        $('#BufferPalletDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('BufferPalletDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }




  nextPageBufferData(event: PageEvent): void {

    const pageNumber = event.pageIndex;
    const pageSize = event.pageSize;

    this.currentPagesBufferPallet = pageNumber + 1;
    const request: FetchAllBufferPalletStockDetailsRequestPage = {
      page: pageNumber,
      size: pageSize
    };

    this.fetchAllBufferPalletDetails(request);
  }



  fetchAllS230BufferPalletDetails(request: any): void {
    this.disableDateTime = true;
    this.disableSearchButton = false;

    this.bufferDetaislService.fetchAllS230BufferPalletStockDetails(request).subscribe(
      s230BufferDetailsList => {
        this.S230BufferPalletDetails = s230BufferDetailsList['content'];
        this.totalElementsS230BufferPallet = s230BufferDetailsList['totalElements'];
        // console.log("S230BufferPalletDetails", this.S230BufferPalletDetails);
        $('#S230BufferPalletDetailsId').DataTable().clear().destroy();
        // this.initializeDataTable('S230BufferPalletDetailsId');
      },
      error => {
        console.log(error.error.message);
      }
    );
  }


  nextPageS230BufferData(event: PageEvent): void {

    const pageNumber = event.pageIndex;
    const pageSize = event.pageSize;

    this.currentPagesS230BufferPallet = pageNumber + 1;
    const request: FetchAllBufferPalletStockDetailsRequestPage = {
      page: pageNumber,
      size: pageSize
    };

    this.fetchAllS230BufferPalletDetails(request);
  }

  findPalletStockDetails(): void {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(2);
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const dispatchOrderNumber = `SR-${this.serialNumber1}-TO-${this.serialNumber2}-${day}${month}${year}${hours}${minutes}${seconds}`;
    const orderBatchNumber = `OBN-${this.serialNumber1}-TO-${this.serialNumber2}-${day}${month}${year}${hours}${minutes}${seconds}`;



    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        if (currentShift) {
          this.selectedShiftName = currentShift.shiftName;
          this.shiftId = currentShift.shiftId;

          // Now, call the service with the generated dispatchOrderNumber and shift details
          this.currentPalletStockDetailsService.findBySerialNumberBetween(
            this.serialNumber1,
            this.serialNumber2,
            dispatchOrderNumber,
            this.shiftId,
            this.selectedShiftName,
            this.productName,
            orderBatchNumber

          ).subscribe(
            (response: any) => {
              if (response.status === 200) {
                (data: CurrentPalletStockDetailsModel[]) => {
                  this.palletStockDetails = data;
                }
                  ;
                $('#confirmationModel').modal('hide');
                this.toastr.success('Retrival Order successfully Completed', 'Success', { timeOut: 5000 });
              } else if (response.status === 208) {
                this.responseData = response;
                let formattedMessage = this.responseData.message.replace(/\n/g, '<br>');
                formattedMessage = formattedMessage.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
                this.responseData.message = formattedMessage;
                // console.log('Response from backend:', this.responseData);
                $('#confirmationModel').modal('show');
              } else if (response.status === 202) {

                $('#confirmationModel').modal('hide');
                this.toastr.success('Retrival Order successfully Completed', 'Success', { timeOut: 5000 });

              } else if (response.status === 500) {
                this.toastr.error('Mannual dispatch failed due to available quantity is Zero.', '', { timeOut: 5000 })
              }
              else if (response.status === 201) {
                this.responseData = response;
                // console.log('Response from backend:', this.responseData);

                // console.log("this.productName" + this.productName)
                let formattedMessage = this.responseData.message.replace(/\n/g, '<br>');
                formattedMessage = formattedMessage.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');


                this.responseData.message = formattedMessage;

                $('#confirmationModel').modal('show');
              }
              else if (response.status === 226) {
                this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

              } else if (response.status === 207) {
                this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

              }
              else {
                this.toastr.error('Unexpected error occurred.', '', { timeOut: 5000 })
              }
            },
            error => {
              console.error('Error fetching pallet stock details:', error);

            }
          );
        }
      }
    );
  }




  findPalletStockDetails1(): void {

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(2);
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const dispatchOrderNumber = `SR-${this.serialNumber1}-TO-${this.serialNumber2}-${day}${month}${year}${hours}${minutes}${seconds}`;
    const orderBatchNumber = `OBN-${this.serialNumber1}-TO-${this.serialNumber2}-${day}${month}${year}${hours}${minutes}${seconds}`;

    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        if (currentShift) {
          this.selectedShiftName = currentShift.shiftName;
          this.shiftId = currentShift.shiftId;

          // Now, call the service with the generated dispatchOrderNumber and shift details
          this.currentPalletStockDetailsService.findBySerialNumberBetween1(
            this.serialNumber1,
            this.serialNumber2,
            dispatchOrderNumber,
            this.shiftId,
            this.selectedShiftName,
            this.productName,
            orderBatchNumber
          ).subscribe(
            (data: CurrentPalletStockDetailsModel[]) => {
              this.palletStockDetails = data;
              $('#confirmationModel').modal('hide');
              this.toastr.success('Retrival Order successfully Completed', 'Success', { timeOut: 5000 });
              $('#confirmationModel').modal('hide');

              this.dispatchForm.resetForm();
              // console.log('Pallet stock details:', this.palletStockDetails);
              // console.log('productName:', this.productName);
            },
            error => {
              console.error('Error fetching pallet stock details:', error);
            }
          );
        }
      }
    );
  }


  getEmptyPositionAlarm(): void {
    this.masterPositionDetailsService.findEmptyPositionAlarm().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseDataforNoEmpty = response.body;
          const message = this.responseDataforNoEmpty.message;
          // console.log('Response from backend:', message);

          $('#confirmationModel5').modal('show');
          $('#confirmationModel').modal('hide');

        }
      },
      error => {
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }

  getTotalOutfeedCount(): void {
    this.dashboardDetailsService.findAllDashboardTotalOutfeedCount().subscribe(
      (count: number) => {
        this.dashboardTotalOutfeedCount = count;
      },
      (error) => {
        console.error('Error fetching total outfeed count:', error);
      }
    );
  }


  getTotalInfeedCount(): void {
    this.dashboardDetailsService.findAllDashboardTotalInfeedCount().subscribe(
      (count: number) => {
        this.dashboardTotalInfeedCount = count;
      },
      (error) => {
        console.error('Error fetching total outfeed count:', error);
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

  fetchAllMismatchCell(): void {
    this.masterPositionDetailsService.fetchAllMismatchCell().subscribe(
      (response: HttpResponse<any>) => {

        if (response.status === 200) {
          this.responseDataMismatchCell = response.body;
          const message = this.responseDataMismatchCell.message;
          console.log(message)
          $('#confirmationModel77').modal('show');
        }
        else if (response.status === 208) {
          $('#confirmationModel77').modal('hide');
        }

      },
      error => {
        $('#confirmationModel5').modal('hide');
        console.error('Error fetching empty data mismatch:', error);
      }
    );

  }


  validateProductName(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    // const palletCode = this.dispatchForm.get('palletCode')?.value;
    const productName = dispatchCurrentStockDetailsInstance.productName;

    if (!productName) {

      // this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Pallet Code is empty', life: 3000 });
      return;
    }

    this.currentPalletStockDetailsService.validateProductName(productName).subscribe(
      (response) => {
        // console.log("Pallet Code:", productName);

        if (response.status === 200) {
          // console.log("Validated.....");
          this.isproductNameValidated = true;
          this.validationMessage = ""; // Clear validation message if needed

        } else if (response.status === 204) {
          this.isproductNameValidated = false;
          this.validationMessage = " Product Name Not Found";
        }
      },
      (error) => {
        this.isproductNameValidated = false;
        this.validationMessage = "Position is empty";
        console.error(error);
      }
    );
  }

  onProductNameChange() {
    this.isproductNameValidated = false;
    this.validationMessage = "Please validate product Name using the icon.";
  }



  onAddMockDrillMission(areaName: string): void {
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


  onAddMockDrillMissionForArea2(areaName: string): void {
    // console.log('Area Name:', areaName);
    this.mockDrillMissionService.addMockDrillMissionDetails(areaName).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.toastr.success('Mission added successfully.', '', { timeOut: 5000 })
          $('#confirmationModel4').modal('hide');
        }
        else if (response.status === 226) {
          this.toastr.error('Empty Pallet Not Found.', '', { timeOut: 5000 });

        } else if (response.status === 208) {
          this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 });

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
          this.responseData1 = response.body;
          const message = this.responseData1.message;
          // console.log('Response from backend**********:', message);

          $('#confirmationModel3').modal('show');
          $('#confirmationModel').modal('hide');
          // $('#confirmationModel1').modal('hide');
          // $('#confirmationModel5').modal('hide');

        }
        else if (response.status === 208) {
          $('#confirmationModel3').modal('hide');
        }
      },
      error => {
        $('#confirmationModel3').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    )
  }


  getAlarmForArea2(): void {
    // console.log("Fetching alarm...");
    this.mockDrillMissionService.getAlarmForArea2().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData2 = response.body;
          const message = this.responseData2.message;
          // console.log('Response from backend**********:', message);

          $('#confirmationModel4').modal('show');
          $('#confirmationModel').modal('hide');
          // $('#confirmationModel1').modal('hide');
          // $('#confirmationModel5').modal('hide');
        }
        else if (response.status === 208) {
          $('#confirmationModel4').modal('hide');
        }
      },
      error => {
        $('#confirmationModel4').modal('hide');
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }



  fetchAllDuplicatePalletCode(): void {
    this.masterPositionDetailsService.fetchDuplicatePalletCode().subscribe(
      (response: HttpResponse<any>) => {

        if (response.status === 200) {
          this.duplicatePallet = response.body;
          const message = this.duplicatePallet.message;
          console.log(message)
          $('#confirmationModelForDuplicatePalletCode').modal('show');
        }
        else if (response.status === 204) {
          $('#confirmationModelForDuplicatePalletCode').modal('hide');
        }

      },
      error => {
        $('#confirmationModelForDuplicatePalletCode').modal('hide');
        console.error('Error fetching empty data mismatch:', error);
      }
    );

  }
}

