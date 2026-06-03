import { NgModule } from "@angular/core";
import { MasterUserDetailsComponent } from "./master-user-details/master-user-details.component";
import { MasterRoutingModule } from "./master-routing.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DataTablesModule } from "angular-datatables";

import { MasterReasonDetailsComponent } from './master-reason-details/master-reason-details.component';
import { MasterProductVariantDetailsComponent } from "./master-product-variant-details/master-product-variant-details.component";
import { MasterProductDetailsComponent } from './master-product-details/master-product-details.component';
import { MasterAgingDaysDetailsComponent } from "./master-aging-days-details/master-aging-days-details.component";
import { NgxPaginationModule } from "ngx-pagination";
import { MatPaginatorModule } from "@angular/material/paginator";



@NgModule({
    declarations:[
        MasterUserDetailsComponent,
        MasterProductVariantDetailsComponent,
        MasterReasonDetailsComponent,
        MasterProductDetailsComponent,
        MasterAgingDaysDetailsComponent
    ],

    imports:[
        MasterRoutingModule,
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        DataTablesModule,
        MatPaginatorModule,
    ],

    exports: [],
   
    providers: []
})

export class MasterModule{

}