export class InfeedMissionRuntimeDetailsModel {

    infeedMissionId!: number;
    wmsTransferOrderId!: string;
    palletInformationId!: number;
    palletCode!: string;
    filledPercentage!: number;
    quantity!: number;
    productVariantName!: string;
    productVariantCode!: string;
    productName!: string;
    // equipmentId!:number;
    // equipmentName!:string;
    areaId!: number;
    areaName!: string;
    floorId!: number;
    floorName!: string;
    rackId!: number;
    rackName!: string;
    rackSide!: string;
    rackColumn!: number;
    positionId!: number;
    positionName!: string;
    positionNumberInRack!: number;
    palletStatusId!: number;
    palletStatusName!: string;
    createdDatetime!: string;
    infeedMissionStartDateTime!: string;
    infeedMissionEndDateTime!: string;
    infeedMissionStatus!: string;
    infeedMissionIsDeleted!: number;
    serialNumber!: string;
    mfgDate!: string;
    mfgShift!: string;
    loadDateTime!:string;
}