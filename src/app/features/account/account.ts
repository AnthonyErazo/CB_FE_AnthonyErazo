import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AccountResponse,
  AccountsService,
  TransactionRequest,
  TransactionRequestTypeEnum,
  TransactionsService,
} from '../../api';

/** Looks up an account and registers deposits/withdrawals via the generated API client. */
@Component({
  selector: 'app-account',
  imports: [FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountView {
  private readonly accountsApi = inject(AccountsService);
  private readonly transactionsApi = inject(TransactionsService);

  protected readonly account = signal<AccountResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected readonly TransactionType = TransactionRequestTypeEnum;

  protected accountId: number | null = null;
  protected type: TransactionRequestTypeEnum = TransactionRequestTypeEnum.Deposit;
  protected amount: number | null = null;

  protected consultAccount(): void {
    if (this.accountId === null) {
      return;
    }
    this.resetMessages();
    this.loading.set(true);
    this.accountsApi.getById(this.accountId).subscribe({
      next: (data) => {
        this.account.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.account.set(null);
        this.error.set(this.toMessage(err));
        this.loading.set(false);
      },
    });
  }

  protected registerTransaction(): void {
    const current = this.account();
    if (!current || current.id == null || this.amount === null || this.amount <= 0) {
      return;
    }
    const request: TransactionRequest = {
      accountId: current.id,
      type: this.type,
      amount: this.amount,
    };
    this.resetMessages();
    this.transactionsApi.register(request).subscribe({
      next: () => {
        this.notice.set('Movimiento registrado correctamente.');
        this.amount = null;
        this.reloadAccount(current.id!);
      },
      error: (err) => this.error.set(this.toMessage(err)),
    });
  }

  private reloadAccount(id: number): void {
    this.accountsApi.getById(id).subscribe({
      next: (data) => this.account.set(data),
      error: (err) => this.error.set(this.toMessage(err)),
    });
  }

  private resetMessages(): void {
    this.error.set(null);
    this.notice.set(null);
  }

  private toMessage(error: unknown): string {
    const apiMessage = (error as { error?: { message?: string } })?.error?.message;
    if (apiMessage) {
      return apiMessage;
    }
    return error instanceof Error ? error.message : 'Error de red o del servidor';
  }
}
