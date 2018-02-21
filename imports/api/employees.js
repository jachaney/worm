import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const Employees = new Mongo.Collection('employees');

if (Meteor.isServer) {
  Meteor.publish('Employees', function() {
    return Employees.find({userKey: Meteor.user().profile.userKey});
  })
}

Meteor.methods({
  'employee.clockin'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Meteor.users.update({_id},
      {$set:{
          isClockedIn: true
        }
      },{upsert:true})
  },
  'employee.clockout'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Meteor.users.update({_id},
      {$set:{
          isClockedIn: false,
          onBreak: false
        }
      },{upsert:true})
  },
  'employee.onBreak'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Meteor.users.update({_id},
      {$set:{
          onBreak: true
        }
      },{upsert:true})
  },
  'employee.lunchout'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Meteor.users.update({_id},
      {$set:{
          onBreak: false
        }
      },{upsert:true})
  },
})
