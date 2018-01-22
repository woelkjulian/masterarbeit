import { TanTransportTypes } from './tanTransportTypes';

export interface BankAccess {
    bankCode: string;
    bankLogin: string;
    bankLogin2: string;
    bankName: string;
    pin: string;
    tanTransportTypes?: (TanTransportTypes)[] | null;
  }
  