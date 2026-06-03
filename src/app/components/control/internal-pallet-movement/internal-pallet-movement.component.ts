import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { CurrentPalletStockDetailsModel } from 'src/app/models/currentPalletStockDetails.model';
import { MasterPositionDetailsModel } from 'src/app/models/masterpositionDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { TransferPalletMissionDetailsModel } from 'src/app/models/transferPalletMissionDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { CurrentPalletStockDetailsService } from 'src/app/service/currentPalletStockDetails.service';
import { MasterPositionDetailsService } from 'src/app/service/masterpositionDetails.service';
import { TransferPalletMissiontDetailsService } from 'src/app/service/transferPalletMissionDetails.service';

@Component({
  selector: 'app-internal-pallet-movement',
  templateUrl: './internal-pallet-movement.component.html',
  styleUrls: ['./internal-pallet-movement.component.css']
})
export class InternalPalletMovementComponent implements OnInit,OnDestroy {
   private subscriptions: Subscription = new Subscription();
  internalPalletMovementDtOptions: DataTables.Settings = {};
  currentPalletStockDetailsTableList: CurrentPalletStockDetailsModel[] = [];
  positionNameDetailsList: CurrentPalletStockDetailsModel[] = [];
  positionNameForDestinationList: MasterPositionDetailsModel[] = [];
  positionIdSearchList: MasterPositionDetailsModel[] = [];
  palletMovementMissionDetailsInstance: TransferPalletMissionDetailsModel = new TransferPalletMissionDetailsModel();
  addPalletMovementDetails: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  addPalletMovementDetailsInstance: CurrentPalletStockDetailsModel = new CurrentPalletStockDetailsModel();
  fetchAllMasterPositionDetailsList:MasterPositionDetailsModel[]=[];


  palletCode!: string;
  location!: string;
  positionName!: string;
  destinationName!: string;
  positionId!: number;
  positionIsActive: number = 1;
  positionISAllocated: number = 0;
  emptyPalletPosition: number = 1;
  transferPositionId!: number;
  checkDestinationNameExist: boolean = true;
  destinationPositionName!: string;
  currentPositionName!: string;
  userId!: number;
  userName!: string;
  intervalId: any;
  currentUser: MasterUserDetailsModel | undefined;





  constructor(private currentPalletStockDetailsService: CurrentPalletStockDetailsService,
    private masterPositionDetailsService: MasterPositionDetailsService,
    private transferPalletMissiontDetailsService: TransferPalletMissiontDetailsService,
    private authservice: AuthenticationService, private toastr: ToastrService) {

  }
 ngOnDestroy(): void {
   
    this.subscriptions.unsubscribe();
  }
 ngOnInit(): void {
  
  this.SessionClearMethod();
  
  
  this.currentUser = this.authservice.currentUserValue;

  this.fetchMasterPositionDetailsIdByPositionName();
  this.fetchAllMasterpositionDetails();
  this.savePalletMovementDetailsInTransferPalletMissionDetails();

  // Data table options configuration
  this.internalPalletMovementDtOptions = {
    pagingType: 'simple_numbers'
  };

 
  this.subscriptions.add(
    interval(10000).subscribe(() => {
      this.fetchAllMasterpositionDetails();
    })
  );
}
 public SessionClearMethod() {
    const authToken = sessionStorage.getItem('authToken');
    const currentUser = sessionStorage.getItem('currentUser');  
    const userRoles = sessionStorage.getItem('userRoles'); 

    sessionStorage.clear(); 
    
    if (authToken) sessionStorage.setItem('authToken', authToken);
    if (currentUser) sessionStorage.setItem('currentUser', currentUser);
    if (userRoles) sessionStorage.setItem('userRoles', userRoles);

    sessionStorage.setItem('internal-pallet-movement', 'true');
  }
  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }
  public fetchPalletOrderDetailsfromCurrentPalletStockdetails() {
    this.currentPalletStockDetailsService.fetchCurrentPalletStockDetailsByPalletCode(this.palletCode).subscribe(fetchPalletCodeData => {
      $('#palletDetailsId').DataTable().clear().destroy();

      this.currentPalletStockDetailsTableList = fetchPalletCodeData;
      this.positionName = this.currentPalletStockDetailsTableList[0].positionName;
      !$(function () {
        $("#palletDetailsId").DataTable();
      });

      console.log(this.palletCode);

    });
  }



  checkEnteredDestination(destLocation: string) {
    this.masterPositionDetailsService.fetchMasterPositionDetailsByPositionName(destLocation).subscribe(data => {
      console.log("data");
      console.log(data);
      if (data != null) {

      }
    })

  }

  public fetchAllMasterPositionDetailsByPositionNameAndPositionIsAllocatedAndEmptyPalletPositionAndPositionIsActive() {
    this.checkDestinationNameExist = true;
    console.log("2")
    console.log(this.destinationName);
    this.masterPositionDetailsService.fetchMasterPositionDetailsByPositionName(this.destinationName).subscribe(existDestinamtionList => {
      if (existDestinamtionList != null && existDestinamtionList.length > 0) {
        //   this.emptyPalletPosition = 1;
        // this.positionISAllocated = 0;
        // this.positionIsActive = 1;

        this.masterPositionDetailsService.fetchMasterPositionDetailsByPositionNameAndPositionIsAllocatedAndEmptyPalletPositionAndPositionIsActive(this.destinationName, this.positionISAllocated, this.emptyPalletPosition, this.positionIsActive).subscribe(positionNameList => {
          this.positionNameForDestinationList[0] = positionNameList;
          console.log("positionNameList"+positionNameList);
          console.log("this.positionNameForDestinationList.length" + this.positionNameForDestinationList.length);
          if (positionNameList != null && this.positionNameForDestinationList.length > 0) {
            this.destinationName = positionNameList.positionName;
            this.savePalletMovementDetailsInTransferPalletMissionDetails();

          }

          else {
            this.toastr.warning('position is not empty', '', { timeOut: 10000, });
          }

        });
      }
      else {
        this.toastr.warning('Destination location is not available', '', { timeOut: 10000, });
        // this.checkDestinationNameExist=false;

      }

    });


  }

  public fetchMasterPositionDetailsByPositionId() {
    this.masterPositionDetailsService.fetchMasterPositionDetailsByPositionId(this.positionId).subscribe(positionId => {
      this.positionIdSearchList = positionId;

    })
  }
  public fetchMasterPositionDetailsIdByPositionName() {
    if (this.positionId != undefined && this.positionName != undefined) {
      this.masterPositionDetailsService.fetchMasterPositionDetailsByPositionIdAndPositionName(this.positionId, this.positionName).subscribe
        (palletPositionList => {
          this.positionIdSearchList = palletPositionList;
          this.positionName = this.positionIdSearchList[0].positionName
          console.log("palletMovement" + this.positionIdSearchList);

        })
    }

  }
  currentPalletStockRow(currentPalletStockRow: CurrentPalletStockDetailsModel) {
    this.addPalletMovementDetailsInstance = Object.assign({}, currentPalletStockRow);

  }
  savePalletMovementDetailsInTransferPalletMissionDetails() {

    //this.palletMovementMissionDetailsInstance.isMissionGenerated = 0;
    // this.palletMovementMissionDetailsInstance.palletCode = this.currentPalletStockDetailsTableList[0].palletCode;
    // this.palletMovementMissionDetailsInstance.palletInformationId = this.currentPalletStockDetailsTableList[0].palletInformationId;
    //this.currentPositionName = this.currentPalletStockDetailsTableList[0].positionName;
    // this.palletMovementMissionDetailsInstance.positionId = this.currentPalletStockDetailsTableList[0].positionId;
    this.userId = this.authservice.currentUserValue.userId;
    this.userName = this.authservice.currentUserValue.userName;
    // this.palletMovementMissionDetailsInstance.transferPositionId = this.positionNameForDestinationList[0].positionId;
    this.palletMovementMissionDetailsInstance.transferPositionName = this.positionNameForDestinationList[0].positionName;

    this.transferPalletMissiontDetailsService.addAllPalletMovementDetailsInTransferPalletMissionDetails(this.positionName, this.destinationName, this.userId, this.userName).subscribe((palletransferMissionDetails) => {
      //alert(palletransferMissionDetails.error.text);
      if (palletransferMissionDetails.status == 200) {
        console.log("successfull :: " + palletransferMissionDetails.data);
        this.toastr.success(palletransferMissionDetails.message, 'success', { timeOut: 10000, });
      }
      else if (palletransferMissionDetails.status == 208) {
        this.toastr.warning(palletransferMissionDetails.message, 'warning', { timeOut: 10000, });
      }
      else if (palletransferMissionDetails.status == 204) {
        this.toastr.warning(palletransferMissionDetails.message, 'warning', { timeOut: 10000, });
      }
      else if (palletransferMissionDetails.status == 203) {
        this.toastr.error(palletransferMissionDetails.message, 'Error', { timeOut: 10000, });
      }
      else if (palletransferMissionDetails.status == 226) {
        this.toastr.error(palletransferMissionDetails.message, 'Error', { timeOut: 10000, });
      }
      else if (palletransferMissionDetails.status == 201) {
        this.toastr.error(palletransferMissionDetails.message, 'Error', { timeOut: 10000, });
      }

      else if (palletransferMissionDetails.status == 202) {
        this.toastr.error(palletransferMissionDetails.message, 'Error', { timeOut: 10000, });
      }
      

    });
    this.palletCode = "";
    this.positionName = "";
    this.destinationName = "";

  }


  public fetchAllMasterpositionDetails() {
    this.masterPositionDetailsService.fetchMasterPositionDetails().subscribe(mastePositionList => {
      this.fetchAllMasterPositionDetailsList = mastePositionList;
    });
  }
}
