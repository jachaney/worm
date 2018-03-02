import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const Contacts = new Mongo.Collection('contacts');

if (Meteor.isServer) {
  Meteor.publish('Contacts', function() {
    return Contacts.find({orgKey: Meteor.user().profile.orgKey});
  })

  Meteor.methods({
    'new.contact'(_id,contactKey) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      Contacts.insert({
        _id: _id,
        createdOn: moment().format('YYYY-MM-DD HH:mm:ss:SSSSSS'),
        userKey: Meteor.user().profile.userKey,
        contactKey: contactKey,
        orgKey: Meteor.user().profile.orgKey
      })
    },
    'contact.remove'(contactKey) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      Contacts.remove({contactKey: contactKey});
    },
    'contact.update'(_id,firstName,lastName,address,primePhone,email,company) {
      if (!this.userId) {
        throw new Meteor.Error('Unauthorized access');
      }
      Contacts.update({_id},
        {$set: {
          firstName: firstName,
          lastName: lastName,
          address: address,
          primePhone: primePhone,
          email: email,
          company: company
          }
        },{upsert:true});
    }
  })
}
