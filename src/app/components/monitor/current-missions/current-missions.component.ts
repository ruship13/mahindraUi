import { Component } from '@angular/core';


import { InfeedMissionRuntimeDetailsModel } from '../../../models/infeedMissionRuntimeDetails.model';
import { OutfeedMissionRuntimeDetailsModel } from '../../../models/outfeedMissionRuntimeDetails.model';
import { TransferPalletMissionRuntimeDetailsModel } from 'src/app/models/transferPalletMissionRuntimeDetails.model';
import { TransferPalletMissionRuntimeDetailsService } from 'src/app/service/transferPalletMissionRuntimeDetails.service';
import { InfeedMissionRuntimeDetailsService } from 'src/app/service/infeedMissionRuntimeDetails.service';
import { OutfeedMissionRuntimeDetailsService } from 'src/app/service/outfeedMissionRuntimeDetails.service';
import { TemperatureAlarmMissionRuntimeDetailsModel } from 'src/app/models/temperatureAlarmMissionRuntimeDetailsModel.model';
import { TemperatureAlarmMissionRuntimeDetailsService } from 'src/app/service/temperatureAlarmMissionRuntimeDetailsService.service';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-current-missions',
  templateUrl: './current-missions.component.html',
  styleUrls: ['./current-missions.component.css']
})
export class CurrentMissionsComponent {
  intervalIds: any[] = []; // Store all interval IDs
  infeedMissionRuntimeDetailsList: InfeedMissionRuntimeDetailsModel[] = [];
  editInfeedMissionRuntimeDetailsInstance: InfeedMissionRuntimeDetailsModel = new InfeedMissionRuntimeDetailsModel;
  outfeedMissionRuntimeDetailsList: OutfeedMissionRuntimeDetailsModel[] = [];
  selectedEditInfeedMissionStatus!: string;
  selectedEditOutfeedMissionStatus!: string;
  intervalId: any;
  editOutfeedMissionRuntimeDetailsInstance: OutfeedMissionRuntimeDetailsModel = new OutfeedMissionRuntimeDetailsModel;
  transferPalletRuntimeDetailsList: TransferPalletMissionRuntimeDetailsModel[] = [];
  temperatureAlarmMissionRuntimeDetailsModelList: TemperatureAlarmMissionRuntimeDetailsModel[] = [];
  currentUser: MasterUserDetailsModel | undefined;


  editTransferPalletMissionRuntimeDetailsInstance: TransferPalletMissionRuntimeDetailsModel = new TransferPalletMissionRuntimeDetailsModel;
  constructor(private infeedMissionRuntimeDetailsService: InfeedMissionRuntimeDetailsService,
    private outfeedMissionRuntimeDetailsService: OutfeedMissionRuntimeDetailsService,
    private transferPalletMissionRuntimeDetailsService: TransferPalletMissionRuntimeDetailsService,
    private temperatureAlarmMissionRuntimeDetailsService: TemperatureAlarmMissionRuntimeDetailsService,
   private authService: AuthenticationService,) { }
  ngOnDestroy() {
    console.log("Clearing all timers");
    this.intervalIds.forEach(intervalId => clearInterval(intervalId)); // Clear all intervals
    this.intervalIds = []; // Reset the array
  }

  ngOnInit(): void {
    this.SessionClearMethod();
    this.currentUser = this.authService.currentUserValue;
    this.fetchInfeedMissionDetailsData();
    this.fetchOutfeedMissionDetailsData();
    this.fetchTransferPalletMissionDetailsData();
    this.fetchAllTemperatureAlarmDetails();

    this.intervalIds.push(setInterval(() => {
      this.fetchInfeedMissionDetailsData();
      this.fetchOutfeedMissionDetailsData();
      this.fetchTransferPalletMissionDetailsData();
      this.fetchAllTemperatureAlarmDetails();

    }, 10000));
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

    sessionStorage.setItem('current-mission', 'true'); // Mark dashboard as loaded
  }

  public isMonitor(): boolean {
    return this.currentUser?.roleName === 'MONITOR'
  }

  public fetchInfeedMissionDetailsData() {
    this.infeedMissionRuntimeDetailsService.fetchInfeedMissionRuntimeDetails().subscribe(infeedMissionList => {
      console.log(infeedMissionList);
      this.infeedMissionRuntimeDetailsList = infeedMissionList;
    })
  }


  public fetchAllTemperatureAlarmDetails() {
    this.temperatureAlarmMissionRuntimeDetailsService.fetchTemperatureAlarmMissionRuntimeDetails().subscribe(tempList => {
      this.temperatureAlarmMissionRuntimeDetailsModelList = tempList;
      // console.log("TemperatureAlarmMissionRuntimeDetailsList :: " + JSON.stringify(this.temperatureAlarmMissionRuntimeDetailsModelList));
    })
  }
  public editInfeedMissionRuntimeDetails(editInfeedMissionRuntimeDetailsInstance: InfeedMissionRuntimeDetailsModel) {

    this.infeedMissionRuntimeDetailsService.updateInfeedMissionRuntimeDetailsDetails(editInfeedMissionRuntimeDetailsInstance).subscribe(infeedMissionDetailsList => {
      this.fetchInfeedMissionDetailsData();
    });

  }
  public editInfeedMissionRuntimeDetailsRow(editInfeedMissionRuntimeDetailsInstance: InfeedMissionRuntimeDetailsModel) {
    this.editInfeedMissionRuntimeDetailsInstance = Object.assign({}, editInfeedMissionRuntimeDetailsInstance);

  }
  selectEditInfeedMissionStatusChangeFromDropDownList(value: any) {


  }

  public fetchOutfeedMissionDetailsData() {
    this.outfeedMissionRuntimeDetailsService.fetchOutfeedMissionRuntimeDetails().subscribe(outfeedMissionList => {
      this.outfeedMissionRuntimeDetailsList = outfeedMissionList;

    })
  }
  public editOutfeedMissionRuntimeDetails(editOutfeedMissionRuntimeDetailsInstance: OutfeedMissionRuntimeDetailsModel) {

    this.outfeedMissionRuntimeDetailsService.updateOutfeedMissionRuntimeDetails(editOutfeedMissionRuntimeDetailsInstance).subscribe(outfeedMissionDetailsList => {
      this.fetchOutfeedMissionDetailsData();
    });

  }
  public editOutfeedMissionRuntimeDetailsRow(editOutfeedMissionRuntimeDetailsInstance: OutfeedMissionRuntimeDetailsModel) {
    this.editOutfeedMissionRuntimeDetailsInstance = Object.assign({}, editOutfeedMissionRuntimeDetailsInstance);


  }
  selectEditOutfeedMissionStatusChangeFromDropDownList(value: any) {


  }

  public fetchTransferPalletMissionDetailsData() {
    this.transferPalletMissionRuntimeDetailsService.fetchTransferPalletMissionRuntimeDetails().subscribe(transferPalletMissionList => {
      this.transferPalletRuntimeDetailsList = transferPalletMissionList;
      console.log("list ::" + this.transferPalletRuntimeDetailsList);
    })
  }

  public editTransferPalletMissionRuntimeDetails(editTransferPalletMissionRuntimeDetailsInstance: TransferPalletMissionRuntimeDetailsModel) {

    this.transferPalletMissionRuntimeDetailsService.updateTransferPalletMissionRuntimeDetailsDetails(editTransferPalletMissionRuntimeDetailsInstance).subscribe(infeedMissionDetailsList => {
      this.fetchTransferPalletMissionDetailsData();
    });

  }
  public editTransferPalletMissionRuntimeDetailsRow(editTransferPalletMissionRuntimeDetailsInstance: TransferPalletMissionRuntimeDetailsModel) {
    this.editTransferPalletMissionRuntimeDetailsInstance = Object.assign({}, editTransferPalletMissionRuntimeDetailsInstance);

  }
  selectEditTransferPalletMissionStatusChangeFromDropDownList(value: any) {
  }


}
