export class MannualRetrivalOrderModel {

  dispatchHistoryId!: number;
  productVariantId!: number;
  dispatchOrderNumber!: string;
  productVariantCode!: string;
  productVariantName!: string;
  productName!: string;
  productId!: number;
  shiftId!: number;
  shiftName!: string
  plannedQuantity!: number;
  acutualQuantity!: number;
  balanceQuantity!: number;
  createdDatetime!: string;
  isDispatchStart!: number;
  dispatchStatus!: string;
  serialNumber!: number;
  isOrderCancelled!: number;
  isOrderDeleted!: number;
  userName!:string;
  mfgDate!:string;
  orderBatchNumber!:string;

}
