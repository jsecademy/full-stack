import * as mongoose from 'mongoose';

(<any>mongoose).Promise = global.Promise;

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    accountNumber: {
        type: Number,
        unique: true
    },
    name: {
        first: String,
        last: String
    },
    balance: Number,
});

const schema = mongoose.model('Account', AccountSchema); // You now have access to the Accounts Collection

export { schema };