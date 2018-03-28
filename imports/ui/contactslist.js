import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Menu, Icon, Card, Dropdown, Modal} from 'antd';

const { Meta } = Card;
const confirm = Modal.confirm;

export default class ContactsList extends React.Component{
  onCardClick(e) {
      this.props.onContactClick(e.target.id);
  }

  render() {
    return this.props.contacts.map((contact) => {
      let _id = contact._id;
      let contactKey = contact.contactKey;
      return <div
        className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5"
        key={_id}
      >
        <Card
          id="contactListCard"
          hoverable
          className="contactListCard"
          actions={[
            <Icon
              id={contactKey}
              type="select"
              onClick={() => {this.props.onContactClick(contactKey)}}
              // onClick={this.onCardClick.bind(this)}
            >Open</Icon>,
            <Dropdown
              overlay={<Menu
              >
                <Menu.Item>
                  <a
                    disabled={Meteor.user().profile.isAdmin ||
                      contact.userKey === Meteor.user().profile.userKey ? false
                      : true}
                    style={{
                      color: Meteor.user().profile.isAdmin ||
                        contact.userKey === Meteor.user().profile.userKey ? "red"
                        : "#d3d3d3"
                    }}
                    onClick={(e) => {
                      confirm({
                        title: "Are you sure you want to delete this contact?",
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk() {
                          Meteor.call('contact.remove', contactKey);
                          Meteor.call('contactitems.remove', contactKey);
                        },
                        onCancel() {
                          null;
                        }
                      })
                    }}
                  >
                    <Icon
                      type="delete"
                    />
                    &nbsp;Delete Contact
                  </a>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
            placement="topCenter"
            >
              <Icon
                type="ellipsis"
              >Options</Icon>
            </Dropdown>,
          ]}
        >
          <div
            className="contactListCardInfo"
          >
            <h2>{contact.lastName}, {contact.firstName}</h2>
            <p>Company: {contact.company}</p>
            <p>Address: <a
                href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(contact.address)}
                target="_blank"
              >
                {contact.address}
              </a>
            </p>
            <p>Phone: <a
                href={`tel:${contact.primePhone}`}
              >
                {contact.primePhone}
              </a>
            </p>
            <p>E-mail: <a
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </p>
          </div>
        </Card>
      </div>
    })
  }
}
