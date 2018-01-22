import { BankAccountBalance } from './bankAccountBalance.d';

export interface BankAccount {
    accountNumber: string;
    bankAccountBalance: BankAccountBalance;
    bankName: string;
    bic: string;
    blz: string;
    country: string;
    currency: string;
    iban: string;
    name: string;
    owner: string;
    syncStatus: string;
    type: string;
  }
  