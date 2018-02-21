import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Checkbox,Input,Select,Menu,Button,Icon,Divider } from 'antd';

import { Contacts } from './../api/contacts';
import { ContactItems } from './../api/contactitems';

const Option = Select.Option;
const { TextArea } = Input;

export default class NewContact extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      contactItems: [],
      contactIsNew: true,
      contactKey: '',
      thisContact: [],
    }
  };

  componentDidMount() {
    let _id = Random.id();
    let contactKey = Random.id();
    Meteor.call('new.contact',_id,contactKey);
    this.setState({_id: _id});
    this.setState({contactKey: contactKey});
    this.newContactTracker = Tracker.autorun(() => {
      let ContactReady = Meteor.subscribe('Contacts');
      const thisContact = Contacts.find({_id: _id}).fetch();
      this.setState({thisContact});
      let contactItemsReady = Meteor.subscribe('ContactItems');
      const contactItems = ContactItems.find({contactKey: this.state.contactKey},{sort:{createdOn: 1}}).fetch();
      this.setState({contactItems});
      if (this.state.contactIsNew === true) {
        Meteor.call('new.contactitem',contactKey,content="First Name:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Last Name:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Address:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="City:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="State:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Zip Code:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Country:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Primary Phone Number:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="E-mail:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Company:",type="defaultHeader");
        Meteor.call('new.contactitem',contactKey,content="",type="");
        Meteor.call('new.contactitem',contactKey,content="Notes:",type="note");
        this.setState({contactIsNew: false});
      }
    })
  }

  componentWillUnmount() {
    this.newContactTracker.stop();
  }

  renderDefaultContactItems() {
    return this.state.contactItems.map((item) => {
      if (item.type === "defaultHeader") {
        return <div
          className="contactsDivItems"
          key={item._id}
        >
          <span>{item.content}</span>
        </div>
      } else if (item.type === "") {
        return <div
          className="contactsDivItems"
          key={item._id}
        >
          <Input
            id={item._id}
          />
        </div>
      }
    })
  }

  renderCustomContactItems() {
    return this.state.contactItems.map((item) => {
      if (item.type === "custom" || item.type === "customHeader") {
        return <div
          className="contactsDivItems"
          key={item._id}
        >
          {item.type === "customHeader" ? <div
              className="pure-u-1-24"
            >
              <Icon
                className="contactItemDelete"
                onClick={(e) => {
                  let contactItemPairKey = item.contactItemPairKey;
                  Meteor.call('contactitem.delete',contactItemPairKey);
                }}
                title="Delete Custom Field"
                type="delete"
              />
            </div>
          : null}
          <div
            className={item.type === "customHeader" ?
              "pure-u-23-24" : "pure-u-1"
            }
          >
            <Input
              id={item._id}
              placeholder={item.type === "customHeader" ?
                "Enter Custom Field Name Here..."
                : null}
            />
          </div>
        </div>
      }
    })
  }

  renderNotes() {
    return this.state.contactItems.map((item) => {
      if (item.type === "note") {
        return <div
          className="contactsDivItems"
          key={item._id}
        >
          <TextArea
            id={item._id}
          />
        </div>
      }
    })
  }

  render() {
    return (
      <div
        className="pure-u-1 contactsDiv"
      >
        <div><h2>New Contact</h2></div>
        {this.renderDefaultContactItems()}
        {this.renderCustomContactItems()}
        <div
          className="contactsDivButton"
        >
          <Button
            className="contactsButton"
            onClick={() => {
              let contactItemPairKey = Random.id();
              let contactKey = this.state.contactKey;
              let content = "";
              Meteor.call('new.contactitem',contactKey,content,type="customHeader",
                contactItemPairKey);
              Meteor.call('new.contactitem',contactKey,content,type="custom",
                contactItemPairKey);
            }}
          >
            Add Custom Field
          </Button>
        </div>
        <Divider>
          <h3>Notes:</h3>
        </Divider>
          {this.renderNotes()}
        <div
          className="pure-u-1 contactsDivButton"
        >
          <Button
            className="contactsButton"
            onClick={() => {
              let input = $("Input");
              let firstName = input[0].value.trim();
              let lastName = input[1].value.trim();
              let partialAddress = input[2].value.trim();
              let zip = input[3].value.trim();
              let city = input[4].value.trim();
              let state = input[5].value.trim();
              let country = input[6].value.trim();
              let primePhone = input[7].value.trim();
              let email = input[8].value.trim();
              let company = input[9].value.trim();
              let address = partialAddress + ", " + city + ", " + state + " " + zip + " " + country;
              $("Input").each(function(index, e) {
                let content = $(e).val();
                let _id = this.id;
                Meteor.call('contactitem.update',_id,content);
              })
              $("TextArea").each(function(index, e) {
                let content = $(e).val();
                let _id = this.id;
                Meteor.call('contactitem.update',_id,content);
              })
              let _id = this.state._id;
              Meteor.call('contact.update',_id,firstName,lastName,address,primePhone,email,company);
              this.props.onClose();
            }}
            type="primary"
          >Save</Button>
          <Button
            className="contactsButton"
            onClick={() => {
              let contactKey = this.state.contactKey;
              Meteor.call('contact.remove',contactKey);
              Meteor.call('contactitems.remove',contactKey);
              this.props.onClose();
            }}
            type="danger"
          >Cancel</Button>
        </div>
      </div>
    )
  }
}
