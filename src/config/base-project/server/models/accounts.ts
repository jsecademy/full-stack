import * as root from 'app-root-path';
import { schema } from './accounts-schema';

/**
 * Accounts
 */
class AccountsModel {
    private static AccountsCollection = schema;
    public static initData(): void {
        const accounts = [{
            account: 118950,
            name: "Isabella",
            lastName: "Ramirez",
            balance: 2582.77
        }, {
            account: 13458,
            name: "Megan",
            lastName: "Miller",
            balance: 392.93
        }, {
            account: 52950,
            name: "Ferguson",
            lastName: "Jones",
            balance: 90332.24
        }];
        accounts.forEach((account) => {
            let promise = AccountsModel.AccountsCollection.findOne({
                accountNumber: account.account
            });
            promise.then((found) => {
                if (!found) {
                    let Account = new AccountsModel.AccountsCollection({
                        accountNumber: account.account,
                        name: {
                            first: account.name,
                            last: account.lastName
                        },
                        balance: account.balance
                    });
                    Account.save();
                }
            });
        });
    }

    public static getAccounts(): Promise<{ account }[]> {
        const promise = new Promise((resolve, reject) => {
            AccountsModel.AccountsCollection.find({}).exec().then((accounts) => {
                resolve(accounts);
            }).catch((err) => {
                reject(err);
            });
        });
        return promise;
    }

    public static validAccount(account: number): Promise<{}> {
        const promise = new Promise((resolve, reject) => {
            AccountsModel.AccountsCollection.findOne({ accountNumber: account })
                .exec()
                .then((account) => {
                    if (account) {
                        resolve(account);
                    } else {
                        reject();
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
        return promise;
    }

    public static createAccount(account: Object): Promise<{}> {
        const promise = new Promise((resolve, reject) => {

            let Account = new AccountsModel.AccountsCollection({
                accountNumber: account['account-number'],
                name: {
                    first: account['first-name'],
                    last: account['last-name']
                },
                balance: account['balance']
            });

            Account.save((err, account) => {
                if (err) {
                    reject();
                } else {
                    resolve(account);
                }
            });

        });
        return promise;
    }
}

export { AccountsModel };