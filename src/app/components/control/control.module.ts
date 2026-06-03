import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';



import { InternalPalletMovementComponent } from "./internal-pallet-movement/internal-pallet-movement.component";


import { ControlRoutingModule } from "./control-routing.module";

import { DataTablesModule } from "angular-datatables";

import { MatButtonModule } from "@angular/material/button";
import { ManageLocationComponent } from "./manage-location/manage-location.component";
import { ManualRetrievalOrderComponent } from './manual-retrieval-order/manual-retrieval-order.component';
import { AccessMatrixComponent } from "./access-matrix/access-matrix.component";
import { NgxPaginationModule } from "ngx-pagination";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from "@ng-select/ng-select";
import { PlcItDatamismatchDetailsComponent } from "./plc-it-datamismatch-details/plc-it-datamismatch-details.component";
import { MatButtonToggleModule } 
    from "@angular/material/button-toggle";


@NgModule({
    declarations: [

        ManageLocationComponent,
        // QrCodeGenerationComponent,
        InternalPalletMovementComponent,
        ManualRetrievalOrderComponent,
        AccessMatrixComponent,
        PlcItDatamismatchDetailsComponent
    ],
    imports: [
        ControlRoutingModule,
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        MatPaginatorModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NgSelectModule,
        
    ],
    exports: [],
    //entryComponents: [],
    providers: []

})
export class ControlModule { }