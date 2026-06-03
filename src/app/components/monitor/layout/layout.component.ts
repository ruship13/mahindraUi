import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { CurrentStockDetails } from 'src/app/models/currentStockDetail';
import { ManualOutfeedMissionDetailsModel } from 'src/app/models/manualOutfeedMissionDetails.model';
import { MappingFloorAreaDetailsModel } from 'src/app/models/mappingFloorAreaDetails.model';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';

import { MasterFloorDetailsModel } from 'src/app/models/masterFloorDetails.model';
import { MasterRackDetailsModel } from 'src/app/models/masterRackDetails.model';
import { MasterRackPositionModel } from 'src/app/models/masterRackPosition.model';
import { MasterReasonDetailsModel } from 'src/app/models/masterReasonDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';

import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { StackerPositionDetailsModel } from 'src/app/models/stackerPositionDetails.model';
import { UserAuditTrailDetailsModel } from 'src/app/models/userAuditTrailDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import * as bootstrap from 'bootstrap';

import { CurrentPalletStockDetailsService } from 'src/app/service/currentPalletStockDetails.service';
import { ManualOutfeedMissionDetailsService } from 'src/app/service/manualOutfeedMissionDetails.service';
import { MappingFloorAreaDetailsService } from 'src/app/service/mappingFloorAreaDetails.service';
import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';

import { MasterFloorDetailsService } from 'src/app/service/masterFloorDetails.service';
import { MasterPalletInformationService } from 'src/app/service/masterPalletInformation.service';
import { MasterRackDetailsService } from 'src/app/service/masterRackDetails.service';
import { MasterReasonDetailsService } from 'src/app/service/masterReasonDetails.service';
import { MasterPositionDetailsService } from 'src/app/service/masterpositionDetails.service';
import { StackerPositionDetailsService } from 'src/app/service/stackerPositionDetails.service';
import { UserAuditTrailDetailsService } from 'src/app/service/userAuditTrailDetails.service';
import { Role } from 'src/app/utils/role.enum';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { interval, Subscription, switchMap } from 'rxjs';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],

})
export class LayoutComponent implements OnChanges, OnDestroy {
  changeDetection!: ChangeDetectionStrategy.Default;
  private subscriptions: Subscription = new Subscription();
  isValidated: boolean = false;
  isproductNameValidated: boolean = false;
  @ViewChild('unlockModal') unlockModal!: ElementRef;
  @ViewChild('unlockPositionModalId') reasonModal!: ElementRef;


  @ViewChild('updatecurrentStockModalForm') updatecurrentStockModalForm!: NgForm;
  @ViewChild('backgroundMusic') backgroundMusic!: ElementRef<HTMLAudioElement>;
  palletCodeList: CurrentPalletStockDetailsModel[] = [];
  serialNumberList: CurrentPalletStockDetailsModel[] = [];
  currentUser: MasterUserDetailsModel | undefined;
  currentStockDetails: CurrentStockDetails = new CurrentStockDetails();
  fetchAreaDetailsList: MasterAreaDetailsModel[] = [];
  masterRackPositionList: MasterRackPositionModel[] = [];
  masterRackPositionListLSIDE: MasterRackPositionModel[] = [];
  masterRackPositionListRSIDE: MasterRackPositionModel[] = [];
  fetchAllMasterPositionDetailsList: MasterPositionDetailsModel[] = [];
  currentStockDetailsList: CurrentPalletStockDetailsModel[] = [];
  masterReasonDetailsTableList: MasterReasonDetailsModel[] = [];
  reasonDropDownListFromAuditTrailDetails: UserAuditTrailDetailsModel[] = [];
  manualOutFeedMissionDetailsInstance: ManualOutfeedMissionDetailsModel = new ManualOutfeedMissionDetailsModel();

  deleteCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  editCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();

  areaNameDetailsdropdownList: MasterPositionDetailsModel[] = [];
  //floorIdDetails: MasterFloorDetailsModel[] = [];
  floorNameDropDownList: MasterFloorDetailsModel[] = [];

  masterRackDetailsList: MasterRackDetailsModel[] = [];
  masterRackDetailsListA1L1: MasterRackDetailsModel[] = [];
  masterRackDetailsListA1R1: MasterRackDetailsModel[] = [];

  selectAreaId!: number;
  selectAreaName!: string;
  selectedFloorName!: string;
  selectedFloorId!: number;
  isPositionIsLock: boolean = false;
  isPositionIsUnlock: boolean = false;
  isEmptypalletPosition: boolean = false;
  positionLockUnLockDeleteDetails!: String;
  positionIdLockUnLockDeleteDetails!: string;
  positionIsdeleted: boolean = false;

  positionId!: number;
  palletCode!: string;
  productVariantCode!: string;
  batchNumber!: string;
  userName!: string;
  materialCode!: string;
  quantity!: number;
  qualityStatus!: string;
  materialName!: string;
  //positionName!: any;
  positionNameLockUnLockDeleteDetails!: string;
  positionIdAndNameLockUnLockDeleteDetails!: string;
  by!: String;
  positionByUserIdLockUnLockDeleteDetails!: string;
  positionIdAndNameUserIdLockUnLockDeleteDetails!: string;
  operatorsAction!: any;


  currentPalletStockDetailsId!: number;
  unlockPositionReason!: String;
  lockPositionReason!: String;
  selectedQualityStatus!: string
  selectedAddReasonName!: string;
  reason!: any;
  binLocation!: any;
  positionIsAllocated: boolean = false;
  isPositionIsEmpty: boolean = false;
  isPositionIsEmpty1!: any;

  afterValue!: any;
  beforeValue!: any;
  field!: any;
  intervalId: any;
  stackerPositionList: StackerPositionDetailsModel[] = [];
  positionIsDeleted!: number;
  productVariantName!: string;
  posColumnCountList: any;
  columnCountList: any;
  columnCount: any;
  posColumnCount: any;
  isOutfeedInactiveDisable: boolean = false;
  selectedAreaAndfloorDetails: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  updateInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();

  positionName!: any;

  userId: any;

  productName: any;
  validationMessage: string = '';



  loadDateTime!: string;
  location!: string;

  modelNumber!: string;
  responseData: any;
  floorIdDetails: MasterFloorDetailsModel[] = [];
  dealLockCellTrue!: boolean;
  disabledeletebuttons!: boolean;
  serialNumber!: number;
  responseData2: any;
  responseData3: any;
  responseDataforAudio: any;
  comment!: string;
  responseDataMismatchCell: any;
  lockMessage!: string;

  constructor(private masterAreaDetailsService: MasterAreaDetailsService,
    private currentPalletStockDetailsService: CurrentPalletStockDetailsService,
    private masterPositionDetailsService: MasterPositionDetailsService,
    private masterFloorDetailsService: MasterFloorDetailsService,
    private manualOutfeedMissionDetailsService: ManualOutfeedMissionDetailsService,
    private userAuditTrailDetailsService: UserAuditTrailDetailsService,
    private masterRackDetailsService: MasterRackDetailsService,
    private masterReasonDetailsService: MasterReasonDetailsService,
    private stackerPositionDetailsService: StackerPositionDetailsService,
    private masterPalletInformationService: MasterPalletInformationService,
    private authService: AuthenticationService,
    private mappingFloorAreaDetailsService: MappingFloorAreaDetailsService,
    private mockDrillMissionService: TemperatureAlarmMissionRuntimeDetailsService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private el: ElementRef
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }



  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }


  private audio: HTMLAudioElement | null = null;
  private intervalIds: any[] = []; ngOnInit(): void {
    this.SessionClearMethod();


    this.currentUser = this.authService.currentUserValue;


    this.loadInitialData();


    const lastSelectedAreaId = localStorage.getItem('lastSelectedAreaId');
    const lastSelectedFloorId = localStorage.getItem('lastSelectedFloorId');

    if (lastSelectedAreaId && lastSelectedFloorId) {
      this.selectAreaId = parseInt(lastSelectedAreaId, 10);
      this.selectedFloorId = parseInt(lastSelectedFloorId, 10);
    } else {
      this.selectAreaId = 1;
      this.selectedFloorId = 1;
    }


    this.subscriptions.add(
      interval(120000).subscribe(() => {
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
  }

  private loadInitialData(): void {
    this.fetchAllMasterReasonDetails();
    this.fetchAllMasterPositionDetails();
    this.fetchAllAreaDetails();
    this.fetchFloorNameForCurrentStockDetails();
    this.fetchAllMismatchCell();
    // Optional: enable these only when required
    // this.findPalletDetailsByPalletCode();
    // this.findPalletDetailsBySerialNumber();
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

    sessionStorage.setItem('2d-layout', 'true');
  }


  isManualDispatchButtonDisabled(): boolean {
    return this.currentUser?.roleName === Role.Operator;
  }



  checkProductVariantAndQuantity(): boolean {

    if (
      this.dispatchCurrentStockDetailsInstance.productVariantCode === 'NA' &&
      this.dispatchCurrentStockDetailsInstance.quantity > 0
    ) {
      this.validationMessage = 'Quantity must be 0 if the Product Variant is NA';
      return true;
    }

    // Check if the product variant is not 'NA' and the quantity is 0
    if (
      this.dispatchCurrentStockDetailsInstance.productVariantCode !== 'NA' &&
      this.dispatchCurrentStockDetailsInstance.quantity === 0
    ) {
      this.validationMessage = 'Enter quantity greater than 0';
      return true;
    }

    this.validationMessage = '';
    return false;
  }




  isManualDispatchEnabled(positionName: string): boolean {
    const masterPositionDetails = this.fetchAllMasterPositionDetailsList.find(
      position => position.positionName === positionName

    );

    return !!masterPositionDetails &&
      (masterPositionDetails.isManualDispatch !== 1 || masterPositionDetails.emptyPalletPosition !== 1);

  }





  updateCurrentStockDetailsByPosition(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {


    this.updateInstance.palletCode = dispatchCurrentStockDetailsInstance.palletCode;
    this.updateInstance.productVariantCode = dispatchCurrentStockDetailsInstance.productVariantCode;
    this.updateInstance.batchNumber = dispatchCurrentStockDetailsInstance.batchNumber;
    this.updateInstance.quantity = dispatchCurrentStockDetailsInstance.quantity;
    this.updateInstance.productName = dispatchCurrentStockDetailsInstance.productName;
    this.updateInstance.qualityStatus = dispatchCurrentStockDetailsInstance.qualityStatus;
    this.updateInstance.serialNumber = dispatchCurrentStockDetailsInstance.serialNumber;
    dispatchCurrentStockDetailsInstance.positionId = this.positionId;

    this.currentPalletStockDetailsService.addOrUpdateMasterPalletInformation(dispatchCurrentStockDetailsInstance).subscribe(
      (currentstockdetails) => {
        // alert("Current Stock Details Updated Successfully");
        if (currentstockdetails.status === 200) {
          this.toastr.success(currentstockdetails.message, 'Success', { timeOut: 5000 });

        }
        else if (currentstockdetails.status === 226) {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 400) {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 208) {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 409) {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else if (currentstockdetails.status === 201) {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }
        else {
          this.toastr.error(currentstockdetails.message, 'Error', { timeOut: 5000 });
        }

        if (this.updatecurrentStockModalForm) {
          this.updatecurrentStockModalForm.reset();
        }
        this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
          data => {
            this.masterRackDetailsList = data;
            this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
            this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
          }
        );

        this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {
          this.masterRackPositionList = positionIdData;
          this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
          this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);
        });
      },
      error => {
        console.error("Error updating Current Stock Details:", error);

      }
    );
  }




  selectQualityStatusChangeHandler(value: string) {
    // console.log('Selected Quality Status:', value);
    this.editCurrentStockDetailsForSelectedIdInstance.qualityStatus = value;

  }

  public fetchAllMasterPositionDetails() {

    // this.selectAreaId = 1;
    // this.selectedFloorId = 1;
    const lastSelectedAreaId = localStorage.getItem('lastSelectedAreaId');
    const lastSelectedFloorId = localStorage.getItem('lastSelectedFloorId');

    // If both area and floor IDs are available, set them as default
    if (lastSelectedAreaId && lastSelectedFloorId) {
      this.selectAreaId = parseInt(lastSelectedAreaId, 10);
      this.selectedFloorId = parseInt(lastSelectedFloorId, 10);

    } else {
      // If no previous selection is available, use default values
      this.selectAreaId = 1;
      this.selectedFloorId = 1;
    }
    this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
      data => {

        this.masterRackDetailsList = data;

        // this.masterRackDetailsList=this.masterRackDetailsList.slice(0,212)
        this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
        this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);


      }

    );

    this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

      this.masterRackPositionList = positionIdData;

      this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
      this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);


    })
  }


  public selectAreaNameChangeHandler(value: number) {
    // this.selectAreaId = value;
    this.selectAreaId = value;
    localStorage.setItem('lastSelectedAreaId', value.toString());
    // this.floorIdDetails = this.floorNameDropDownList.filter(floorNameDetails => floorNameDetails.floorName == value);
    this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
      data => {
        this.masterRackDetailsList = data;
        //  this.masterRackDetailsList = this.masterRackDetailsList.slice(0,212);
        this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
        this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
      }

    );

    this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

      this.masterRackPositionList = positionIdData;
      //  this.masterRackPositionList=this.masterRackPositionList.slice(0,106);
      this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
      this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);


    })
  }
  public fetchAllAreaDetails() {
    this.masterAreaDetailsService.fetchAllAreaDetails().subscribe(areaList => {
      this.fetchAreaDetailsList = areaList;
    })

  }
  public selectFloorNameChangeHandler(value: number) {
    // this.selectedFloorId = value;
    this.selectedFloorId = value;
    localStorage.setItem('lastSelectedFloorId', value.toString());

    this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
      data => {
        this.masterRackDetailsList = data;
        //  this.masterRackDetailsList= this.masterRackDetailsList.slice(0,212);
        this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
        this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
      }

    );

    this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {


      this.masterRackPositionList = positionIdData;
      // this.masterRackPositionList=this.masterRackPositionList.slice(0,212);

      this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
      this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);





    })
  }
  public fetchAllMasterpositionDetails() {
    this.masterPositionDetailsService.fetchMasterPositionDetails().subscribe(mastePositionList => {
      this.fetchAllMasterPositionDetailsList = mastePositionList;
    });
  }



  fetchCurrentPalletStockDetailsByPositionId(positionId: number, positionName: any, isLock: boolean, isEmpty: boolean, isAllocated: boolean, dealLockTrue: boolean, disabledeletebutton: boolean) {
    this.dealLockCellTrue = dealLockTrue
    this.isPositionIsLock = isLock;
    this.disabledeletebuttons = disabledeletebutton
    this.isPositionIsEmpty = isEmpty;
    this.isEmptypalletPosition = isEmpty;
    this.positionIsAllocated = isAllocated;

    this.binLocation = positionName;
    this.positionId = positionId;

    this.palletCode = "";
    this.currentStockDetailsList = [];
    this.currentPalletStockDetailsService.findAllByPositionId(positionId).subscribe(CurrentStockDetailsByPositionIdList => {
      if (CurrentStockDetailsByPositionIdList.length > 0) {
        this.currentStockDetailsList = CurrentStockDetailsByPositionIdList;
        this.palletCode = this.currentStockDetailsList[0].palletCode;
        this.userName = this.currentStockDetailsList[0].userName;
        this.materialName = this.currentStockDetailsList[0].productVariantName;
        this.materialCode = this.currentStockDetailsList[0].productVariantCode;
        this.quantity = this.currentStockDetailsList[0].quantity;



        // this.fetchAllMasterpositionDetails();

        // console.log("adff : " + this.currentStockDetailsList);
      }
    });

    // console.log("binLocation--");
    // console.log(this.binLocation);
  }



  // fetch floor name 
  public fetchFloorNameForCurrentStockDetails() {
    this.masterFloorDetailsService.fetchAllMasterFloorDetails().subscribe(
      floorList => {
        this.floorNameDropDownList = floorList;
        // console.log("floorName"+this.floorNameDropDownList);
      }
    )
  }











  fetchAllCurrentPalletStockDetails() {
    this.currentPalletStockDetailsService.fetchCurrentPalletStockDetails().subscribe(curretnPalletStock => {
      this.currentStockDetailsList = curretnPalletStock;
      this.palletCode = this.currentStockDetailsList[0].palletCode;
      this.materialName = this.currentStockDetailsList[0].productVariantName;
      this.materialCode = this.currentStockDetailsList[0].productVariantCode;
      this.userName = this.currentStockDetailsList[0].userName;
      this.quantity = this.currentStockDetailsList[0].quantity;


    });
  }











  updateCurrentStockDetailsData(editCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel) {


    this.editCurrentStockDetailsForSelectedIdInstance.positionId = this.positionId;
    this.currentPalletStockDetailsService.updateCurrentStockData(editCurrentStockDetailsForSelectedIdInstance).subscribe((currentstockdetails) => {

      if (currentstockdetails.status === 200) {
        this.toastr.success(currentstockdetails.body?.message || 'Pallet Code Updated successfully!', 'Success', { timeOut: 5000 });
        this.fetchAllCurrentPalletStockDetails();
        this.fetchAllMasterPositionDetails();
      }
      else if (currentstockdetails.status === 201) {
        this.toastr.warning(currentstockdetails.body?.message || 'Product name does not match previous product name', 'Success', { timeOut: 5000 });
      }
      else if (currentstockdetails.status === 208) {
        this.toastr.warning(currentstockdetails.body?.message || 'Part Number is not Active', 'Success', { timeOut: 5000 });
      }
      else if (currentstockdetails.status === 226) {
        this.toastr.warning(currentstockdetails.body?.message || 'Part Number not available', 'Success', { timeOut: 5000 });
      }
      else {
        this.toastr.warning(currentstockdetails.body?.message || 'Pallet Code not Updated.', 'Error', { timeOut: 5000 });
      }

    });
  }

  //   updateCurrentStockDetailsData(editCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel) {
  //     console.log('Updating data:', editCurrentStockDetailsForSelectedIdInstance);
  //     this.currentPalletStockDetailsService.updateCurrentStockData(editCurrentStockDetailsForSelectedIdInstance).subscribe(currentstockdetails => {
  //   this.fetchAllCurrentPalletStockDetails();
  //   this.fetchAllMasterPositionDetails();
  //   alert("updated successfully!");
  // });

  //   }


  public deleteCurrentStockDetailsRow(deleteCurrentStockDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.deleteCurrentStockDetailsForSelectedIdInstance = Object.assign({}, deleteCurrentStockDetailsRowInstance);
  }

  public editCurrentStockDetailsRow(editCurrentStockDetailsRowInstance: CurrentPalletStockDetailsModel) {
    this.editCurrentStockDetailsForSelectedIdInstance = Object.assign({}, editCurrentStockDetailsRowInstance);
  }




  addCurrentStockDetailsInManualOutFeed(allCurrentPalletStockDetailsList: CurrentPalletStockDetailsModel) {
    this.manualOutFeedMissionDetailsInstance.isMissionGenerated = 0;
    this.manualOutFeedMissionDetailsInstance.palletInformationDetailsId = this.currentStockDetailsList[0].palletInformationId
    this.manualOutFeedMissionDetailsInstance.palletCode = this.currentStockDetailsList[0].palletCode;
    this.manualOutFeedMissionDetailsInstance.positionName = this.currentStockDetailsList[0].positionName;
    this.manualOutFeedMissionDetailsInstance.positionId = this.currentStockDetailsList[0].positionId;
    this.manualOutFeedMissionDetailsInstance.userName = this.currentStockDetailsList[0].userName;
    this.manualOutFeedMissionDetailsInstance.userId = this.currentStockDetailsList[0].userId;
    // this.manualOutFeedMissionDetailsInstance.isMissionGenerated=1;
    // this.manualOutFeedMissionDetailsInstance.userName = this.authService.currentUserValue.userName;


    this.manualOutfeedMissionDetailsService.addCurrentPalletStockdetailsInManualOutfeedMissionDetails(this.manualOutFeedMissionDetailsInstance).subscribe((outfeedMissionDetails) => {
      if (outfeedMissionDetails.status == 200) {


        this.toastr.success('Pallet Code Dispatched Succesfully.', 'success', { timeOut: 5000, });
        this.closeAllModalsAndUnfreeze();
        this.fetchAllCurrentPalletStockDetails();
        // this.fetchAllMasterPositionDetails();
        this.masterPositionDetailsService.updatIsManualDispatchInMasterPositionDetails(allCurrentPalletStockDetailsList.positionId).subscribe(isManaualDispatchData => {
          this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
            data => {
              this.masterRackDetailsList = data;
              //  this.masterRackDetailsList=this.masterRackDetailsList.slice(0,212);
              this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
              this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
            }

          );

          this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

            this.masterRackPositionList = positionIdData;
            // this.masterRackPositionList=this.masterRackPositionList.slice(0,212);

            this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
            this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);

            // console.log(" this.masterRackPositionList :: " + this.masterRackPositionList[2].position[0].positionId);




          })

        });

      } else if (outfeedMissionDetails.status == 208) {
        this.toastr.warning('Outfeed Mission is already generated.', '', { timeOut: 5000, });
      }
      // else if (outfeedMissionDetails.status == 203) {

      //   this.toastr.warning('This Area is Lock Outfeed Mission cannot be generated.', '', { timeOut: 5000, });
      // }
      else if (outfeedMissionDetails.status == 204) {

        this.toastr.warning('Position is not active.', '', { timeOut: 5000, });
      } else if (outfeedMissionDetails.status == 205) {
        this.toastr.warning('Position is empty.', '', { timeOut: 5000, });
      }

      else if (outfeedMissionDetails.status == 202) {
        this.toastr.error('Area-1 Dump Tank is not healthy.', '', { timeOut: 5000, });
      }

      else if (outfeedMissionDetails.status == 207) {
        this.toastr.error('Area-2 Dump Tank is not healthy.', '', { timeOut: 5000, });
      }
      else if (outfeedMissionDetails.status == 201) {
        this.toastr.warning('Position is locked', '', { timeOut: 5000, });
      }
      else if (outfeedMissionDetails.status == 208) {
        this.toastr.warning('Dispatch Mission Already Generated.', '', { timeOut: 5000, });
      }
      else if (outfeedMissionDetails.status == 203) {

        this.toastr.warning('Transfer mission is already generated', '', { timeOut: 5000, });
      }
    },
      (error) => {
        this.toastr.warning('Position is empty.', '', { timeOut: 5000, });
        console.error(error);
      }
    )
  }

  deleteCurrentPalletStockDetailsByCurrentStockId(deleteCurrentStockDetailsForSelectedIdInstance: CurrentPalletStockDetailsModel, field: any) {
    this.positionLockUnLockDeleteDetails = "Position Data Deleted :" + " ";
    this.positionIdLockUnLockDeleteDetails = this.positionId.toString();
    this.positionNameLockUnLockDeleteDetails = " " + this.binLocation;
    this.positionIdAndNameLockUnLockDeleteDetails = this.positionIdLockUnLockDeleteDetails.toString().concat(this.positionNameLockUnLockDeleteDetails.toString());
    this.by = " " + "by" + "  ";
    this.positionByUserIdLockUnLockDeleteDetails = this.by.concat(this.authService.currentUserValue.userName.toString())
    this.positionIdAndNameUserIdLockUnLockDeleteDetails = this.positionIdAndNameLockUnLockDeleteDetails.concat(this.positionByUserIdLockUnLockDeleteDetails.toString())
    this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    this.reason = this.selectedAddReasonName;
    this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.positionId, "PalletCode: " + deleteCurrentStockDetailsForSelectedIdInstance.palletCode, field, 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {

    })
    //  this.currentPalletStockDetailsId = this.currentStockDetailsList[0].currentPalletStockDetailsId;
    this.deleteCurrentStockDetailsForSelectedIdInstance.positionId = this.positionId;
    this.currentPalletStockDetailsService.deleteAllCurrentPalletStockDetailsByCurrentStockId(this.deleteCurrentStockDetailsForSelectedIdInstance.currentPalletStockDetailsId).subscribe(deleteCurretnPalletStock => {
      this.deleteCurrentStockDetailsForSelectedIdInstance = deleteCurretnPalletStock;
      if (this.currentStockDetailsList.length > 0) {

      }
      else if (this.currentStockDetailsList.length < 1) {

        this.masterPositionDetailsService.UpdatePositionIsEmpty(this.positionId).subscribe(updatePositionData => {
          this.fetchAllCurrentPalletStockDetails();
          this.fetchAllMasterPositionDetails();
        })
      }

    })



  }

  //   // to unlock position by positionId (unlock position function )
  unLockSelectedPosition(field: any) {
    // this.positionLockUnLockDeleteDetails = "Position Unlocked :" + " ";
    // this.positionIdLockUnLockDeleteDetails = this.positionId.toString();
    // this.positionNameLockUnLockDeleteDetails = " " + this.binLocation;
    // this.positionIdAndNameLockUnLockDeleteDetails = this.positionIdLockUnLockDeleteDetails.toString().concat(this.positionNameLockUnLockDeleteDetails.toString());
    // this.by = " " + "by" + "  ";
    // this.positionByUserIdLockUnLockDeleteDetails = this.by.concat(this.authService.currentUserValue.userName.toString())
    // this.positionIdAndNameUserIdLockUnLockDeleteDetails = this.positionIdAndNameLockUnLockDeleteDetails.concat(this.positionByUserIdLockUnLockDeleteDetails.toString())
    // this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    this.reason = this.selectedAddReasonName;
    this.comment = this.comment;
    // this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.positionId, this.reason, field, 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {
    ``
    // })

    this.masterPositionDetailsService.unlockSelectedPositionIsActive(this.positionId, this.reason, this.comment).subscribe({
      next: (unlockPositionData1) => {
        this.toastr.success('Position Unlocked Succesfully.', 'Success', { timeOut: 5000 });

        this.closeAllModalsAndUnfreeze();

        // Refresh data without page reload
        this.fetchAllMasterPositionDetails();
        this.cdr.detectChanges();

        // Reset form state
        this.selectedAddReasonName = '';
        this.comment = '';
      },
      error: (error) => {
        console.error('Unlock failed:', error);
        this.toastr.error('Unlock failed. Please try again.', 'Error');
        this.closeAllModalsAndUnfreeze();
      }
    });


  }

  // Unified fix to prevent ANY operation from leaving stacked/frozen modals
  closeAllModalsAndUnfreeze() {
    // 1. Hide all modal instances properly so Bootstrap knows they are closed
    document.querySelectorAll('.modal').forEach((modalElement: any) => {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    // 2. Cleanup body classes and remove lingering backdrops
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

      // Force stop any lingering ghost modals
      document.querySelectorAll('.modal.show').forEach((el: any) => {
        el.classList.remove('show');
        el.style.display = 'none';
      });
      this.cdr.detectChanges();
    }, 400);
  }


  // update current stock details by positionId(fill data function)
  updateCurrentStockDetailsByPositionID(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {


    debugger
    this.palletCode = dispatchCurrentStockDetailsInstance.palletCode;
    this.userName = this.authService.currentUserValue.userName;

    this.masterPalletInformationService.addPalletInformationDetailsFillData(this.palletCode, this.productName, this.productVariantCode, this.productVariantName, this.location
      , this.batchNumber, this.modelNumber, this.quantity, this.userId, this.userName).subscribe(addpalletdata => {
        // console.log("in fill data add pallet info detail");
        // console.log("this.productVariantCode === " + this, this.productVariantCode);

      })

    dispatchCurrentStockDetailsInstance.positionId = this.positionId;
    this.currentPalletStockDetailsService.updateCurrentStockDataByPositionId(dispatchCurrentStockDetailsInstance).subscribe(currentstockdetails => {
      // alert("CurrentStock Details Updated Successfully");
      this.toastr.success('Pallet Code Data Updated Succesfully.', 'Success', { timeOut: 5000, });
      // this.fetchAllCurrentPalletStockDetails();
      // this.fetchAllMasterPositionDetails();

      // console.log("editCurrentStockDetailsForSelectedIdInstance.positionId === ");
      // console.log(dispatchCurrentStockDetailsInstance.positionId);

      this.masterPositionDetailsService.updatePositionDetailsIsAllocatedAndEmpty(this.positionId).subscribe(updatePositiondetails => {


        this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
          data => {
            this.masterRackDetailsList = data;
            this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 18);
            this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(18, 36);
          }

        );

        this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {
          this.masterRackPositionList = positionIdData;
          this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 18);
          this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(18, 36);
        })
      })
      this.closeAllModalsAndUnfreeze();
    })

  }





  deleteCurrentStockDetailsPositionId(deletePositionCurrentStockDetailsByPositionId: CurrentPalletStockDetailsModel) {

    this.positionLockUnLockDeleteDetails = "Position Data Deleted :" + " ";

    this.positionIdLockUnLockDeleteDetails = this.positionId.toString();
    this.positionNameLockUnLockDeleteDetails = " " + this.binLocation;
    this.positionIdAndNameLockUnLockDeleteDetails = this.positionIdLockUnLockDeleteDetails.toString().concat(this.positionNameLockUnLockDeleteDetails.toString());
    this.by = " " + "by" + "  ";
    this.positionByUserIdLockUnLockDeleteDetails = this.by.concat(this.authService.currentUserValue.userName.toString())
    this.positionIdAndNameUserIdLockUnLockDeleteDetails = this.positionIdAndNameLockUnLockDeleteDetails.concat(this.positionByUserIdLockUnLockDeleteDetails.toString())
    this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    // this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    this.reason = this.selectedAddReasonName;
    this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.positionId, this.reason, "field", 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {

    })

    this.currentPalletStockDetailsService.deleteCurrentStockDetailsByPositionId(this.positionId).subscribe(deletePositionDataById => {
      this.deleteCurrentStockDetailsForSelectedIdInstance = deletePositionDataById;

      this.toastr.success('Pallet Code deleted Successfully.', 'Success', { timeOut: 5000, });
      this.closeAllModalsAndUnfreeze();
      this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
        data => {
          this.masterRackDetailsList = data;
          // this.masterRackDetailsList=this.masterRackDetailsList.slice(0,212);
          this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
          this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
        }

      );

      this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

        this.masterRackPositionList = positionIdData;
        //  this.masterRackPositionList=this.masterRackPositionList.slice(0,212);
        this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
        this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);

      })
    })


  }


  lockSelectedPosition(field: any) {


    // this.positionLockUnLockDeleteDetails = "Position Locked :" + " ";
    // this.positionIdLockUnLockDeleteDetails = this.positionId.toString();
    // this.positionNameLockUnLockDeleteDetails = " " + this.binLocation;
    // this.positionIdAndNameLockUnLockDeleteDetails = this.positionIdLockUnLockDeleteDetails.toString().concat(this.positionNameLockUnLockDeleteDetails.toString());
    // this.by = " " + "by" + "  ";
    // this.positionByUserIdLockUnLockDeleteDetails = this.by.concat(this.authService.currentUserValue.userName.toString())
    // this.positionIdAndNameUserIdLockUnLockDeleteDetails = this.positionIdAndNameLockUnLockDeleteDetails.concat(this.positionByUserIdLockUnLockDeleteDetails.toString())
    // this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    // this.operatorsAction = this.positionLockUnLockDeleteDetails.concat(this.positionIdAndNameUserIdLockUnLockDeleteDetails.toString());
    this.reason = this.selectedAddReasonName;
    this.comment = this.comment;
    // this.userAuditTrailDetailsService.addUserAuditTrailDetails(this.operatorsAction, this.positionId, this.reason, field, 1, 2, this.authService.currentUserValue.userName).subscribe(reasonData => {

    // })
    this.masterPositionDetailsService.lockSelectedPositionIsActive(this.positionId, this.reason, this.comment).subscribe(lockPositionData1 => {
      this.toastr.success('Position Locked Succesfully.', 'Success', { timeOut: 5000, });
      this.closeAllModalsAndUnfreeze();

      this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
        data => {
          this.masterRackDetailsList = data;
          // this.masterRackDetailsList=this.masterRackDetailsList.slice(0,212);
          this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
          this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
        }

      );

      this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

        this.masterRackPositionList = positionIdData;
        // this.masterRackPositionList = this.masterRackPositionList.slice(0,212);
        this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
        this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);

      })
    })

  }
  freeAllocatedPosition() {
    this.masterPositionDetailsService.updatePositionIsAllocated(this.positionId).subscribe(data => {
      this.masterRackDetailsService.fetchAllRackDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(
        data => {
          this.masterRackDetailsList = data;
          // this.masterRackDetailsList=this.masterRackDetailsList.slice(0,212);
          this.masterRackDetailsListA1L1 = this.masterRackDetailsList.slice(0, 12);
          this.masterRackDetailsListA1R1 = this.masterRackDetailsList.slice(12, 24);
        }

      );

      this.masterPositionDetailsService.fetchMasterPositionDetailsByAreaIdAndFloorId(this.selectAreaId, this.selectedFloorId).subscribe(positionIdData => {

        this.masterRackPositionList = positionIdData;
        // this.masterRackPositionList =this.masterRackPositionList .slice(0,212);
        this.masterRackPositionListLSIDE = this.masterRackPositionList.slice(0, 12);
        this.masterRackPositionListRSIDE = this.masterRackPositionList.slice(12, 24);
      })
      this.closeAllModalsAndUnfreeze();
    })
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
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  public stackerPositionDetails() {
    this.stackerPositionDetailsService.fetchStackerPositionDetails().subscribe(sPositiondetails => {
      this.stackerPositionList = sPositiondetails;

    })
  }




  validatePalletCode(dispatchCurrentStockDetailsInstance: CurrentPalletStockDetailsModel) {
    // const palletCode = this.dispatchForm.get('palletCode')?.value;
    const palletCode = dispatchCurrentStockDetailsInstance.palletCode;

    if (!palletCode) {

      // this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Pallet Code is empty', life: 3000 });
      return;
    }

    this.currentPalletStockDetailsService.validatePalletCode(palletCode).subscribe(
      (response) => {
        // console.log("Pallet Code:", palletCode);

        if (response.status === 200) {
          // console.log("Validated.....");
          this.isValidated = true;
          this.validationMessage = ""; // Clear validation message if needed

        } else if (response.status === 204) {
          this.isValidated = false;
          this.validationMessage = " Pallet code is duplicate.";
        }
      },
      (error) => {
        this.isValidated = false;
        this.validationMessage = "Position is empty";
        console.error(error);
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
          console.log("Validated.....");
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

  onPalletCodeChange() {
    this.isValidated = false;
    this.validationMessage = "Please validate pallet code using the icon.";
  }



  getEmptyPositionAlarm(): void {
    this.masterPositionDetailsService.findEmptyPositionAlarm().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseData = response.body;
          const message = this.responseData.message;
          // console.log('Response from backend:', message);

          $('#confirmationModel').modal('show');
        }
      },
      error => {
        console.error('Error fetching empty position alarm:', error);
      }
    );
  }


  // getAlarmForPosition(): void {
  //   console.log("1");
  //   this.masterPositionDetailsService.getAlarm().subscribe(
  //     (response: HttpResponse<any>) => {
  //       if (response.status === 200) {
  //         console.log("2");
  //         const audio = new Audio('/assets/audio/Siren.mp3');
  //         audio.play();
  //         console.log("3");
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching empty position alarm:', error);
  //     }
  //   );
  // }


  getAlarmForPosition(): void {
    // console.log("Fetching alarm...");
    this.masterPositionDetailsService.getAlarm().subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.responseDataforAudio = response.body;
          const message = this.responseDataforAudio.message;
          // console.log('Response from backend**********:', message);

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


  // public () {

  //   this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByPalletCode(this.palletCode).subscribe(palletCodeListData => {
  //     this.palletCodeList = palletCodeListData;
  //     console.log("palletCodeList1111111111" + this.palletCodeList);
  //   })
  // }

  // public findPalletDetailsByPalletCode() {

  //   this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByPalletCode(this.palletCode).subscribe(palletCodeListData => {
  //     this.palletCodeList = palletCodeListData;
  //     console.log("palletCodeList1111111111" + this.palletCodeList);
  //     console.log(this.palletCode);

  //   });
  // }
  // public findPalletDetailsByPalletCode(event: Event) {
  //   event.preventDefault();
  //   this.palletCodeList = [];

  //   this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByPalletCode(this.palletCode).subscribe(
  //     palletCodeListData => {
  //       this.palletCodeList = palletCodeListData;
  //       console.log("pallet code  List: ", this.palletCodeList);
  //       console.log("Searched Pallet Code: ", this.palletCode);
  //     },
  //     error => {
  //       console.error("Error fetching palletCodeList details: ", error);
  //     }
  //   );
  // }



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

  //   public findPalletDetailsBySerialNumber(event: Event) {
  //     event.preventDefault();
  //     this.serialNumberList = [];

  //     this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsBySerialNumber(this.serialNumber).subscribe(
  //         SerialListData => {
  //             this.serialNumberList = SerialListData;
  //             console.log("Serial Number List: ", this.serialNumberList);
  //             console.log("Searched Serial Number: ", this.serialNumber);
  //         },
  //         error => {
  //             console.error("Error fetching serial number details: ", error);
  //         }
  //     );
  // }

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
  selectedPosition: any = null;

  handleUnlockClick(position: any) {



    console.log("Unlock clicked for:", position);
    this.selectedPosition = position;

    const positionName =
      typeof position === 'string'
        ? position.trim()
        : position?.positionName?.trim();

    if (!positionName) {
      this.lockMessage = "Invalid position selected.";
      return;
    }

    // const normalizedPosition = positionName.toLowerCase();
    let latestLockRecord: any = null;
    debugger
    // ✅ Move everything inside subscribe
    this.userAuditTrailDetailsService
      .fetchLatestLockreasonByPosition(this.selectedPosition)
      .subscribe({
        next: (response) => {



          latestLockRecord = response;
          console.log("Latest Lock Record:", latestLockRecord);


          if (latestLockRecord) {
            const formattedDate = new Date(latestLockRecord.currentDate)
              .toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

            const reason = `${latestLockRecord.comment || ''}`.trim();

            this.lockMessage = `
🔒 ${positionName} locked by ${latestLockRecord.username}
at ${formattedDate} for the
${reason ? ` ${reason}.` : ''}

Are you sure to unlock  Unlock this position?
`;


          } else {
            this.lockMessage =
              `No previous lock record found for ${positionName}.
             Do you want to continue unlocking?`;
          }

          this.cdr.detectChanges();

          const modalElement = this.unlockModal.nativeElement;
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement, { focus: false });
          modal.show();
        },

        error: (err) => {
          console.error("API Error:", err);

          this.lockMessage = "Error fetching lock details. Try again.";

          const modalElement = this.unlockModal.nativeElement;
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement, { focus: false });
          modal.show();
        }
      });
  }




  proceedToReasonModal() {

    this.selectedAddReasonName = '';

    const confirmModal = bootstrap.Modal.getInstance(
      this.unlockModal.nativeElement
    );
    confirmModal?.hide();

    setTimeout(() => {
      const reasonModalElement = this.reasonModal.nativeElement;
      const reasonModal = bootstrap.Modal.getInstance(reasonModalElement) || new bootstrap.Modal(reasonModalElement, { focus: false });
      reasonModal.show();
    }, 400); // Wait properly for hide animation
  }
}


