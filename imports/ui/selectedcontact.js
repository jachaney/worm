import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Input,Menu,Button,Icon,Divider } from 'antd';

import { Contacts } from './../api/contacts';
import { ContactItems } from './../api/contactitems';

const { TextArea } = Input;

export default class SelectedContact extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedContact: [],
      selectedContactItems: []
    }
  };

  componentDidMount() {
    let contactKey = this.props.selectedContactKey;
    this.selectedContactTracker = Tracker.autorun(() => {
      let selectedContactReady = Meteor.subscribe('Contacts');
      const selectedContact = Contacts.find({contactKey: contactKey}).fetch();
      this.setState ({selectedContact});
      let selectedContactItemsReady = Meteor.subscribe('ContactItems');
      const selectedContactItems = ContactItems.find({contactKey: contactKey},{sort:{createdOn: 1}}).fetch();
      this.setState ({selectedContactItems});
    })
  }

  componentWillUnmount() {
    this.selectedContactTracker.stop();
  }

  renderItems() {
    return this.state.selectedContactItems.map((item) => {
      if (item.type === "defaultHeader") {
        return <div
          key={item._id}
        >
          <p>{item.content}</p>
        </div>
      } else if (item.type != "defaultHeader" && item.type != "note") {
        return <div
          key={item._id}
        >
          <Input
            defaultValue={item.content}
          />
        </div>
      }
    })
  }

  renderNotes() {
    return this.state.selectedContactItems.map((item) => {
      if (item.type === "note") {
        return <div
          className="contactsDivItems"
          key={item._id}
        >
          <TextArea
            defaultValue={item.content}
          />
        </div>
      }
    })
  }

  render() {
    return this.state.selectedContact.map((contact) => {
      return <div
        className="pure-u-1 contactsDiv"
        key={contact._id}
      >
        <div
          className="contactsHeader"
        >
          <h1>{contact.lastName}, {contact.firstName}</h1>
        </div>
        <Divider/>
        <div
          className="contactsDivButton"
        >
          <Button
            className="contactsButton"
            onClick={(e) => {
              this.props.toDashboard();
            }}
            title="Back to the Dashboard"
          >
            <Icon type="dashboard"/>
            Dashboard
          </Button>
        </div>
        <Divider/>
        <div
          className="contactsDivItems"
        >
          {this.renderItems()}
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
            onClick={(e) => {
              this.props.toDashboard();
            }}
            title="Back to the Dashboard"
          >
            <Icon type="dashboard"/>
            Dashboard
          </Button>
          <Button
            className="contactsButton"
            onClick={() => {
              window.scrollTo(0,0);
            }}
            title="Back to the Top"
          >
            <Icon type="to-top"/>
            Back to Top
          </Button>
        </div>
      </div>
    })
  }
}
