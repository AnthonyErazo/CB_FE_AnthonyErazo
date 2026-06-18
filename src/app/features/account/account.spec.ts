import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { AccountView } from './account';
import { AccountsService, TransactionsService } from '../../api';

/**
 * Regression tests for the zoneless change-detection flow: querying an account
 * and registering a movement both update signals, and the view must re-render.
 * Without provideZonelessChangeDetection the view never updated.
 */
describe('AccountView', () => {
  function setup(accountsApi: unknown, transactionsApi: unknown) {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountsService, useValue: accountsApi },
        { provide: TransactionsService, useValue: transactionsApi },
      ],
    });
    const fixture = TestBed.createComponent(AccountView);
    fixture.autoDetectChanges();
    return fixture;
  }

  it('renders the balance after a query (view updates on signal change)', async () => {
    const accountsApi = {
      getById: () => of({ id: 1, accountNumber: '0001-2345-6789', balance: 1000 }),
    };
    const fixture = setup(accountsApi, { register: () => of({}) });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).not.toContain('Saldo');

    const cmp = fixture.componentInstance as unknown as {
      accountId: number | null;
      consultAccount: () => void;
    };
    cmp.accountId = 1;
    cmp.consultAccount();
    await fixture.whenStable();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('0001-2345-6789');
    expect(text).toContain('Saldo: S/ 1000.00');
    expect(fixture.nativeElement.querySelector('form.movement')).not.toBeNull();
  });

  it('updates the balance after registering a movement (re-fetch)', async () => {
    let calls = 0;
    const accountsApi = {
      // First load shows 1000; the reload after the deposit shows 1050.
      getById: () => of({ id: 1, accountNumber: '0001-2345-6789', balance: calls++ === 0 ? 1000 : 1050 }),
    };
    const transactionsApi = {
      register: () => of({ id: 9, type: 'DEPOSIT', amount: 50, createdAt: '2024-01-01T00:00:00Z', accountId: 1 }),
    };
    const fixture = setup(accountsApi, transactionsApi);

    const cmp = fixture.componentInstance as unknown as {
      accountId: number | null;
      amount: number | null;
      consultAccount: () => void;
      registerTransaction: () => void;
    };
    cmp.accountId = 1;
    cmp.consultAccount();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Saldo: S/ 1000.00');

    cmp.amount = 50;
    cmp.registerTransaction();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Saldo: S/ 1050.00');
  });
});
