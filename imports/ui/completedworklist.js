import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { DatePicker, Menu, Icon, Card, Dropdown, Modal} from 'antd';


const { Meta } = Card;
const confirm = Modal.confirm;

export default class CompletedWorkList extends React.Component{

  onCardClick(e) {
    this.props.onOrderClick(e.target.id);
  }

  render() {
    return this.props.workOrders.map((workOrder) => {
      let key = workOrder.workOrderKey;
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
          <p>Start Time: {moment(workOrder.dueDate).format("h:mm a")}</p>
          <p>Completed On: {moment(workOrder.completedOn).format('MMM Do YYYY h:mm a')}</p>
          <p>Completed By: {workOrder.completedBy}</p>
          <span>Status:<h3 style={{color: "green"}}>Complete</h3></span>
        </Card>
      </div>
    })
  }
}
