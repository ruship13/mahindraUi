export class MasterPalletInformationModel{
    palletInformationId!:number;
    palletCode!:string;
    quantity!:Float32Array;
    palletStatusId!:number;
    palletStatusName!:string;
    isInfeedMissionGenerated!:number;
    isOutfeedMissionGenerated!:number;
    isTransferManagementMissionGenerated!:number;
    cdatetime!:string;
    palletInformationIsDeleted!:number;
}