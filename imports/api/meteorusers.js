import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';
import { message } from 'antd';

if (Meteor.isServer) {
  Meteor.publish('ThisUser', function() {
    return Meteor.users.find({_id: this.userId});
  })
}

if (Meteor.isServer) {
  Meteor.methods({

    'userprofile.update'(userKey,firstName,lastName,email,phone,
      address,division,position,notes,isAdmin,personnelId) {
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
            position,
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
