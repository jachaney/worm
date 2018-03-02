import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';
import { message } from 'antd';

if (Meteor.isServer) {
  Meteor.methods({

    'userprofile.update'(userKey,firstName,lastName,email,phone,
      address,division,notes,isAdmin,personnelId) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      Meteor.users.update({"profile.userKey": userKey},
        {$set: {
          profile: {
            firstName,
            lastName,
            email,
            phone,
            address,
            division,
            notes,
            isAdmin,
            userKey,
            orgKey: Meteor.user().profile.orgKey,
            personnelId
            }
          }
        },{upsert: true}
      );
    },

  })

}
