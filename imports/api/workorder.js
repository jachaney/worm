import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const WorkOrders = new Mongo.Collection('workorders');

if (Meteor.isServer) {
  Meteor.publish('WorkOrders', function() {
    return WorkOrders.find({userKey: Meteor.user().profile.userKey});
  })
}
Meteor.methods({
  'new.workorder'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.insert({
      _id,
      assignedTech: '',
      clockedIn: false,
      createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
      customerName: '',
      dueDate: '',
      frequency: '',
      location: '',
      onBreak: false,
      priority: '',
      title: '',
      userKey: Meteor.user().profile.userKey,
      workOrderKey: Random.id(),
      orgKey: Meteor.user().profile.orgKey
    })
  },
  'delete.workorder' (workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.remove({
      workOrderKey: workOrderKey,
    });
  },
  'save.workorder' (_id,title,location,frequency,dueDate,startTime,customerName,assignedTech,priority,workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    try {
      new SimpleSchema({
        title: {
          min: 1,
          type: String
        },
        location: {
          min: 1,
          type: String
        },
        dueDate: {
          min: 1,
          type: String
        },
        startTime: {
          min: 1,
          type: String
        },
        frequency: {
          min: 1,
          type: String
        },
        priority: {
          min: 1,
          type: String
        },
        assignedTech: {
          min: 1,
          type: String
        }
      }).validate({title,location,frequency,dueDate,startTime,priority,assignedTech});
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
    WorkOrders.update({_id},
      {$set: {
        title: title,
        location: location,
        frequency: frequency,
        dueDate: dueDate + " " + startTime,
        customerName: customerName,
        assignedTech: assignedTech,
        priority: priority,
      }},{upsert: true});
  },
  'workorder.clockin' (workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.update({workOrderKey: workOrderKey},
    {$set: {
      clockedIn: true
    }},{upsert: true})
  },
  'workorder.clockout' (workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.update({workOrderKey: workOrderKey},
    {$set: {
      clockedIn: false,
      onBreak: false
    }},{upsert: true})
  },
  'workorder.breakin' (workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.update({workOrderKey: workOrderKey},
    {$set: {
      onBreak: true
    }},{upsert: true})
  },
  'workorder.breakout' (workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrders.update({workOrderKey: workOrderKey},
    {$set: {
      onBreak: false
    }},{upsert: true})
  },
})
