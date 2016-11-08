import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Account } from '../accounts/account.model';
import { AccountsService } from '../accounts/accounts.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'account-details',
    templateUrl: './account-details.component.html',
    styleUrls: ['./account-details.component.css', '../menu/menu.component.css'],
    providers: [AccountsService]
})
export class AccountDetailsComponent implements OnInit {
    private account: Account;
    private lastViewed: Account;
    private newAccount: Account;
    private updateAccount: Account;

    constructor(private route: ActivatedRoute, private accountsService: AccountsService, private router: Router) {}

    public ngOnInit(): void {
        const observer: Observable < Params > = this.route.params;
        observer.subscribe((param) => {
            if (param['id'] && this.router.url.indexOf('/update-account') < 0) {
                // Read Account
                this.accountsService
                    .getAccounts()
                    .then((accounts) => {
                        this.account = accounts.find((account) => {
                            return param['id'] === account._id
                        });
                        this.accountsService.setLastViewed(this.account.accountNumber);
                    });
            }
            if (this.router.url === '/last-viewed') {
                // Get the last viewed item
                this.accountsService
                    .getLastViewed()
                    .then((account) => {
                        if (account) {
                            this.lastViewed = account;
                        } else {
                            // Not found
                            this.router.navigate(['/accounts']);
                        }
                    });
            }
            if (this.router.url === '/create-account') {
                // Create new account
                this.newAccount = new Account();
            }
            if (this.router.url.indexOf('/update-account') > -1 && param['id']) {
                // Update account
                this.accountsService
                    .getAccounts()
                    .then((accounts) => {
                        this.updateAccount = accounts.find((account) => {
                            return param['id'] === account._id
                        });
                    });
            }
        });
    }

    private onSubmit(): void {
        this.accountsService
            .createAccount(this.newAccount)
            .then((account) => {
                this.router.navigate(['/accounts']);
            });
    }

    private onUpdate(): void {
        this.accountsService
            .updateAccount(this.updateAccount)
            .then((account) => {
                this.router.navigate(['/accounts']);
            });
    }
}