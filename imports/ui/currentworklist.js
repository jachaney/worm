import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { DatePicker, Menu, Icon, Card, Dropdown, Modal} from 'antd';


const { Meta } = Card;
const confirm = Modal.confirm;

export default class CurrentWorkList extends React.Component{

  onCardClick(e) {
    this.props.onOrderClick(e.target.id);
  }

  renderStatus() {
    return this.props.workorders.map((workOrder) => {
      if (clockedIn === true && id === key && onBreak === false) {
        <p>Status: Clocked In</p>
      }
      if (clockedIn === true && id === key && onBreak === true) {
        <p>Status: On Break</p>
      }
      if (clockedIn === false) {
        <p>Status: Clocked Out</p>
      }
    })
  }

  render() {
    return this.props.workorders.map((workorder) => {
      let clockedIn = this.props.clockedIn;
      let id = this.props.clockedInOrderId;
      let key = workorder.workOrderKey;
      let onBreak = this.props.onBreak;
      return <div
        className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5"
        key={workorder._id}
      >
        <Card
          id="currentWorkListCard"
          hoverable
          className="currentWorkListCard"
          actions={[
            <Icon
              id={workorder.workOrderKey}
              type="select"
              onClick={this.onCardClick.bind(this)}
            >Open</Icon>,
            <Dropdown
              overlay={<Menu
              >
                <Menu.Item>
                  <a
                    style={{
                      color: "red"
                    }}
                    onClick={(e) => {
                      confirm({
                        title: "Are you sure you want to delete this order?",
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk() {
                          let workOrderKey = workorder.workOrderKey;
                          Meteor.call('delete.workorder', workOrderKey);
                          Meteor.call('delete.workorderitems', workOrderKey);
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
                    &nbsp;Delete Order
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
          <h2>{workorder.title}</h2>
          <p>Work Order ID: {workorder._id}</p>
          <p>{workorder.location}</p>
          <p>Due Date: {moment(workorder.dueDate).format('MMM Do YYYY')}</p>
          <p>Start Time: {moment(workorder.dueDate).format("h:mm a")}</p>
          {clockedIn && id === key && !onBreak ?
              <span>Status:<h3 style={{color: "green"}}>Clocked In</h3></span>
            : null
          }
          {clockedIn && id === key && onBreak ?
              <span>Status:<h3 style={{color: "orange"}}>On Break</h3></span>
          : null
          }
          {clockedIn && id === key ? null :
              <span>Status:<h3 style={{color: "red"}}>Clocked Out</h3></span>
          }
        </Card>
      </div>
    })
  }

}
