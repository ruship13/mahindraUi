export class DashboardDetailsModel{
    wmsDashboardId!:number;
    infeedCount!:number;
    outfeedCount!:number;
    alarmCount!:number;
    bevEmptyPalletCount!:number;
    s230EmptyPalletCount!:number;
    currentStock!:number;
    expired!:number;
    withinFiveDays!:number;
    withinOneMonth!:number;
    cdateime!:string;



    dashboardId!:number;
    totalAlarmCount!:number;
    bevInfeedCount!:number;
    s230InfeedCount!:number;
    bevOutfeedCount!:number;
    s230OutfeedCount!:number;
    totalCurrentStockCount!:number;
   
    currentokMaterialCount!:number;
    currentNokMaterialCount!:number;
    totalOKCount!:number;
    OkBEVMaterialCurrentStockDetails!:number;
    NOkBEVMaterialCurrentStockDetails!:number;
    OkS230MaterialCurrentStockDetails!:number;
    NOkS230MaterialCurrentStockDetails!:number;
    totalNOKCount!:number;
    totalOrders!:number;
    executedOrders!:number;
    remainingOrders!:number;
    percentageOrders!:string;
    totalOutfeedCount!:number;
    totalInfeedCount!:number;
    totalOKBEVCount!:number;
    totalNOKBEVCount!:number;
    totalS230OKCount!:number;
    totalS230NOKCount!:number;
    bevCurrentStockCount!:number;
    s230CurrentStockCount!:number;
    bevBufferCount!:number;
    s230BufferCount!:number;
    area1Count!:number;
    area2Count!:number;
   
}