export * from './accounts.service';
import { AccountsService } from './accounts.service';
export * from './accounts.serviceInterface';
export * from './transactions.service';
import { TransactionsService } from './transactions.service';
export * from './transactions.serviceInterface';
export const APIS = [AccountsService, TransactionsService];
