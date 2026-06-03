
import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import { MannualRetrivalOrderModel } from 'src/app/models/mannual-retrival-order.model';
import { MasterShiftDetailsModel } from 'src/app/models/master-shift-details.model';
import { MasterProductVariantDetailsModel } from 'src/app/models/masterProductVariantDetails.model';
import { MannualRetrivalOrderService } from 'src/app/service/mannual-retrival-order.service';
import { MasterShiftDetailsService } from 'src/app/service/master-shift-details.service';
import { MasterProductVariantDetailsService } from 'src/app/service/masterProductVariantDetails.service';
import * as  fileServer from 'file-saver';
import { switchMap } from 'rxjs/operators';
import { CurrentPalletStockDetailsService } from 'src/app/service/currentPalletStockDetails.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthenticationService } from 'src/app/service/auth.service';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { generateRetrivalMissionTypeDetailsModel } from 'src/app/models/generateRetrivalMissionTypeDetails.model';
import { ViewGenerateRetrivalNonMesAndMesOrderDetailsService } from 'src/app/service/ViewGenerateRetrivalNonMesAndMesOrderDetailsService.service';
import { ViewGenerateRetrivalNonMesAndMesOrderDetails } from 'src/app/models/ViewGenerateRetrivalNonMesAndMesOrderDetails.model';
import { MesConnectionDetails } from 'src/app/models/MesConnectionDetails.model';
import { interval, Subscription } from 'rxjs';
import { MesDispatchControl } from 'src/app/models/MesDispatchControl.model';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,

} from '@angular/core';

declare var $: any;



@Component({
  selector: 'app-manual-retrieval-order',
  templateUrl: './manual-retrieval-order.component.html',
  styleUrls: ['./manual-retrieval-order.component.css'],

})
export class ManualRetrievalOrderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  dispatchInitiated: boolean = false;

  // manualDtOptions: DataTables.Settings = {}

  masterProductVariantDetailsTableList: MasterProductVariantDetailsModel[] = [];
  addMannualRetrivalDetails: MannualRetrivalOrderModel = new MannualRetrivalOrderModel();
  addproductVarientDetails: MasterProductVariantDetailsModel = new MasterProductVariantDetailsModel();
  isMesReadModeActive: number = 1;
  MesIsDeletedValue: number = 1;

  shiftNameDropDownList: MasterShiftDetailsModel[] = [];
  modelNumberDropDown: MasterProductVariantDetailsModel[] = [];
  manualRetrivalOrderList: MannualRetrivalOrderModel[] = [];
  manualRetrivalOrderMesAndNonMesList: ViewGenerateRetrivalNonMesAndMesOrderDetails[] = [];
  generateRetrivalTriggeredList: generateRetrivalMissionTypeDetailsModel[] = [];
  mesConnectionDetailsList: MesConnectionDetails[] = [];
  manunualRetrivalDetailsList: MannualRetrivalOrderModel[] = [];
  manualRetrivalForaddData: MannualRetrivalOrderModel[] = [];
  mesDispatchControlDetails: MesDispatchControl = new MesDispatchControl();

  manunualRetrivalList: MannualRetrivalOrderModel[] = [];
  viewGenerateRetrivalNonMesAndMesOrderDetailsList: ViewGenerateRetrivalNonMesAndMesOrderDetails[] = [];
  selectedShiftName: string = "";
  selectedModelNumber: string = "";
  selectedDispatchOrderNumber: string = "";
  // dispatchStatus: string = "READY"
  dispatchStatus!: string;
  serialNumber!: number;
  dispatchHistoryId!: number;
  productVariantId!: number;
  dispatchOrderNumber!: string;
  productVariantCode!: string;
  productVariantName!: string;
  productName!: string;
  productId!: number;
  shiftId!: number;
  plannedQuantity!: number;
  acutualQuantity!: number;
  balanceQuantity!: number;
  createdDatetime!: string;
  isDispatchStart!: number;
  isOrderCancelled!: number;
  isOrderDeleted!: number;
  orderSourceDetails!: string;

  isDeleteShow: boolean = false;


  orderBatchNumber!: string;
  userName!: string;
  currentShift: MasterShiftDetailsModel | undefined;
  currentUser: MasterUserDetailsModel | undefined;
  shiftName!: string;
  cDatetimeStart!: string;
  cDatetimeEnd!: string;
  disableSearchButton: boolean = false;
  disableDateTime: boolean = true;
  responseData: any;
  placeholderText = 'Select Model Number';
  mfgDate!: string;
  reason!: string;
  otherReasonText!: string;
  selectedOrderType: string = " ";

  // intervalIds: any[] = []; // Store all interval IDs




  constructor(private shiftDetailsService: MasterShiftDetailsService,
    private masterProductVariantDetailsService: MasterProductVariantDetailsService,
    private currentPalletStockDetailsService: CurrentPalletStockDetailsService,
    private viewGenerateRetrivalNonMesAndMesOrderDetailsService: ViewGenerateRetrivalNonMesAndMesOrderDetailsService,
    private mannualRetrivalService: MannualRetrivalOrderService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;


    this.getMesControlMode();

    this.fetchCurrentShift();


    // // Load heavy data after UI renders
    setTimeout(() => {
      this.loadManualDispatchData();
    }, 100);

    this.subscriptions.add(
      interval(30000).subscribe(() => {

        this.fetchMesConnectionDetails();

        this.getMesControlMode();

      })
    );
  }

  private loadManualDispatchData(): void {
    this.SessionClearMethod();
    this.fetchAllMesAndNonMesMissionDetails();
    this.fetchShiftDetailsFromMasterShiftDetails();
    // this.fetchAllOrderDetailsBYCurrentDate();
    // this.fetchAllManualDispatchDetailsList();
    // this.fetchAllDetailsByAllFilters();
    // this.GenerateMannualRetrival();
    this.fetchModelDetailsFromProductVarientCode();
    this.fetchAllMissionTypeData();
    this.fetchMesConnectionDetails();
  }

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }



  trackById(index: number, item: any): any {
    return item.dispatchHistoryId || item.dispatchOrderNumber || index;
  }


  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  initializeDataTable(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {

        if ($.fn.DataTable.isDataTable('#ManualOrderId')) {
          $('#ManualOrderId').DataTable().destroy();
        }

        $('#ManualOrderId').DataTable({
          responsive: false,
          pageLength: 10,
          deferRender: true,
          processing: true,
          paging: true,
          searching: true,
          ordering: true,
          order: [],
          autoWidth: false,
          destroy: true,
          columnDefs: [
            {
              targets: [4], // Actions column
              orderable: false
            }
          ]
        });

      }, 100);
    });
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

    sessionStorage.setItem('retrival-order', 'true');
  }


  // isFormValid(): boolean {
  //   const isModelNumberValid = !!this.productVariantCode;
  //   const isQuantityValid = this.plannedQuantity > 0;
  //   const isReasonValid = this.orderSourceDetails === 'MES' ? !!this.reason && this.reason.trim().length > 0 : true;
  //   return isModelNumberValid && isQuantityValid && isReasonValid;
  // }

  isFormValid(): boolean {
    const isModelNumberValid = !!this.productVariantCode;
    const isQuantityValid = this.plannedQuantity > 0;

    let isReasonValid = true;

    if (this.orderSourceDetails === 'MES') {
      if (this.reason === 'Other') {
        isReasonValid = !!this.otherReasonText && this.otherReasonText.trim().length > 0;
      } else {
        isReasonValid = !!this.reason && this.reason.trim().length > 0;
      }
    }

    return isModelNumberValid && isQuantityValid && isReasonValid;
  }


  fetchCurrentShift(): void {
    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        this.currentShift = currentShift;

      },
      (error) => {
        console.error('Error fetching current shift:', error);
      }
    );
  }


  public fetchAllManualDispatchDetailsList() {
    this.mannualRetrivalService.fetchAllMannualDispatchDetailsForAll().subscribe(manualList => {
      this.manunualRetrivalList = manualList;
      // console.log("fetchAll...." + this.manunualRetrivalList)

    })
  }


  public fetchAllMesAndNonMesMissionDetails() {

    if ($.fn.DataTable.isDataTable('#ManualOrderId')) {
      $('#ManualOrderId').DataTable().clear().destroy();
    }


    this.viewGenerateRetrivalNonMesAndMesOrderDetailsService.fetchAllMESAndNonMesDetails().subscribe(fetchList1 => {
      this.viewGenerateRetrivalNonMesAndMesOrderDetailsList = fetchList1;


      setTimeout(() => {
        this.initializeDataTable();

      }, 300);
    })
  }

  public selectDispatchOrderNumberChangeHandler(value: string) {
    this.dispatchOrderNumber = value;
  }

  fetchAllOrderDetailsBYCurrentDate() {
    this.mannualRetrivalService.fetchAllManualDispatchDetails().subscribe(manualOrderList => {
      this.manualRetrivalOrderList = manualOrderList;
      // console.log("manualorderBycurrentDate" + this.manualRetrivalOrderList);

      // if (this.manualRetrivalOrderList == null) {
      //   alert("Data not found");
      // }
    })
  }
  // fetchAllDetailsByAllFilters() {
  //   this.resetData();
  //   this.mannualRetrivalService.fetchManualDispatchDetailsByAllFilters(this.cDatetimeStart, this.cDatetimeEnd, this.dispatchOrderNumber, this.productVariantCode, this.shiftName).subscribe(filterList => {
  //     this.manualRetrivalOrderList = filterList;
  //     $('#ManualOrderId').DataTable().clear().destroy();
  //     // console.log("manualRetrivalOrderListFilter" + JSON.stringify(this.manualRetrivalOrderList))
  //     $(function () {
  //       $("#ManualOrderId").DataTable();
  //     });
  //   })
  // }




  fetchAllDetailsByAllFilters() {
    this.resetData();

    if ($.fn.DataTable.isDataTable('#ManualOrderId')) {
      $('#ManualOrderId').DataTable().clear().destroy();
    }


    this.viewGenerateRetrivalNonMesAndMesOrderDetailsService.fetchManualDispatchDetailsByAllFilters(this.cDatetimeStart, this.cDatetimeEnd, this.dispatchOrderNumber, this.productVariantCode, this.shiftName, this.orderSourceDetails).subscribe(filterList => {
      this.viewGenerateRetrivalNonMesAndMesOrderDetailsList = filterList;

      Promise.resolve().then(() => {
        this.initializeDataTable();

      });
    })
  }

  public fetchShiftDetailsFromMasterShiftDetails() {
    this.shiftDetailsService.fetchAllMasterShiftDetails().subscribe(
      // (data: MasterShiftDetailsModel[]) => {
      shiftDetailsList => {
        this.shiftNameDropDownList = shiftDetailsList;

        // console.log("ShiftDropDownList" + this.shiftNameDropDownList);
      },
      (error) => {
        console.error('Error fetching shift details:', error);
      }
    );
  }
  public selectShiftNameChangeHandler(value: string) {
    this.selectedShiftName = value;
  }


  public selectOrderTypeChangeHandler(value: string) {
    this.selectedOrderType = value;
  }


  public selectReasonChangeHandler(value: string) {
    this.reason = value
  }


  public fetchModelDetailsFromProductVarientCode() {
    this.masterProductVariantDetailsService.fetchAllMasterProductVariantDetails().subscribe(
      productVarientList => {
        this.modelNumberDropDown = productVarientList;

        // console.log("productVariantCodeDropDownList" + this.modelNumberDropDown);
      },
      (error) => {
        console.error('Error fetching modelnumber details:', error);
      }
    );
  }

  public selectModelNumberChangeHandler(value: string) {
    // console.log("areaName ::" + this.selectedModelNumber)
    this.selectedModelNumber = value;
  }
  searchText: string = '';

  selectProductVrientCodeChangeHandler1(event: any) {
    this.selectedModelNumber = ''
    this.productVariantCode = event ? event.productVariantCode : null;
    this.selectedModelNumber = this.productVariantCode
    this.placeholderText = this.productVariantCode ? '' : 'Select Model Number ';
    // console.log('Selected productVariantCode:', this.productVariantCode);
  }
  filterModelNumbers() {
    if (this.searchText) {
      this.modelNumberDropDown = this.modelNumberDropDown.filter(model =>
        model.productVariantCode.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.modelNumberDropDown = this.modelNumberDropDown;
    }
  }



  // fetchAllMannualDispatchByCurrentDate() {
  //   this.disableDateTime = true;
  //   this.disableSearchButton = false;
  //   this.mannualRetrivalService.fetchAllManualDispatchDetails().subscribe(
  //     retrivalDetailsList => {
  //       $('#mannualRetrivalDetailsId').DataTable().clear().destroy();
  //       // console.log("infeedMissionRuntimeDetailsList ::"+this.infeedMissionRuntimeDetailsList)
  //       this.manunualRetrivalDetailsList = retrivalDetailsList;

  //       $(function () {
  //         $("#mannualRetrivalDetailsId").DataTable();
  //       });
  //     }

  //   )
  // }



  editSelectedIsDispatchStartActiveInActiveCheckBox(engineDispatchScheduleHistoryData: MannualRetrivalOrderModel) {

    if (engineDispatchScheduleHistoryData.isDispatchStart == 1) {
      engineDispatchScheduleHistoryData.isDispatchStart = 0;
      engineDispatchScheduleHistoryData.dispatchStatus = 'HOLD'
      this.mannualRetrivalService.updateEngineScheduleIsDispatchStart(engineDispatchScheduleHistoryData).subscribe(updateIsDispatchStart => {

      })
    }
    else {
      engineDispatchScheduleHistoryData.isDispatchStart = 1;
      engineDispatchScheduleHistoryData.dispatchStatus = 'IN_PROGRESS';
      this.mannualRetrivalService.updateEngineScheduleIsDispatchStart(engineDispatchScheduleHistoryData).subscribe(updateIsDispatchStart => {

      })

    }
  }


  cancelOrder(mannualRetrivalDetails: MannualRetrivalOrderModel): void {
    if (confirm("Are you sure you want to cancel this order?")) {
      this.mannualRetrivalService.updateOrderCancelledStatus(mannualRetrivalDetails.dispatchHistoryId, 1)
        .subscribe(
          response => {
            // console.log('Order Cancelled Successfully');
            mannualRetrivalDetails.isOrderCancelled = 1;
            mannualRetrivalDetails.dispatchStatus = "CANCELLED"
            // this.fetchAllOrderDetailsBYCurrentDate();
            this.fetchAllMesAndNonMesMissionDetails();
          },
          error => {
            console.error('Error updating order cancelled status:', error);

          }
        );
    }
  }


  deleteOrder(mannualRetrivalDetails: MannualRetrivalOrderModel): void {
    if (confirm("The deleted order will not be retrieved. Are you sure you want to delete?")) {
      this.mannualRetrivalService.updateOrderdelete(mannualRetrivalDetails.dispatchHistoryId, 1)
        .subscribe(
          response => {
            // console.log('Order Deleted Successfully');
            // this.fetchAllOrderDetailsBYCurrentDate();
            this.fetchAllMesAndNonMesMissionDetails();
            mannualRetrivalDetails.isOrderDeleted = 1;

            // Handle success, if needed
          },
          error => {
            console.error('Error updating order deleted status:', error);
            // this.fetchAllOrderDetailsBYCurrentDate();
            this.fetchAllMesAndNonMesMissionDetails();
            // Handle error, if needed
          }
        );
    }
  }



  editSelectedIsDispatchTriggeredActiveInActiveCheckBox(engineDispatchTriggeredScheduleHistoryData: generateRetrivalMissionTypeDetailsModel) {
    // console.log("inside method")
    if (engineDispatchTriggeredScheduleHistoryData.dispatchTriggered == 1) {
      engineDispatchTriggeredScheduleHistoryData.dispatchTriggered = 0;
      engineDispatchTriggeredScheduleHistoryData.userName = this.currentUser?.userName ?? 'unknown';

      this.mannualRetrivalService.updateEngineScheduleIsDispatchTriggered(engineDispatchTriggeredScheduleHistoryData).subscribe(updateIsDispatchStart => {

      })
    }
    else {
      engineDispatchTriggeredScheduleHistoryData.dispatchTriggered = 1;
      engineDispatchTriggeredScheduleHistoryData.userName = this.currentUser?.userName ?? 'unknown';
      this.mannualRetrivalService.updateEngineScheduleIsDispatchTriggered(engineDispatchTriggeredScheduleHistoryData).subscribe(updateIsDispatchStart => {

      })

    }
  }

  public getMesControlMode() {
    this.mannualRetrivalService.getMesControlMode().subscribe(mesControlModeDetails => {
      this.mesDispatchControlDetails = mesControlModeDetails;

      if (this.mesDispatchControlDetails.mesRead === 0) {
        // MES OFF
        this.isMesReadModeActive = 0;
        this.isDeleteShow = false;
      } else {
        // MES ON
        this.isMesReadModeActive = 1;
        this.isDeleteShow = true;
      }
    });
  }

  onMesReadToggle(event: any) {

    const toggle = event.target as HTMLInputElement;
    const isChecked = toggle.checked;

    const mesReadValue = isChecked ? 1 : 0;

    const confirmMessage = isChecked
      ? "Do you want to Start MES Read?"
      : "Do you want to Stop MES Read?";

    const confirmAction = confirm(confirmMessage);

    if (!confirmAction) {
      toggle.checked = !isChecked;
      return;
    }

    const payload: MesDispatchControl = new MesDispatchControl();
    payload.mesId = 1;
    payload.mesRead = mesReadValue;

    this.mannualRetrivalService.updateMesReadMode(payload)
      .subscribe(response => {

        this.mesDispatchControlDetails = response;

        this.isMesReadModeActive = response.mesRead;

        // MESREAD 1 = Show DeleteAll
        // MESREAD 0 = Hide DeleteAll
        this.isDeleteShow = response.mesRead === 1;

        toggle.checked = response.mesRead === 1;

        this.toastr.success(
          response.mesRead === 1
            ? 'MES Read Mode is ON'
            : 'MES Read Mode is OFF',
          'Success',
          { timeOut: 3000 }
        );

      }, error => {

        toggle.checked = !isChecked;

        this.toastr.error(
          'Failed to change MES Read Mode',
          'Error',
          { timeOut: 3000 }
        );
      });
  }




  public fetchAllMissionTypeData() {
    this.mannualRetrivalService.fetchAllMissionTypeData().subscribe(fetchList => {
      this.generateRetrivalTriggeredList = fetchList;
      // console.log("90-"+ this.generateRetrivalTriggeredList);
    })
  }



  public fetchMesConnectionDetails() {
    this.mannualRetrivalService.fetchMesConnectionDetails().subscribe(fetchMesList => {
      this.mesConnectionDetailsList = fetchMesList;

    })
  }




  public GenerateMannualRetrival() {

    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        if (currentShift) {
          this.selectedShiftName = currentShift.shiftName;
          this.shiftId = currentShift.shiftId;

          // Generating the dispatch order number
          const currentDate = new Date();
          const day = String(currentDate.getDate()).padStart(2, '0');
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const year = String(currentDate.getFullYear()).slice(2);
          const hours = String(currentDate.getHours()).padStart(2, '0');
          const minutes = String(currentDate.getMinutes()).padStart(2, '0');
          const seconds = String(currentDate.getSeconds()).padStart(2, '0');

          const dispatchOrderNumber = `DO${day}${month}${year}${hours}${minutes}${seconds}`;
          this.dispatchOrderNumber = dispatchOrderNumber;

          const orderBatchNumber = `OBN${day}${month}${year}${hours}${minutes}${seconds}`;
          this.orderBatchNumber = orderBatchNumber;

          const selectedProductVariant = this.modelNumberDropDown.find(model => model.productVariantCode === this.productVariantCode);

          if (selectedProductVariant) {
            this.addMannualRetrivalDetails.productVariantId = selectedProductVariant.productVariantId;
            this.addMannualRetrivalDetails.productVariantName = selectedProductVariant.productVariantname;
            this.addMannualRetrivalDetails.productId = selectedProductVariant.productId;
            this.addMannualRetrivalDetails.productName = selectedProductVariant.productName;
            this.addMannualRetrivalDetails.shiftName = this.selectedShiftName;
            this.addMannualRetrivalDetails.shiftId = this.shiftId;
            let finalReason = this.reason;
            if (this.reason === 'Other') {
              finalReason = this.otherReasonText?.trim() || '';
            }


            const dataToSend = {
              dispatchHistoryId: this.addMannualRetrivalDetails.dispatchHistoryId,
              productVariantId: this.addMannualRetrivalDetails.productVariantId,
              dispatchOrderNumber: this.dispatchOrderNumber,
              productVariantCode: this.productVariantCode,
              mfgDate: this.mfgDate,
              productVariantName: this.addMannualRetrivalDetails.productVariantName,
              productName: this.addMannualRetrivalDetails.productName,
              productId: this.addMannualRetrivalDetails.productId,
              shiftId: this.addMannualRetrivalDetails.shiftId,
              shiftName: this.addMannualRetrivalDetails.shiftName,
              plannedQuantity: this.plannedQuantity,
              acutualQuantity: this.acutualQuantity,
              balanceQuantity: this.plannedQuantity,
              // balanceQuantity: this.balanceQuantity,
              createdDatetime: this.createdDatetime,
              // dispatchStatus: 'READY',
              dispatchStatus: this.dispatchStatus,
              isDispatchStart: this.isDispatchStart,
              serialNumber: 0,
              isOrderCancelled: this.isOrderCancelled,
              isOrderDeleted: this.isOrderDeleted,
              userName: this.userName,
              orderSourceDetails: this.orderSourceDetails,
              reason: finalReason,
              orderBatchNumber: orderBatchNumber

              // isDispatchStart: 1, 
            };

            // console.log('Data to send:', dataToSend);
            this.mannualRetrivalService.addMannualRetrivalDetails(dataToSend).subscribe(
              (response: HttpResponse<any>) => {
                if (response.status === 200) {
                  $('#confirmationModel').modal('hide');
                  this.toastr.success('Retrival Order successfully Completed.', 'Success', { timeOut: 5000 });
                  // console.log("Data added successfully :", response.body);
                  // this.fetchAllOrderDetailsBYCurrentDate();
                  this.fetchAllMesAndNonMesMissionDetails();
                  this.mannualRetrivalService.fetchAllManualDispatchDetails().subscribe((data) => {
                    this.manualRetrivalOrderList = data;
                  });

                } else if (response.status === 208) {
                  this.responseData = response;
                  // console.log('Response from backend:', this.responseData);
                  $('#confirmationModel').modal('show');

                  // this.fetchAllOrderDetailsBYCurrentDate();
                  this.fetchAllMesAndNonMesMissionDetails();
                }
                else if (response.status === 202) {
                  this.toastr.success('Retrival Order successfully Completed.', '', { timeOut: 5000 });
                  // this.fetchAllOrderDetailsBYCurrentDate();
                  this.fetchAllMesAndNonMesMissionDetails();
                }
                else if (response.status === 500) {
                  this.toastr.warning('Available quantity = 0.', '', { timeOut: 5000 });
                }
                else if (response.status === 226) {
                  this.toastr.error('product variant is not active.', '', { timeOut: 5000 });
                }
                else if (response.status === 201) {
                  this.toastr.error('Area 1 Dump tank is not empty', '', { timeOut: 5000 })

                } else if (response.status === 207) {
                  this.toastr.error('Area 2 Dump tank is not empty.', '', { timeOut: 5000 })

                }
                else {
                  alert("Error: " + response.statusText);
                }

              },
              (error) => {
                // Handle error
                this.toastr.error('Mannual dispatch failed due to available quantity is Zero.', '', { timeOut: 5000 });
                console.error('Error while storing data', error);
              }
            );
          } else {
            // console.log('Selected product variant not found.');
          }
        }
      },
      (error) => {
        console.error('Error fetching current shift:', error);
      }
    );
  }

  ConfirmManualDelete() {

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this manual order?"
    );

    if (isConfirmed) {


      // call service to delete current date order the order

      this.mannualRetrivalService.deleteManualOrderByCurrentDate().subscribe(
        response => {
          console.log('Delete Response:', response);
          console.log('Calling fetch method...');
          this.fetchAllMesAndNonMesMissionDetails();

          this.toastr.success(
            'Manual order deleted successfully.',
            '',
            { timeOut: 5000 }
          );
        },
        error => {
          console.error(error);
          this.toastr.error('Failed to delete manual order.', '', { timeOut: 5000 });
        }
      );
    }

  }
  onDispatchButtonClick() {

    this.shiftDetailsService.fetchShiftByCurrentTime().subscribe(
      (currentShift: MasterShiftDetailsModel | undefined) => {
        if (currentShift) {
          this.selectedShiftName = currentShift.shiftName;
          this.shiftId = currentShift.shiftId;
          // console.log('Selected Shift:', this.selectedShiftName);
          // console.log('Shift ID:', this.shiftId);
          // Generating the dispatch order number
          const currentDate = new Date();
          const day = String(currentDate.getDate()).padStart(2, '0');
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const year = String(currentDate.getFullYear()).slice(2);
          const hours = String(currentDate.getHours()).padStart(2, '0');
          const minutes = String(currentDate.getMinutes()).padStart(2, '0');
          const seconds = String(currentDate.getSeconds()).padStart(2, '0');

          const dispatchOrderNumber = `DO${day}${month}${year}${hours}${minutes}${seconds}`;
          this.dispatchOrderNumber = dispatchOrderNumber;

          const orderBatchNumber = `OBN${day}${month}${year}${hours}${minutes}${seconds}`;
          this.orderBatchNumber = orderBatchNumber;

          const selectedProductVariant = this.modelNumberDropDown.find(model => model.productVariantCode === this.productVariantCode);

          if (selectedProductVariant) {
            this.addMannualRetrivalDetails.productVariantId = selectedProductVariant.productVariantId;
            this.addMannualRetrivalDetails.productVariantName = selectedProductVariant.productVariantname;
            this.addMannualRetrivalDetails.productId = selectedProductVariant.productId;
            this.addMannualRetrivalDetails.productName = selectedProductVariant.productName;
            this.addMannualRetrivalDetails.shiftName = this.selectedShiftName;
            this.addMannualRetrivalDetails.shiftId = this.shiftId;
            let finalReason = this.reason;
            if (this.reason === 'Other') {
              finalReason = this.otherReasonText?.trim() || '';
            }

            const dataToSend = {
              dispatchHistoryId: this.addMannualRetrivalDetails.dispatchHistoryId,
              productVariantId: this.addMannualRetrivalDetails.productVariantId,
              dispatchOrderNumber: this.dispatchOrderNumber,
              productVariantCode: this.productVariantCode,
              mfgDate: this.mfgDate,
              productVariantName: this.addMannualRetrivalDetails.productVariantName,
              productName: this.addMannualRetrivalDetails.productName,
              productId: this.addMannualRetrivalDetails.productId,
              shiftId: this.addMannualRetrivalDetails.shiftId,
              shiftName: this.addMannualRetrivalDetails.shiftName,
              plannedQuantity: this.plannedQuantity,
              acutualQuantity: this.acutualQuantity,
              balanceQuantity: this.plannedQuantity,
              // balanceQuantity: this.balanceQuantity,
              createdDatetime: this.createdDatetime,
              // dispatchStatus: 'READY',
              dispatchStatus: this.dispatchStatus,
              isDispatchStart: this.isDispatchStart,
              serialNumber: 0,
              isOrderCancelled: this.isOrderCancelled,
              isOrderDeleted: this.isOrderDeleted,
              userName: this.userName,
              orderSourceDetails: this.orderSourceDetails,
              reason: finalReason,
              orderBatchNumber: orderBatchNumber
              // isDispatchStart: 1, 
            };


            this.mannualRetrivalService.addMannualRetrivalDetails1(dataToSend).subscribe(
              (response) => {
                $('#confirmationModel').modal('hide');
                this.toastr.success('Retrival Order successfully Completed.', '', { timeOut: 5000 });

                // this.fetchAllOrderDetailsBYCurrentDate();
                this.fetchAllMesAndNonMesMissionDetails();
                this.mannualRetrivalService.fetchAllManualDispatchDetails().subscribe((data) => {
                  // this.manualRetrivalForaddData = data;
                  this.manualRetrivalOrderList = data;
                });
              },
              (error) => {
                this.toastr.warning('Insufficient quantity for Part Number.', '', { timeOut: 5000 });
                console.error('Error while storing data', error);
              }
            );
          } else {
            console.log('Selected product variant not found.');
          }
        }
      },
      (error) => {
        console.error('Error fetching current shift:', error);
      }
    );
  }





  resetData() {
    if (this.cDatetimeStart == undefined || this.cDatetimeStart == null) {
      this.cDatetimeStart = "NA"
    }
    if (this.cDatetimeEnd == undefined || this.cDatetimeEnd == null) {
      this.cDatetimeEnd = "NA"
    }
    if (this.dispatchOrderNumber == undefined || this.dispatchOrderNumber == null) {
      this.dispatchOrderNumber = "NA"
    }
    if (this.productVariantCode == undefined || this.productVariantCode == null) {
      this.productVariantCode = "NA"
    }
    if (this.shiftName == undefined || this.shiftName == null) {
      this.shiftName = "NA"
    }
    if (this.orderSourceDetails == undefined || this.orderSourceDetails == null) {
      this.orderSourceDetails = "NA"
    }

  }


  public dateTimeValidation() {

    if (this.cDatetimeStart != null && (this.cDatetimeEnd == null || this.cDatetimeEnd == 'NA')) {
      this.disableDateTime = false;
      this.disableSearchButton = true;
    }

    else if (this.cDatetimeStart != null && this.cDatetimeEnd != null && this.cDatetimeStart <= this.cDatetimeEnd) {
      this.disableSearchButton = false;
    }

    else if (this.cDatetimeStart != null && this.cDatetimeEnd != null && this.cDatetimeStart < this.cDatetimeEnd) {
      this.disableSearchButton = false;
    }


    else if (this.cDatetimeStart == this.cDatetimeEnd) {
      this.disableSearchButton = false;
    }

    else {
      this.disableSearchButton = true;
    }
  }

  generateMannualRetrivalExcelReport() {
    if (this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
      return;
    }

    if (this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.length > 0) {



      const headerRowsCount = 6;


      const title = 'MANNUAL RETRIVAL DETAILS REPORT' + "    " + formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');


      const header = ["Sr.No", "Dispatch Order Number", "Part No", "Part Name", "Model", "Planned Quantity", "Acutual Quantity",
        "Balance Quantity", "Shift Name", "DispatchStatus", "CDatetime", "Order Type"];


      // Convert the id to sr.no
      for (let i = 0; i < this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.length; i++) {
        this.viewGenerateRetrivalNonMesAndMesOrderDetailsList[i].dispatchHistoryId = (i + 1)
      }

      const data = this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.map((obj) =>
        Object.values({
          dispatchHistoryId: obj.dispatchHistoryId,
          dispatchOrderNumber: obj.dispatchOrderNumber,
          productVariantCode: obj.productVariantCode,
          productVariantName: obj.productVariantName,

          productName: obj.productName,
          plannedQuantity: obj.plannedQuantity,
          acutualQuantity: obj.acutualQuantity,
          balanceQuantity: obj.balanceQuantity,
          shiftName: obj.shiftName,
          dispatchStatus: obj.dispatchStatus,
          createdDatetime: obj.createdDatetime,
          orderSourceDetails: obj.orderSourceDetails
        }
        )
      );


      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Infeed Mission Data');

      // Add new row
      let titleRow = worksheet.addRow([title]);

      // Set font, size and style in title row.
      // titleRow.font = { name: 'Calibri', family: 4, size: 22, underline: 'double', bold: true };
      titleRow.font = { name: 'Calibri', family: 4, size: 22 };
      // Align the title in the center
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      //Merge Cells
      worksheet.mergeCells(`A${titleRow.number}:K${titleRow.number}`);
      // worksheet.mergeCells("S1:S3");

      // Blank Row
      worksheet.addRow([]);

      //Add row with current date
      // let subTitleRow = worksheet.addRow(['Date & Time : ' + (new Date().toLocaleString())]);

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

        }
        cell.font = {

          color: { argb: 'FFFFFF' },
          size: 11,
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
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 15;
      worksheet.getColumn(8).width = 30;
      worksheet.getColumn(9).width = 34;
      worksheet.getColumn(10).width = 34;
      worksheet.getColumn(11).width = 34;
      worksheet.getColumn(12).width = 25;
      worksheet.getColumn(13).width = 15;
      worksheet.getColumn(14).width = 15;
      worksheet.getColumn(15).width = 15;
      worksheet.getColumn(16).width = 15;
      worksheet.getColumn(17).width = 15;
      worksheet.getColumn(18).width = 30;
      worksheet.getColumn(19).width = 30;
      worksheet.getColumn(20).width = 30;


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
      worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`);

      // Save the file in Excel format
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // const fileName="ProdData"+(new Date().getDay())+(new Date().getMonth())+(new Date().getFullYear())+(new Date().getTime())+(new Date().getMinutes())+(new Date().getSeconds());


        const todayDate = new Date();


        const fileName = "MannualDispatchReport_" + (todayDate.getDate()) + (todayDate.getMonth() + 1) + (todayDate.getFullYear()) + (todayDate.getHours())
          + (todayDate.getMinutes()) + (todayDate.getSeconds());

        fileServer.saveAs(blob, fileName + '.xlsx');
      })



    }
    else {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
    }
  }


  // generateMannualRetrivalPdfReport(): void {
  //   if (this.manualRetrivalOrderList.length > 0) {
  //     const pdf = new jsPDF({
  //       unit: 'mm',
  //       format: 'a3',
  //     });

  //     pdf.setFontSize(12);

  //     const title =
  //       'MANNUAL RETRIVAL DETAILS REPORT' +
  //       '    ' +
  //       formatDate(new Date(), 'dd-MMM-yyyy HH:mm:ss', 'en-US');
  //     pdf.text(title, 40, 40);

  //     for (let i = 0; i < this.manualRetrivalOrderList.length; i++) {
  //       this.manualRetrivalOrderList[i].dispatchHistoryId = i + 1;
  //     }

  //     const data = this.manualRetrivalOrderList.map((obj) =>
  //       Object.values({
  //         dispatchHistoryId: obj.dispatchHistoryId,
  //         dispatchOrderNumber: obj.dispatchOrderNumber,
  //         productVariantCode: obj.productVariantCode,
  //         productVariantName: obj.productVariantName,
  //         productName: obj.productName,
  //         plannedQuantity: obj.plannedQuantity,
  //         actualQuantity: obj.acutualQuantity,
  //         balanceQuantity: obj.balanceQuantity,
  //         shiftName: obj.shiftName,
  //         dispatchStatus: obj.dispatchStatus,
  //         createdDatetime: obj.createdDatetime,
  //         isDispatchStart: obj.isDispatchStart,
  //       })
  //     );

  //     const headerOrder = [
  //       "Sr.No",
  //       "Dispatch Order Number",
  //       "M&M Part No",
  //       "Model", 
  //       "Product Name",
  //       "Planned Quantity",
  //       "Actual Quantity",
  //       "Balance Quantity",
  //       "Shift Name",
  //       "Dispatch Status",
  //       "CDatetime",
  //       "Is Dispatch Start",
  //     ];

  //     // For the header
  //     pdf.autoTable({
  //       startY: 70,
  //       head: [headerOrder.map(col => ({ content: col }))],
  //       theme: 'grid',
  //       columnStyles: {
  //         // Set auto width for each column in the header
  //         0: { cellWidth: 'auto' },
  //         1: { cellWidth: 'auto' },
  //         2: { cellWidth: 'auto' },
  //         3: { cellWidth: 'auto' },
  //         4: { cellWidth: 'auto' },
  //         5: { cellWidth: 'auto' },
  //         6: { cellWidth: 'auto' },
  //         7: { cellWidth: 'auto' },
  //         8: { cellWidth: 'auto' },
  //         9: { cellWidth: 'auto' },
  //         10: { cellWidth: 'auto' },
  //         11: { cellWidth: 'auto' },
  //       },
  //       styles: { lineWidth: 0 },
  //     });

  //     // For the body
  //     pdf.autoTable({
  //       startY: pdf.previousAutoTable.finalY,
  //       body: data,
  //       theme: 'grid',
  //       columnStyles: {
  //         // Set auto width for each column in the table
  //         0: { cellWidth: 'auto' },
  //         1: { cellWidth: 'auto' },
  //         2: { cellWidth: 'auto' },
  //         3: { cellWidth: 'auto' },
  //         4: { cellWidth: 'auto' },
  //         5: { cellWidth: 'auto' },
  //         6: { cellWidth: 'auto' },
  //         7: { cellWidth: 'auto' },
  //         8: { cellWidth: 'auto' },
  //         9: { cellWidth: 'auto' },
  //         10: { cellWidth: 'auto' },
  //         11: { cellWidth: 'auto' },
  //       },
  //       styles: { lineWidth: 0 },
  //     });



  //     const todayDate = new Date();
  //     const fileName =
  //       'MannualDispatchReport_' +
  //       todayDate.getDate() +
  //       (todayDate.getMonth() + 1) +
  //       todayDate.getFullYear() +
  //       todayDate.getHours() +
  //       todayDate.getMinutes() +
  //       todayDate.getSeconds() +
  //       '.pdf';

  //     pdf.save(fileName);
  //   } else {
  //     alert('Data is not available');
  //   }
  // }

  header = [["Sr.No", "Dispatch Order Number", "Part No", "Part Name", "Model", "Planned Quantity", "Actual Quantity", "Balance Quantity", "Shift Name", "Dispatch Status", "CDatetime", "Order Type"]];



  // createPdf() {

  //   if (this.manualRetrivalOrderList.length === 0) {
  //     this.toastr.warning('Data is not available', 'warning', { timeOut: 10000, });
  //     return;
  //   }

  //   // doc = new jsPDF({ orientation: 'landscape', unit: 'px', floatPrecision: 2 });
  //   for (let i = 0; i < this.manualRetrivalOrderList.length; i++) {
  //     this.manualRetrivalOrderList[i].dispatchHistoryId = (i + 1);
  //   }
  //   const Tabledata = this.manualRetrivalOrderList.map((obj) =>
  //     Object.values({
  //       dispatchHistoryId: obj.dispatchHistoryId,
  //       dispatchOrderNumber: obj.dispatchOrderNumber,
  //       productVariantCode: obj.productVariantCode,
  //       productVariantName: obj.productVariantName,
  //       productName: obj.productName,
  //       plannedQuantity: obj.plannedQuantity,
  //       actualQuantity: obj.acutualQuantity,
  //       balanceQuantity: obj.balanceQuantity,
  //       shiftName: obj.shiftName,
  //       dispatchStatus: obj.dispatchStatus,
  //       createdDatetime: obj.createdDatetime,
  //       isDispatchStart: obj.isDispatchStart,

  //     }
  //     )

  //   );

  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('MannualDispatch Report', 11, 8);
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
  //   const fileName = 'MannualDispatchReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

  //   doc.save(fileName + '.pdf');

  // }



  createPdf() {
    if (this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.length === 0) {
      this.toastr.warning('Data is not available', 'warning', { timeOut: 10000 });
      return;
    }

    // Assign Serial Number to each entry
    for (let i = 0; i < this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.length; i++) {
      this.viewGenerateRetrivalNonMesAndMesOrderDetailsList[i].dispatchHistoryId = (i + 1);
    }

    // Prepare Data for Table
    const Tabledata = this.viewGenerateRetrivalNonMesAndMesOrderDetailsList.map((obj) =>
      Object.values({
        dispatchHistoryId: obj.dispatchHistoryId,
        dispatchOrderNumber: obj.dispatchOrderNumber,
        productVariantCode: obj.productVariantCode,
        productVariantName: obj.productVariantName,
        productName: obj.productName,
        plannedQuantity: obj.plannedQuantity,
        actualQuantity: obj.acutualQuantity,
        balanceQuantity: obj.balanceQuantity,
        shiftName: obj.shiftName,
        dispatchStatus: obj.dispatchStatus,
        createdDatetime: obj.createdDatetime,
        orderSourceDetails: obj.orderSourceDetails,
      })
    );

    // Initialize jsPDF with Landscape Orientation and Larger Page Size
    var doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

    // Add Title and User Information
    const title = 'MANUAL DISPATCH REPORT';
    doc.setFontSize(22);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('User: ' + this.authService.currentUserValue.userName, 10, 30);

    // Define Table Headers
    const headers = [['Sr.No', 'Dispatch Order Number', 'Part No', 'Part Name', 'Product Name', 'Planned Quantity', 'Actual Quantity', 'Balance Quantity', 'Shift Name', 'Dispatch Status', 'Created Date Time', 'Order Type']];

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
        1: { cellWidth: 70 }, // Adjust width of specific columns
        2: { cellWidth: 60 },
        3: { cellWidth: 100 },
        4: { cellWidth: 100 },
        5: { cellWidth: 100 },
        6: { cellWidth: 60 },
        7: { cellWidth: 60 },
        8: { cellWidth: 60 },
        9: { cellWidth: 80 },
        10: { cellWidth: 100 },
        11: { cellWidth: 100 },
        12: { cellWidth: 100 },
      },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

    // Generate File Name with Current Date and Time
    const todayDate = new Date();
    const fileName = 'ManualDispatchReport_' + todayDate.getDate() + (todayDate.getMonth() + 1) + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + '.pdf';

    // Save the PDF
    doc.save(fileName);
  }




}








