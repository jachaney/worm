import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const ContactItems = new Mongo.Collection('contactitems');

if (Meteor.isServer) {
  Meteor.publish('ContactItems', function() {
    return ContactItems.find({userKey: Meteor.user().profile.userKey});
  })
  Meteor.methods({
    'new.contactitem'(contactKey,content,type,contactItemPairKey) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      ContactItems.insert({
        createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
        userKey: Meteor.user().profile.userKey,
        contactKey: contactKey,
        orgKey: Meteor.user().profile.orgKey,
        content: content,
        type: type,
        contactItemPairKey: contactItemPairKey
      })
    },
    'contactitems.remove'(contactKey) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      ContactItems.remove({contactKey: contactKey});
    },
    'contactitem.delete'(contactItemPairKey) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      ContactItems.remove({contactItemPairKey: contactItemPairKey});
    },
    'contactitem.update'(_id,content) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      ContactItems.update({_id: _id},
        {$set:{
          content: content
        }
      },{upsert:true});
    },
  })
}
