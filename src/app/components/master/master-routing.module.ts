import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MasterUserDetailsComponent } from "./master-user-details/master-user-details.component";

import { MasterReasonDetailsComponent } from "./master-reason-details/master-reason-details.component";
import { MasterProductVariantDetailsComponent } from "./master-product-variant-details/master-product-variant-details.component";
import { MasterProductDetailsComponent } from "./master-product-details/master-product-details.component";
import { MasterAgingDaysDetailsComponent } from "./master-aging-days-details/master-aging-days-details.component";
import { Role } from "src/app/utils/role.enum";
import { AuthGuard } from "../auth/auth.guard";




const routes: Routes = [
    {
        path: 'mst-user-details',
        component: MasterUserDetailsComponent,

        canActivate: [AuthGuard],

        data: {
            roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
            accessField: 'Master User'
        },
    },
    {
        path: 'mst-product-details',
        component: MasterProductVariantDetailsComponent,
        canActivate: [AuthGuard],

        data: {
            roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
            accessField: 'Master Part Details'
        },
    },
    {
        path: 'mst-reason-details',
        component: MasterReasonDetailsComponent,

        canActivate: [AuthGuard],

        data: {
            roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
            accessField: 'Master Reason'
        },
    },
    {
        path: 'master-product-details',
        component: MasterProductDetailsComponent,

        canActivate: [AuthGuard],

        data: {
            roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
            accessField: 'Master Model Details'
        },
    },
    {
        path: 'master-aging-days-details',
        component: MasterAgingDaysDetailsComponent,

        canActivate: [AuthGuard],

        data: {
            roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
            accessField: 'Master Ageing Days'
        },
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class MasterRoutingModule {

}