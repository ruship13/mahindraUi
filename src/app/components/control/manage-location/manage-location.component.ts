import { Component } from '@angular/core';
import { MappingFloorAreaDetailsModel } from 'src/app/models/mappingFloorAreaDetails.model';
import { MasterAreaDetailsModel } from 'src/app/models/masterAreaDetails.model';
import { MasterEquipmentDetailsModel } from 'src/app/models/masterEquipmentDetails.model';
import { MasterUserDetailsModel } from 'src/app/models/masterUserDetails.model';
import { AuthenticationService } from 'src/app/service/auth.service';
import { MappingFloorAreaDetailsService } from 'src/app/service/mappingFloorAreaDetails.service';
import { MasterAreaDetailsService } from 'src/app/service/masterAreaDetails.service';
import { MasterEquipmentDetailsService } from 'src/app/service/masterEquipmentDetails.service';
import { LocalStorageService } from 'src/app/utils/LocalStorageService';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.css']
})
export class ManageLocationComponent {
  // selectedArea: string|null=null;
  selectedArea: string = 'Area-1';
  //manageLocationDtOptions: DataTables.Settings = {};
  masterEquipmentDetailsList: MasterEquipmentDetailsModel[] = [];
  masterAreaList: MasterAreaDetailsModel[] = [];
  stacker1DataList: MasterEquipmentDetailsModel[] = [];
  stacker2DataList: MasterEquipmentDetailsModel[] = [];
  stacker3DataList: MasterEquipmentDetailsModel[] = [];
  stacker4DataList: MasterEquipmentDetailsModel[] = [];

  areaId1DetailsList: MappingFloorAreaDetailsModel[] = [];
  areaId2DetailsList: MappingFloorAreaDetailsModel[] = [];
  areaId3DetailsList: MappingFloorAreaDetailsModel[] = [];
  areaId4DetailsList: MappingFloorAreaDetailsModel[] = [];
  mappingFloorAreaDetailsList: MappingFloorAreaDetailsModel[] = [];
  stacker1!: string;
  stacker2!: string;
  stacker3!: string;
  stacker4!: string;
  area1!: any;
  area2!: any;
  area3!: any;
  area4!: any;
  area1DataList: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  area2DataList: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  area3DataList: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  area4DataList: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  mappingFloorArea1Details: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  mappingFloorArea2Details: MappingFloorAreaDetailsModel = new MappingFloorAreaDetailsModel();
  currentUser: MasterUserDetailsModel | undefined;
  constructor(private mappingFloorAreaDetailsService: MappingFloorAreaDetailsService,
    private masterEquipmentDetailsService: MasterEquipmentDetailsService, private authenticationService: AuthenticationService,
    private masterAreaDetails: MasterAreaDetailsService,
    private storage: LocalStorageService,) { }
  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    this.fetchAllMappingFloorAreaDetails();
    this.fetchDataByAreaId();
    this.fetchEquipmentdetails();
    this.fetchAllMasterAreaDetails();



    const lh = this.storage.get<number>('sideLPositionIsActive', 1);
    const rh = this.storage.get<number>('sideRPositionIsActive', 1);

    this.mappingFloorArea1Details.sideLPositionIsActive = lh ?? 1;
    this.mappingFloorArea1Details.sideRPositionIsActive = rh ?? 1;

    this.mappingFloorArea2Details.sideLPositionIsActive = lh ?? 1;
    this.mappingFloorArea2Details.sideRPositionIsActive = rh ?? 1;


  

  }

  isMonitor() {
    return this.currentUser?.roleName === 'MONITOR'
  }


  public fetchEquipmentdetails() {
    this.masterEquipmentDetailsService.fetchAllEquipmentDetails().subscribe(equipmentDetailsList => {
      this.masterEquipmentDetailsList = equipmentDetailsList;
      if (this.masterEquipmentDetailsList != null && this.masterEquipmentDetailsList != undefined) {
        // this.stacker1DataList=  this.masterequipmentDetailsList[0];

        // this.stacker2DataList= this.masterequipmentDetailsList[1];
        this.stacker1DataList = equipmentDetailsList.filter(equipmentId1 => equipmentId1.equipmentId == 1);
        this.stacker2DataList = equipmentDetailsList.filter(equipmentId1 => equipmentId1.equipmentId == 2);
        // this.stacker3DataList = equipmentDetailsList.filter(equipmentId1 => equipmentId1.equipmentId == 3);
        // this.stacker4DataList = equipmentDetailsList.filter(equipmentId1 => equipmentId1.equipmentId == 4);
        // console.log("get" + this.stacker4DataList)
      }




      !$(function () {
        $("#equipmentTableId").DataTable();
      });


    });

  }
  editSelectedEquipmentActiveInActiveCheckBox(updateEquipmentDetails: MasterEquipmentDetailsModel, areaId: number) {

    const userLoginDetails = this.authenticationService;
    updateEquipmentDetails.userId = userLoginDetails.currentUserValue.userId;

    if (updateEquipmentDetails.equipmentIsActive == 1) {
      updateEquipmentDetails.equipmentIsActive = 0;
      this.mappingFloorAreaDetailsService.updatAllMappingFloorAreaDetailsByareaId(0, 0, areaId).subscribe(data => {
        this.fetchAllMappingFloorAreaDetails();
        this.fetchDataByAreaId();
        this.masterEquipmentDetailsService.updateAllMasterEquipmentDetails(updateEquipmentDetails).subscribe(equipmentData => {
        })
      })


    }
    else {
      updateEquipmentDetails.equipmentIsActive = 1;
      this.mappingFloorAreaDetailsService.updatAllMappingFloorAreaDetailsByareaId(1, 1, areaId).subscribe(data => {
        this.fetchAllMappingFloorAreaDetails();
        this.fetchDataByAreaId();
        this.masterEquipmentDetailsService.updateAllMasterEquipmentDetails(updateEquipmentDetails).subscribe(equipmentData => {
        })
      })
    }

  }
  public fetchDataByAreaId() {
    this.mappingFloorAreaDetailsService.fetchMappingFloorAreaDetailsByAreaId(1).subscribe(mappingDetailsList => {
      this.areaId1DetailsList = mappingDetailsList;
      this.restoreStatesForArea(this.areaId1DetailsList);

    })
    this.mappingFloorAreaDetailsService.fetchMappingFloorAreaDetailsByAreaId(2).subscribe(area2MappingDetailsList => {
      this.areaId2DetailsList = area2MappingDetailsList;
      this.restoreStatesForArea(this.areaId2DetailsList);

    })
   
  }
  public fetchAllMappingFloorAreaDetails() {
    this.mappingFloorAreaDetailsService.fetchMappingFloorAreaDetails().subscribe(mappingDetailsList => {
      this.mappingFloorAreaDetailsList = mappingDetailsList;
      for (let areaActiveInactive of this.mappingFloorAreaDetailsList)
        if (areaActiveInactive.areaName == "Area-1") {
          this.area1 = areaActiveInactive.areaName;
          this.area1DataList = areaActiveInactive;
        }
        else if (areaActiveInactive.areaName == "Area-2") {

          this.area2 = areaActiveInactive.areaName;
          this.area2DataList = areaActiveInactive;
        }
      
      $(function () {
        $("#mappingFloorAreaTableId").DataTable();
      });

    });

  }





  updateMappingFloorAreaDetails(updateMappingFloorAreaDetailsInstance: MappingFloorAreaDetailsModel) {
    updateMappingFloorAreaDetailsInstance.userId = this.authenticationService.currentUserValue.userId;
    this.mappingFloorAreaDetailsService.updatAllMappingFloorAreaDetails(updateMappingFloorAreaDetailsInstance).subscribe(mappingDetailsList => {
      this.fetchAllMappingFloorAreaDetails();
    })
  }




  updateLockFloorAreaDetails(details: MappingFloorAreaDetailsModel, event: Event, side: string): void {
    const checkbox = event.target as HTMLInputElement;
    const isActive = checkbox.checked ? 0 : 1;

    details.userId = this.authenticationService.currentUserValue.userId;
    details.side = side;
    details.positionIsActive = isActive;

    // Store the checkbox state permanently in localStorage
    if (side === 'L') {
      details.sideLPositionIsActive = isActive;
      this.setInLocalStorage(`LH_Area${details.areaId}_${details.floorId}`, isActive); // Left side state
    } else if (side === 'R') {
      details.sideRPositionIsActive = isActive;
      this.setInLocalStorage(`RH_Area${details.areaId}_${details.floorId}`, isActive); // Right side state
    }

    // Log for debugging purposes
    console.log('Side ::', side);
    console.log('positionIsActive ::', isActive);
    console.log('details ::', JSON.stringify(details));

    // Call API to update the details (if necessary)
    this.mappingFloorAreaDetailsService.updatAllLockFloorAreaDetails(details).subscribe();
  }






  private restoreStatesForArea(areaList: MappingFloorAreaDetailsModel[]): void {
    areaList.forEach((item) => {
      // Retrieve stored states from localStorage (if any)
      const lhState = this.getFromLocalStorage(`LH_Area${item.areaId}_${item.floorId}`);
      const rhState = this.getFromLocalStorage(`RH_Area${item.areaId}_${item.floorId}`);

      // If no state is found in localStorage, default to 1 (unchecked)
      item.sideLPositionIsActive = lhState ?? 1; // Default to 1 if no value is found
      item.sideRPositionIsActive = rhState ?? 1; // Default to 1 if no value is found
    });
  }



  // Store checkbox state permanently in localStorage
  setInLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value)); // Save data permanently
  }

  // Retrieve data from localStorage
  getFromLocalStorage(key: string): any {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null; // If no item is found in localStorage
    }
    return JSON.parse(itemStr); // Return the stored data
  }




  toggleInfeedActiveInactive(data: any) {
    if (data.infeedIsActive == 1) {
      data.infeedIsActive = 0;
      this.updateMappingFloorAreaDetails(data)
    } else {
      data.infeedIsActive = 1;
      this.updateMappingFloorAreaDetails(data)
    }
  }

  toggleOutfeedActiveInactive(data: any) {
    if (data.outfeedIsActive == 1) {
      data.outfeedIsActive = 0;
      this.updateMappingFloorAreaDetails(data)
    } else {
      data.outfeedIsActive = 1;
      this.updateMappingFloorAreaDetails(data)
    }
  }



  onAreaChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedArea = target.value;
  }


  getSelectedAreaValue(): string {
    if (this.selectedArea !== null) {
      return this.selectedArea;
    } else {
      return 'Select Area';
    }
  }


  public fetchAllMasterAreaDetails() {
    this.masterAreaDetails.fetchAllAreaDetails().subscribe(
      areaDetailsList => {
        this.masterAreaList = areaDetailsList;
        console.log("masterAreaList ::" + this.masterAreaList);
      }
    );
  }

}

