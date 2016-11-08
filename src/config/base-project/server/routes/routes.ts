import * as express from 'express';
import { Accounts } from '../controllers/accounts';

const router = express.Router();
Accounts.initData();

router.get('/last-viewed', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({
        account: req.session['account']
    });
});

router.post('/account', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const account = req.body;
    if (account.hasOwnProperty('account-number') && account.hasOwnProperty('first-name') && account.hasOwnProperty('last-name') && account.hasOwnProperty('balance')) {
        Accounts.createAccount(account)
            .then((account) => {
                res.json(account);
            }).catch((error) => {
                res.sendStatus(500); // Error creating account
            });
    } else {
        res.sendStatus(404); // Invalid Parameters Number
    }
});

router
    .use('/account/:accountNumber', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Verify Account Number is valid
        Accounts.validAccountNumber(req.params.accountNumber)
            .then((account) => {
                req['account'] = account; // Valid Account Number
                next();
            })
            .catch((err) => {
                // Account Number not Found
                res.sendStatus(404); // Invalid Account Number
            });
    })
    .route('/account/:accountNumber')
    .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Read Account
        req.session['account'] = req['account'];
        res.json(req.session['account']);
    })
    .put((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Update Account
        if (req.body['balance']) {
            req['account'].balance = req.body['balance'];
        }
        if (req.body['first-name']) {
            req['account'].name.first = req.body['first-name'];
        }
        if (req.body['last-name']) {
            req['account'].name.last = req.body['last-name'];
        }
        req['account'].save((err) => {
            if (err) {
                res.sendStatus(500); // Error updating account
            } else {
                res.json(req['account']);
            }
        });
    })
    .delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Delete Account
        req['account'].remove((err) => {
            if (err) {
                res.sendStatus(500); // Error removing account
            } else {
                res.json(req['account']);
            }
        });
    });

router.get('/accounts', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Accounts.getAccounts().then((accounts) => {
        res.json({
            recent: req['account'],
            accounts: accounts
        });
    }).catch((error) => {
        let err: any = new Error('Not Found');
        err.status = 404;
        next(err);
    });
});

export = router;