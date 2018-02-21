import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const Time = new Mongo.Collection('time');

if (Meteor.isServer) {
  Meteor.publish('Time', function() {
    return Time.find({userKey: Meteor.user().profile.userKey});
  })
}

Meteor.methods({
  'time.clockin'(workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.insert({
      createdOn: new Date(),
      clockIn: new Date(),
      isBreak: false,
      userKey: Meteor.user().profile.userKey,
      workOrderKey: workOrderKey,
      orgKey: Meteor.user().profile.orgKey
    })
  },
  'time.clockout'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.update({_id},
      {$set: {
        clockOut: new Date()
      }},{upsert: true})
  },
  'time.breakin'(workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.insert({
      createdOn: new Date(),
      clockIn: new Date(),
      isBreak: true,
      userKey: Meteor.user().profile.userKey,
      workOrderKey: workOrderKey,
      orgKey: Meteor.user().profile.orgKey
    })
  },
  'time.breakout'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.update({_id},
      {$set: {
        clockOut: new Date()
      }},{upsert: true})
  },
  'time.delete'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.remove({_id: _id});
  },
  'time.update'(_id,newClockIn,newClockOut) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Time.update({_id: _id},
      {$set: {
          clockIn: newClockIn,
          clockOut: newClockOut
        }
      },{upsert:true})
  }
})
