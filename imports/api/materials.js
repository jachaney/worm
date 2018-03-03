import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';
import { message } from 'antd';

export const Materials = new Mongo.Collection('materials');

if (Meteor.isServer) {
  Meteor.publish('Materials', function() {
    return Materials.find({orgKey: Meteor.user().profile.orgKey},{sort:{createdOn: 1}});
  })
}

Meteor.methods({
  'material.new'(workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Materials.insert({
      createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
      createdBy: Meteor.user().profile.userKey,
      contents: '',
      contentKey: Random.secret(),
      qty: '',
      qtyKey: Random.secret(),
      workOrderKey,
      materialKey: Random.id(),
      userKey: Meteor.user().profile.userKey,
      orgKey: Meteor.user().profile.orgKey
    });
  },
  'materials.bulkremove'(workOrderKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Materials.remove({workOrderKey});
  },
  'material.remove'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Materials.remove({_id});
  },
  'material.updatecontents'(contentKey,contents) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Materials.update({contentKey},
    {$set: {
        contents
      }
    },{upsert: true})
  },
  'material.updateqty'(qtyKey,qty) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Materials.update({qtyKey},
    {$set: {
        qty
      }
    },{upsert: true})
  },
})
