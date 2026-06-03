import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DataTablesModule } from "angular-datatables";
import { NgxPaginationModule } from 'ngx-pagination';

import { MatPaginatorModule } from '@angular/material/paginator';
import { CurrentStockDetailsComponent } from "./current-stock-details/current-stock-details.component";
import { MonitorRoutingModule } from "./monitor-routing.module";
import { LayoutComponent } from "./layout/layout.component";
import { StackerLiveFaultsComponent } from "./stacker-live-faults/stacker-live-faults.component";
import { CurrentMissionsComponent } from './current-missions/current-missions.component';
import { MatIconModule } from "@angular/material/icon";
import { EquipmentSensorDetailsComponent } from "./equipment-sensor-details/equipment-sensor-details.component";

import { YokogawaTempratureDetailsComponent } from "./yokogawa-temprature-details/yokogawa-temprature-details.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { MockdrillMissionDetailsComponent } from "./mockdrill-mission-details/mockdrill-mission-details.component";



@NgModule({
    declarations: [
      
        // StackerLiveFaultsComponent,
        LayoutComponent,
        CurrentStockDetailsComponent,
        CurrentMissionsComponent,
        EquipmentSensorDetailsComponent,
        YokogawaTempratureDetailsComponent,
        MockdrillMissionDetailsComponent
       
    ],
    imports: [
       MonitorRoutingModule,
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        DataTablesModule,
        MatIconModule,
        NgxPaginationModule,
        MatPaginatorModule,
        NgApexchartsModule,
       
    ],
    exports: [],
    providers: [],

})
export class MonitorModule { }
