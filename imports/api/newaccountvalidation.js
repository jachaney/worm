import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';

Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;
  try {
    new SimpleSchema({
      email: {
        min: 1,
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
    }).validate({email});
  } catch (e) {
    message.error(e.reason);
    throw new Meteor.Error(400, e.message);
  }
      return true;
});
