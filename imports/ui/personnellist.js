import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Menu, Icon, Card, Dropdown, Modal} from 'antd';

const { Meta } = Card;
const confirm = Modal.confirm;

export default class PersonnelList extends React.Component{

  onCardClick(e) {
    this.props.onPersonnelClick(e.target.id);
  }

  render() {
    return this.props.personnel.map((person) => {
      let userKey = person.userKey;
      if (userKey != Meteor.user().profile.userKey) {
      return <div
        className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5"
        key={_id}
      >
        <Card
          id="personnelListCard"
          hoverable
          className="contactListCard"
          actions={[
            <Icon
              id={person.userKey}
              type="select"
              onClick={this.onCardClick.bind(this)}
            >Open</Icon>,
            <Dropdown
              overlay={<Menu
              >
                <Menu.Item>
                  <a
                    disabled={Meteor.user().profile.isAdmin ? false : true}
                    style={{
                      color: Meteor.user().profile.isAdmin ? "red" : "#d3d3d3"
                    }}
                    onClick={(e) => {
                      confirm({
                        title: "Are you sure you want to remove this person?",
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk() {
                          let userKey = person.userKey;
                          Meteor.call('personnel.remove', userKey);
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
                    &nbsp;Delete
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
            <h2>{person.lastName}, {person.firstName}</h2>
            <p>ID: {person.personnelId}</p>
            <p>Address: <a
                href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(person.address)}
                target="_blank"
              >
                {person.address}
              </a>
            </p>
            <span>Phone: <a
                href={`tel:${person.phone}`}
              >
                {person.phone}
              </a>
            </span>
            <span>E-mail: <a
                href={`mailto:${person.email}`}
              >
                {person.email}
              </a>
            </span>
            <p>Division: {person.division}</p>
            <p>Position: {person.position}</p>
          </div>
        </Card>
      </div>
    }
    })
  }
}
