import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Account } from './account.model';

@Injectable()
export class AccountsService {
    constructor(private http: Http) {}

    public getAccounts(): Promise < Account[] > {
        return this.http.get('/api/accounts')
            .toPromise()
            .then(response => response.json().accounts as Account[])
            .catch(this.handleError);
    }

    public setLastViewed(accountNumber: Number) {
        this.http.get(`/api/account/${accountNumber}`)
            .toPromise()
            .then(response => response.json().account as Account)
            .catch(this.handleError);
    }

    public getLastViewed(): Promise < Account > {
        return this.http.get('/api/last-viewed')
            .toPromise()
            .then(response => response.json().account as Account)
            .catch(this.handleError);
    }

    public deleteAccount(accountNumber: Number): Promise < Account > {
        return this.http.delete(`/api/account/${accountNumber}`)
            .toPromise()
            .then(response => response.json().account as Account)
            .catch(this.handleError);
    }

    public createAccount(account: Account): Promise < Account > {
        return this.http.post('/api/account', {
                'account-number': account.accountNumber,
                'first-name': account.name.first,
                'last-name': account.name.last,
                'balance': account.balance
            }).toPromise()
            .then(response => response.json().account as Account)
            .catch(this.handleError);
    }

    public updateAccount(account: Account): Promise < Account > {
        return this.http.put(`/api/account/${account.accountNumber}`, {
                'account-number': account.accountNumber,
                'first-name': account.name.first,
                'last-name': account.name.last,
                'balance': account.balance
            }).toPromise()
            .then(response => response.json().account as Account)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise < any > {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}