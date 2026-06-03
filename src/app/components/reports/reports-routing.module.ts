import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";


import { AlarmHistoryReportComponent } from "./alarm-history-report/alarm-history-report.component";
import { AuditTrailReportComponent } from "./audit-trail-report/audit-trail-report.component";
import { InfeedMissionRuntimeDetailsComponent } from "./infeed-mission-runtime-details/infeed-mission-runtime-details.component";
import { OutfeedMissionRuntimeDetailsComponent } from "./outfeed-mission-runtime-details/outfeed-mission-runtime-details.component";

import { TransferpalletMissionRuntimeDetailsComponent } from "./transferpallet-mission-runtime-details/transferpallet-mission-runtime-details.component";
import { InventorysummaryReportComponent } from "./inventory-Summary-Report/inventory-summary-report.component";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "src/app/utils/role.enum";
import { LockUnlockCellDetailsComponent } from "./lock-unlock-cell-details/lock-unlock-cell-details.component";
import { TemperatureMissionRuntimeDetailsComponent } from "./temperature-mission-runtime-details/temperature-mission-runtime-details.component";

const routes: Routes = [
 
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'alarm-history-report',
                component: AlarmHistoryReportComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Alarm History Repor' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'audit-trail-report',
                component: AuditTrailReportComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Audit trail Report' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'inventory-summary-report',
                component: InventorysummaryReportComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Inventory Summary dashboard Report' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'transferpallet-mission-runtime-details',
                component: TransferpalletMissionRuntimeDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Transfer Pallet Mission Runtime Details Report' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'infeedMission-report',
                component: InfeedMissionRuntimeDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Put Away Report' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'outfeedMission-report',
                component: OutfeedMissionRuntimeDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Picklist Report' 
                },
            },
        ]
    },
    
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'lock-unlock-cell-details',
                component: LockUnlockCellDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Lock Unlock Cell Details' 
                },
            },
        ]
    },
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'temperature-mission-runtime-details',
                component: TemperatureMissionRuntimeDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Temperature Mission Details' 
                },
            },
        ]
    }


]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ReportsRoutingModule {

}