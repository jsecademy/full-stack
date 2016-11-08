import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountsService } from './accounts.service';
import { Account } from './account.model';

@Component({
    selector: 'accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css', '../menu/menu.component.css'],
    providers: [AccountsService]
})
export class AccountsComponent {
    private accounts = [];

    constructor(private accountsService: AccountsService, private router: Router) {}

    private create() {
        this.router.navigate(['/create-account']);
    }
    private read(index) {
        let account: Account = this.accounts[index];
        this.router.navigate(['/account', account._id]);
    }
    private update(index) {
        let account: Account = this.accounts[index];
        this.router.navigate(['/update-account', account._id]);
    }
    private delete(index) {
        let account: Account = this.accounts[index];
        this.accountsService
            .deleteAccount(account.accountNumber)
            .then((removed) => {
                this.getAccounts();
            })
    }
    private getAccounts() {
        this.accountsService
            .getAccounts()
            .then((accounts) => {
                this.accounts = accounts;
            });
    }
    ngOnInit(): void {
        this.getAccounts();
    }
}