export class OutfeedMissionRuntimeDetailsModel {
	outfeedMissionId !:number;
	palletInformationId !:number;
	palletCode!:string;
	quantity !:number;
	floorId!:number;
	floorName!:string;
	areaId!:number;
	areaName!:string;
	rackId!:number;
	rackName!:string;
	rackSide!:string;
	positionId!:number;
	positionName!:string
	positionNumberInRack!:number;
	createdDatetime!:string;
	outfeedMissionStartDateTime!:string;
	outfeedMissionEndDateTime!:string;
	outfeedMissionStatus!:string;
	outfeedMissionIsDeleted !:number;
	shiftId!:number; 
	shiftName!:string;
	palletStatusId !:number;
	palletStatusName !:string;
	filledPercentage !:number;
	productVariantName!:string;
	productVariantCode!:string;
	productName!:string;
	serialNumber!:string;
	mfgDate!:string;
	mfgShift!:string;
	loadDateTime!:string;
	dispatchOrderNumber!:string;
}