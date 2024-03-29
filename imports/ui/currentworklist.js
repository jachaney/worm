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

  render() {
    return this.props.workOrders.map((workOrder) => {
      let clockedIn = workOrder.clockedIn;
      let id = this.props.clockedInOrderId;
      let key = workOrder.workOrderKey;
      let onBreak = workOrder.onBreak;
      let isComplete = workOrder.isComplete;
      return <div
        className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5"
        key={workOrder._id}
      >
        <Card
          id="currentWorkListCard"
          hoverable
          className="currentWorkListCard"
          actions={[
            <Icon
              id={workOrder.workOrderKey}
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
                      color: Meteor.user().profile.isAdmin ? null : "#d3d3d3"
                    }}
                    onClick={() => {
                      this.props.showAssignOrderModal(key);
                    }}
                  >
                    <Icon
                      type="solution"
                    />
                    &nbsp;Assign Work Order
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    disabled={Meteor.user().profile.isAdmin ? false : true}
                    style={{
                      color: Meteor.user().profile.isAdmin ? null : "#d3d3d3"
                    }}
                    onClick={() => {
                      this.props.onEditWorkOrder(key);
                    }}
                  >
                    <Icon
                      type="edit"
                    />
                    &nbsp;Edit Work Order
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    disabled={Meteor.user().profile.isAdmin ? false : true}
                    style={{
                      color: Meteor.user().profile.isAdmin ? "red" : "#d3d3d3"
                    }}
                    onClick={(e) => {
                      confirm({
                        title: "Are you sure you want to delete this order?",
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk() {
                          let workOrderKey = workOrder.workOrderKey;
                          Meteor.call('delete.workorder', workOrderKey);
                          Meteor.call('delete.workorderitems', workOrderKey);
                          Meteor.call('materials.bulkremove',workOrderKey);
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
          <h2>{workOrder.title}</h2>
          <p>Work Order ID: {workOrder._id}</p>
          <a
            href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(workOrder.location)}
            target="_blank"
          >
            {workOrder.location}
          </a>
          <p/>
          <p>Due Date: {moment(workOrder.dueDate).format('MMM Do YYYY')}</p>
          {workOrder.isComplete === false ?
          <p>Start Time: {moment(workOrder.dueDate).format("h:mm a")}</p>
          :
          <p>Completed On: {moment(workOrder.completedOn).format("MMM Do YYYY h:mm a")}</p>
          }
          {workOrder.assignedTech === "0" ?
            <p>Assigned To: Unassigned</p>
          :
            <p>Assigned To: {workOrder.assignedTech}</p>
          }
          {isComplete === true ?
            <span>Status:<h3 style={{color: "green"}}>Complete</h3></span>
            : null
          }
          {clockedIn && id === key && !onBreak && isComplete === false ?
              <span>Status:<h3 style={{color: "green"}}>Clocked In</h3></span>
            : null
          }
          {clockedIn && id === key && onBreak && isComplete === false ?
              <span>Status:<h3 style={{color: "orange"}}>On Break</h3></span>
          : null
          }
          {clockedIn && id === key || isComplete === true ? null :
              <span>Status:<h3 style={{color: "red"}}>Clocked Out</h3></span>
          }
        </Card>
      </div>
    })
  }
}
