import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const WorkOrderItems = new Mongo.Collection('workorderitems');

if (Meteor.isServer) {
  Meteor.publish('WorkOrderItems', function() {
    if (Meteor.user().profile.isAdmin) {
      return WorkOrderItems.find({orgKey: Meteor.user().profile.orgKey},{sort:{createdOn: 1}});
    } else {
      return WorkOrderItems.find({userKey: Meteor.user().profile.userKey},{sort:{createdOn: 1}});
    }
  })
}
Meteor.methods({
  'new.workorderitem'(isHeading,isCheckbox,workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.insert({
      createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
      createdBy: Meteor.user().profile.userKey,
      isHeading: isHeading,
      isCheckbox: isCheckbox,
      isChecked: false,
      workOrderKey: workOrderKey,
      headingKey: Random.id(),
      checkboxKey: Random.id(),
      userKey: Meteor.user().profile.userKey,
      orgKey: Meteor.user().profile.orgKey
    })
  },
  'delete.workorderitems'(workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.remove({
      workOrderKey: workOrderKey,
    });
  },
  'delete.workorderitem'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.remove({
      _id: _id,
    });
  },
  'update.workorderitem' (_id,contents) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.update({_id},
      {$set: {
        contents: contents
      }
    },{upsert: true});
  },
  'update.checked' (_id,isChecked) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.update({_id},
      {$set: {
        isChecked: isChecked
      }
    },{upsert: true});
  },
  'duplicate.workorderitem'(isHeading,isCheckbox,workOrderKey,userKey,contents) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.insert({
      isHeading,
      isCheckbox,
      workOrderKey,
      userKey,
      contents,
      createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
      createdBy: Meteor.user().profile.userKey,
      isChecked: false,
      headingKey: Random.id(),
      checkboxKey: Random.id()
    })
  },
  'assign.workorderitems'(workOrderKey,userKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    WorkOrderItems.update({workOrderKey},
      {$set: {
        userKey
      }
    },{multi: true,upsert: true});
  },
})
