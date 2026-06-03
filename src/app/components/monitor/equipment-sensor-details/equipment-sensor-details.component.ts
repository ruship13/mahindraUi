import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { EquipmentAlarmHistoryDetailsModel } from 'src/app/models/equipmentAlarmHistoryDetails.model';
import { MasterEquipmentDetailsModel } from 'src/app/models/masterEquipmentDetails.model';
import { MasterSensorDetailsModel } from 'src/app/models/masterSensorDetails.model';
import { MasterStackerDetailsModel } from 'src/app/models/masterStackerDetails.model';
import { MasterWmsEquipmentAlarmDetailsModel } from 'src/app/models/masterWmsEquipmentAlarmDetails.model';
import { StackerSensorDetailsModel } from 'src/app/models/stackerSensorDetails.model';
import { MasterEquipmentDetailsService } from 'src/app/service/masterEquipmentDetails.service';
import { MasterSensorDetailsService } from 'src/app/service/masterSensorDetails.service';
import { MasterStackerDetailsService } from 'src/app/service/masterStackerDetails.service';
import { StackerSensorDetailsService } from 'src/app/service/stackerSensorDetails.service';

@Component({
  selector: 'app-equipment-sensor-details',

  templateUrl: './equipment-sensor-details.component.html',
  styleUrls: ['./equipment-sensor-details.component.css']
})
export class EquipmentSensorDetailsComponent implements OnInit,OnDestroy {
  private subscriptions:Subscription=new Subscription();
  selectedEquipmentName: string = "MOTHERBABY-12";
  selectedStackerName: string = "STACKER-1";
  equipmenttDetailsDtOption: DataTables.Settings = {};
  stackerNameList: MasterEquipmentDetailsModel[] = [];
  stackerNameList1: MasterEquipmentDetailsModel[] = [];
  stackerNameList2: MasterEquipmentDetailsModel[] = [];
  stackerNameList3: MasterEquipmentDetailsModel[] = [];
  activeSensors: MasterEquipmentDetailsModel[] = [];
  equipmentName: any;
  viewWmsEquipmentAlarmHistoryId!: number;
  viewEquipmentAlarmId!: number;
  // isBabySensorDataList: MasterSensorDetailsModel[] = [];
  sensorAllDataList: MasterSensorDetailsModel[] = [];
  equipmentSensorDetailsTableList: MasterSensorDetailsModel[] = [];
  alarmAllDataList: EquipmentAlarmHistoryDetailsModel[] = [];
  sensorDetails: MasterSensorDetailsModel[] = [];
  sensorDetails1: MasterSensorDetailsModel[] = [];
  sensorDetails2: MasterSensorDetailsModel[] = [];
  StackerDetailsList: MasterStackerDetailsModel[] = [];
  StackerSensorDetailsList: StackerSensorDetailsModel[] = [];
  stacker1List: StackerSensorDetailsModel[] = [];
  stacker2List: StackerSensorDetailsModel[] = [];
  firstHalfStackerSensorDetailsList: StackerSensorDetailsModel[] = [];
  secondHalfStackerSensorDetailsList: StackerSensorDetailsModel[] = [];

  hoveredSensorDetails: StackerSensorDetailsModel | null = null;

  constructor(private masterStackerSetailsService: MasterStackerDetailsService,
    private stackerSensorDetailsService: StackerSensorDetailsService) {
  }
 ngOnDestroy(): void {
  
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {

    this.fetchAllStackerDetails();
    this.fetchByStackerIdList();


  }



  public fetchAllStackerDetails() {

    this.masterStackerSetailsService.fetchAllStackerDetails().subscribe(stackerDetails => {
      this.StackerDetailsList = stackerDetails;
      console.log("******")
      console.log(this.StackerDetailsList);
    })
  }


  public fetchAllStackerSensorDetails() {

    this.stackerSensorDetailsService.fetchStackerSensorDetails().subscribe(stackerSensorDetails => {
      this.StackerSensorDetailsList = stackerSensorDetails;
      console.log("******")
      console.log(this.StackerSensorDetailsList);
    })
  }



  public fetchByStackerIdList() {
    if (this.selectedStackerName == 'STACKER-1') {
      this.stackerSensorDetailsService.fetchByStackerId(1).subscribe(stackerList => {
        this.splitStackerSensorDetailsList(stackerList);
      });
    } else if (this.selectedStackerName == 'STACKER-2') {
      this.stackerSensorDetailsService.fetchByStackerId(2).subscribe(stackerList2 => {
        this.splitStackerSensorDetailsList(stackerList2);
      });
    } else {
      this.stackerSensorDetailsService.fetchByStackerId(1).subscribe(stackerList => {
        this.splitStackerSensorDetailsList(stackerList);
      });
    }
  }

  private splitStackerSensorDetailsList(stackerList: StackerSensorDetailsModel[]) {
    this.StackerSensorDetailsList = stackerList;
    const half = Math.ceil(stackerList.length / 2);
    this.firstHalfStackerSensorDetailsList = stackerList.slice(0, half);
    this.secondHalfStackerSensorDetailsList = stackerList.slice(half);
  }


  public getBoxClass(stackerSensorStatus: number | undefined): string {
    return stackerSensorStatus === 1 ? 'green-box' : 'gray-box';
  }

  showSensorDetails(sensor: StackerSensorDetailsModel) {
    this.hoveredSensorDetails = sensor;
  }

  hideSensorDetails() {
    this.hoveredSensorDetails = null;
  }

}
