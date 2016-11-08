import { AccountsModel } from '../models/accounts';
/**
 * Accounts
 */
class Accounts {
    private static AccountsModel;
    public static initData(): void {
        AccountsModel.initData();
    }
    public static getAccounts(): Promise < {} > {
        const promise = new Promise((resolve, reject) => {
            AccountsModel.getAccounts().then((data) => {
                resolve(data);
            }, (err) => {
                reject(err);
            });
        });
        return promise;
    }
    public static getAccount(accountNumber: number): Promise < { name } > {
        const promise = new Promise((resolve, reject) => {
            AccountsModel.getAccounts().then((data) => {
                const account = data.filter((item) => {
                    return item.account === accountNumber;
                });
                if (account.length !== 1) {
                    reject('Invalid Account Number');
                } else {
                    resolve(account[0]);
                }
            }, (err) => {
                reject(err);
            });
        });
        return promise;
    }

    public static validAccountNumber(accountNumber: number): Promise < {} > {
        return AccountsModel.validAccount(accountNumber);
    }

    public static createAccount(account: Object): Promise < {} > {
        // TODO: Write more validation logic here
        return AccountsModel.createAccount(account);
    }

}
export { Accounts };