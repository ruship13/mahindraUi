import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MonitorComponent } from "./monitor.component";



import { CurrentStockDetailsComponent } from "./current-stock-details/current-stock-details.component";
import { LayoutComponent } from "./layout/layout.component";
import { StackerLiveFaultsComponent } from "./stacker-live-faults/stacker-live-faults.component";
import { CurrentMissionsComponent } from "./current-missions/current-missions.component";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "src/app/utils/role.enum";
import { EquipmentSensorDetailsComponent } from "./equipment-sensor-details/equipment-sensor-details.component";
import { YokogawaTempratureDetailsComponent } from "./yokogawa-temprature-details/yokogawa-temprature-details.component";
import { MockdrillMissionDetailsComponent } from "./mockdrill-mission-details/mockdrill-mission-details.component";







const routes: Routes = [
    {
        path: '',
        component: MonitorComponent,
        children: [

            {
                path: 'stacker-live-faults',

                component: StackerLiveFaultsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Stacker Live Faults'
                },
            },



            {
                path: 'layout',

                component: LayoutComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: '2d Layout'
                },
            },
            {
                path: 'current-stock-details',

                component: CurrentStockDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Currrent Stock Details'
                },
            },
            {
                path: 'current-missions',

                component: CurrentMissionsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Current Mission'
                },

            },

            {
                path: 'equipment-sensor-details',

                component: EquipmentSensorDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Equipment Sensor Details'
                },

            },

            {
                path: 'yokogawa-temprature-details',

                component: YokogawaTempratureDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Yokogawa Alarm Details'
                },

            },

            {
                path: 'mockdrill-mission-details',

                component: MockdrillMissionDetailsComponent,

                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Mock Drill Test details'
                },

            },


        ],
    },


    { path: '', redirectTo: 'current-stock-details', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MonitorRoutingModule {

}
