import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ControlComponent } from "./control.component";

import { InternalPalletMovementComponent } from "./internal-pallet-movement/internal-pallet-movement.component";

import { ManageLocationComponent } from "./manage-location/manage-location.component";
import { ManualRetrievalOrderComponent } from "./manual-retrieval-order/manual-retrieval-order.component";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "src/app/utils/role.enum";
import { AccessMatrixComponent } from "./access-matrix/access-matrix.component";
import { PlcItDatamismatchDetailsComponent } from "./plc-it-datamismatch-details/plc-it-datamismatch-details.component";

const routes: Routes = [
    {
        path: '',
        component: ControlComponent,
        children: [
            {
                path: 'manage-location',
                component: ManageLocationComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Manage Location' 
                },
            },
            // {
            //     path: 'qr-code-generation',
            //     component: QrCodeGenerationComponent,
            //     canActivate: [AuthGuard],
            //     data: {
            //         roles: [Role.Admin, Role.Superwise, Role.Operator],
            //         accessField: 'QR Code Generation' 
            //     },
            // },
            {
                path: 'internal-pallet-movement',
                component: InternalPalletMovementComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Internal Pallet Movement' 
                },
            },
            {
                path: 'manual-retrieval-order',
                component: ManualRetrievalOrderComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Generate Retrival Order' 
                },
            },
            {
                path: 'access-matrix',
                component: AccessMatrixComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'Access_Matrix' 
                },
                // canActivate: [AuthGuard],
                // data: {
                //     roles: [Role.Admin],
                //     accessField: 'Access Matrix' // Ensure this matches the field name in the database
                // },
            },

            {
                path: 'plc-it-datamismatch-details',
                component: PlcItDatamismatchDetailsComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
                    accessField: 'PLC-IT Data Mismatch Details' 
                },
                // canActivate: [AuthGuard],
                // data: {
                //     roles: [Role.Admin],
                //     accessField: 'Access Matrix' // Ensure this matches the field name in the database
                // },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ControlRoutingModule { }
