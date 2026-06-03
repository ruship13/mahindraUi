import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { DashboardDetailsModel } from 'src/app/models/dashboardDetails.model';

import { EquipmentAlarmHistoryDetailsModel } from 'src/app/models/equipmentAlarmHistoryDetails.model';
import { MasterEquipmentDetailsModel } from 'src/app/models/masterEquipmentDetails.model';
import { DashboardDetailsService } from 'src/app/service/dashboardDetails.service';
import { EquipmentAlarmHistoryDetailsService } from 'src/app/service/equipmentAlarmHistoryDetails.service';
import { MasterEquipmentDetailsService } from 'src/app/service/masterEquipmentDetails.service';

@Component({
  selector: 'app-stacker-live-faults',
  templateUrl: './stacker-live-faults.component.html',
  styleUrls: ['./stacker-live-faults.component.css']
})
export class StackerLiveFaultsComponent implements OnInit {
  // EqupmentAlarmHistoryDtOptions: DataTables.Settings = {};
  // equipmentFirstAlarmHistoryDetailsTableList: EquipmentAlarmHistoryDetailsModel[] = [];
  // dashboardDetailsList: DashboardDetailsModel = new DashboardDetailsModel();
  // disableSearchButton: boolean = false;
  // disableDateTime: boolean = true;
  // euipmentNameList: EquipmentAlarmHistoryDetailsModel[] = [];
  // stackerNameList: any[] = [];
  // selectEquipmentName!: string;
  // selectEquipmentId: EquipmentAlarmHistoryDetailsModel[] = [];
  // equipmentDetailsNameList: string[] = [];
  // equipmentAlarmHistoryDetailslist: EquipmentAlarmHistoryDetailsModel[] = [];
  stacker1AlarmCount!: number;
  stacker2AlarmCount!: number;
  stacker3AlarmCount!: number;
  intervalId: any;

  equipment1IdList: EquipmentAlarmHistoryDetailsModel[] = [];
  equipment2IdList: EquipmentAlarmHistoryDetailsModel[] = [];
  equipment3IdList: EquipmentAlarmHistoryDetailsModel[] = [];



  constructor(private equipmentAlarmHistoryDetailsService: EquipmentAlarmHistoryDetailsService,
    private dashboardDetailsService: DashboardDetailsService) { }

  // ngOnDestroy(): void {
  //   clearInterval(this.intervalId);

  // }

  ngOnInit(): void {

    // window.location.href = 'http://10.192.65.167:8085/BatteryPackalarmdashboard';
     this.fetchDataByEquipmentZone();



  }







  public fetchDataByEquipmentZone() {
    this.equipmentAlarmHistoryDetailsService.fetchAllZone1AlarmDetails().subscribe(equipmentIdList => {

      this.equipment1IdList = equipmentIdList;
      console.log("equipmnetId1 data::" + JSON.stringify(this.equipment1IdList));
      this.stacker1AlarmCount = this.equipment1IdList.length;
    })
    this.equipmentAlarmHistoryDetailsService.fetchAllZone2AlarmDetails().subscribe(equipment2IdList => {
      this.equipment2IdList = equipment2IdList;
      this.stacker2AlarmCount = this.equipment2IdList.length;
      console.log(" this.equipment2IdList.length :: " + this.equipment2IdList.length);
    })
    this.equipmentAlarmHistoryDetailsService.fetchAllZone3AlarmDetails().subscribe(equipment3IdList => {
      this.equipment3IdList = equipment3IdList
      this.stacker3AlarmCount = this.equipment3IdList.length;
      console.log(" this.equipment3IdList.length :: " + this.equipment3IdList.length);
    })

  }


  getBackgroundColorClass(alarmLevel: string): string {
    switch (alarmLevel) {
      case 'HIGH':
        return 'high-level';
      case 'MEDIUM':
        return 'medium-level';
      case 'LOW':
        return 'low-level';
      default:
        return '';
    }
  }



}

