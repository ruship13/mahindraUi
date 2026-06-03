import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DataTablesModule } from "angular-datatables";
import { ReportsRoutingModule } from "./reports-routing.module";

import { AuditTrailReportComponent } from './audit-trail-report/audit-trail-report.component';
import { AlarmHistoryReportComponent } from './alarm-history-report/alarm-history-report.component';
import { InfeedMissionRuntimeDetailsComponent } from "./infeed-mission-runtime-details/infeed-mission-runtime-details.component";
import { OutfeedMissionRuntimeDetailsComponent } from "./outfeed-mission-runtime-details/outfeed-mission-runtime-details.component";

import { TransferpalletMissionRuntimeDetailsComponent } from "./transferpallet-mission-runtime-details/transferpallet-mission-runtime-details.component";
import { InventorysummaryReportComponent } from "./inventory-Summary-Report/inventory-summary-report.component";
import { MatIconModule } from "@angular/material/icon";
import { LockUnlockCellDetailsComponent } from "./lock-unlock-cell-details/lock-unlock-cell-details.component";
import { TemperatureMissionRuntimeDetailsComponent } from "./temperature-mission-runtime-details/temperature-mission-runtime-details.component";







@NgModule({
    declarations:[
       
   
        AuditTrailReportComponent,
        AlarmHistoryReportComponent,
        AuditTrailReportComponent,
        InfeedMissionRuntimeDetailsComponent,
        OutfeedMissionRuntimeDetailsComponent,
        InventorysummaryReportComponent ,
        TransferpalletMissionRuntimeDetailsComponent,
        LockUnlockCellDetailsComponent,
        TemperatureMissionRuntimeDetailsComponent

    ],

    imports:[
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        DataTablesModule,
        ReportsRoutingModule,
        MatIconModule,
       
    ],
})

export class ReportsModule{

}