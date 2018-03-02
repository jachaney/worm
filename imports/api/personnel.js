import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';
import { message } from 'antd';

export const Personnel = new Mongo.Collection('personnel');

if (Meteor.isServer) {
  Meteor.publish('Personnel', function() {
    return Personnel.find({orgKey: Meteor.user().profile.orgKey});
  })
}

Meteor.methods({
  'personnel.confirmrecord'() {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    let recordVerified = Personnel.find({_id: this.userId}).fetch();
    if (recordVerified.length) {
      return true;
    } else {
      return false;
    }
  },
  'personnel.create'(_id,firstName,lastName,email,phone,address,
    division,position,notes,isAdmin,userKey,orgKey,personnelId) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Personnel.insert({
      _id,
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
      orgKey,
      personnelId
    })
  },
  'personnel.update'(userKey,firstName,lastName,email,phone,
    address,division,position,notes,isAdmin) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Personnel.update({userKey},
      {$set: {
        firstName,
        lastName,
        email,
        phone,
        address,
        division,
        position,
        notes,
        isAdmin
      }
    },{upsert: true})
  },
  'personnel.add' (email,password,confirmPassword,firstName,lastName,phone,
    address,division,position,notes,isAdmin) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    let userKey = Random.secret();
    let personnelId = Random.id(6);
    let complexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    SimpleSchema.setDefaultMessages({
      messages: {
        en: {
          "complexPasswordError": "Your password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.",
          "passwordMismatch": "Your passwords do not match. Please verify your password.",
        }
      }
    });
    try {
      new SimpleSchema({
        email: {
          min: 1,
          type: String,
          regEx: SimpleSchema.RegEx.EmailWithTLD
        },
        password: {
          min: 6,
          type: String,
          custom() {
            if (!complexPassword.test(password)) {
              return "complexPasswordError";
            }
            if (password !== confirmPassword) {
              return "passwordMismatch";
            }
          }
        },
        firstName: {
          min: 1,
          type: String
        },
        lastName: {
          min: 1,
          type: String
        }
      }).validate({email,password,firstName,lastName});
    } catch (e) {
      message.error(e.message, 5);
      throw new Meteor.Error(400, e.message);
    }
    Accounts.createUser({
      email,
      password,
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
    });
    Personnel.insert({
      email,
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
    });
  },
  'personnel.remove'(userKey) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    Meteor.users.remove({"profile.userKey": userKey});
    Personnel.remove({userKey});
  },
  'personnel.resetpassword'(userKey,newPassword) {
    if (!this.userId) {
      throw new Meteor.Error('Unauthorized access');
    }
    if (Meteor.isServer) {
      Accounts.setPassword({"profile.userKey": userKey},newPassword);
    }
  }
})
