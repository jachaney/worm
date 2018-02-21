import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Checkbox,Input,Menu,Button,Icon,Divider,DatePicker,TimePicker } from 'antd';

import { Time } from './../api/time';
import { WorkOrders } from './../api/workorder';
import { WorkOrderItems } from './../api/workorderitems';

const { TextArea } = Input;
const history = createHistory();

export default class SelectedWorkOrder extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editMode: 'time',
      editTimestamp: '',
      newClockIn: '',
      newClockOut:'',
      selectedWorkOrder: [],
      tasks: [],
      times: [],
      totalTimeWorked: [],
      totalBreakTime: []
    }
  };

  componentDidMount() {
    let workOrderKey = this.props.selectedWorkOrderId;
    this.selectedOrderTracker = Tracker.autorun(() => {
      let selectedWorkOrderReady = Meteor.subscribe('WorkOrders');
      const selectedWorkOrder = WorkOrders.find({workOrderKey: this.props.selectedWorkOrderId}).fetch();
      this.setState ({selectedWorkOrder});
      let selectedWorkOrderItemsReady = Meteor.subscribe('WorkOrderItems');
      const tasks = WorkOrderItems.find({workOrderKey: this.props.selectedWorkOrderId}).fetch();
      this.setState ({tasks});
      let selectedWorkOrderTimesReady = Meteor.subscribe('Time');
      const times = Time.find({workOrderKey: this.props.selectedWorkOrderId}).fetch();
      this.setState ({times});
      const totalTimeWorked = Time.find({workOrderKey: workOrderKey, isBreak: false}).fetch();
      this.setState({totalTimeWorked});
      const totalBreakTime = Time.find({workOrderKey: workOrderKey, isBreak: true}).fetch();
      this.setState({totalBreakTime});
      let totalSecondsWorked = 0;
      let totalBreakSeconds = 0;
      this.state.totalTimeWorked.forEach((time) => {
        this.state.totalBreakTime.forEach((breakTime) => {
          let a = moment(time.clockIn);
          let b = moment(time.clockOut);
          let c = b.diff(a, 'seconds');
          let d = moment(breakTime.clockIn);
          let e = moment(breakTime.clockOut);
          let f = e.diff(d, 'seconds');
          totalSecondsWorked = totalSecondsWorked + c;
          totalBreakSeconds = totalBreakSeconds + f;
          let hoursWorked = totalSecondsWorked / 60 / 60;
          let totalWorked = (Math.round(hoursWorked * 4) / 4).toFixed(2);
          let breakHours = totalBreakSeconds / 60 / 60;
          let breakTotal = (Math.round(breakHours * 4) / 4).toFixed(2);
          let finalTotal = totalWorked - breakTotal;
          return document.getElementById('totalHours').innerHTML = `<strong>Total Working Time:&nbsp;</strong>${finalTotal}<strong>&nbsp;hours.</strong>`;
        })
      })
    })
  }

  componentWillUnmount() {
    this.selectedOrderTracker.stop();
  }

  onChecked(e) {
    let _id = e.target.value;
    let isChecked = e.target.checked;
    Meteor.call('update.checked',_id,isChecked);
  }

  onPanelChange(value, mode) {
    this.setState({editMode: mode});
  }

  onPanelOpen(open) {
    if (open) {
      this.setState({editMode: 'time'});
    }
  }

  renderTimes() {
    return this.state.times.map((time) => {
      return <div
        className="pure-u-1"
        key={time._id}
      >
        <div
          className="pure-u-sm-1 pure-u-lg-1-3"
        >
          {time.isBreak && this.state.editTimestamp != time._id ?
            <span><strong>Clocked Into Break:&nbsp;</strong>{moment(time.clockIn).format("dddd, MMMM Do YYYY, h:mm a")}</span>
          :
            null
          }
          {time.isBreak === false && this.state.editTimestamp != time._id ?
            <span><strong>Clocked In:&nbsp;</strong>{moment(time.clockIn).format("dddd, MMMM Do YYYY, h:mm a")}</span>
          :
            null
          }
          {time.isBreak && this.state.editTimestamp === time._id ?
            <span><strong>Clocked Into Break:&nbsp;</strong>
              <DatePicker
                defaultValue={moment(time.clockIn)}
                format="MM-DD-YYYY h:mm a"
                mode={this.state.editMode}
                onChange={(e) => {
                  this.setState({newClockIn: e._d});
                }}
                onOpenChange={this.onPanelOpen.bind(this)}
                onPanelChange={this.onPanelChange.bind(this)}
                showTime={{
                  defaultValue: moment(time.clockIn),
                  format: "HH:mm",
                  use12Hours: true
                }}
                style={{
                  marginBottom: "0.5rem"
                }}
              />
            </span>
          :
            null
          }
          {time.isBreak === false && this.state.editTimestamp === time._id ?
            <span><strong>Clocked In:&nbsp;</strong>
              <DatePicker
                defaultValue={moment(time.clockIn)}
                format="MM-DD-YYYY h:mm a"
                id={time.clockIn}
                mode={this.state.editMode}
                onChange={(e) => {
                  this.setState({newClockIn: e._d});
                }}
                onOpenChange={this.onPanelOpen.bind(this)}
                onPanelChange={this.onPanelChange.bind(this)}
                showTime={{
                  defaultValue: moment(time.clockIn),
                  format: "HH:mm",
                  use12Hours: true
                }}
                style={{
                  marginBottom: "0.5rem"
                }}
              />
            </span>
          :
            null
          }
        </div>
        <div
          className="pure-u-sm-1 pure-u-lg-1-3"
        >
          {time.isBreak && time.clockOut && this.state.editTimestamp != time._id ?
            <span id={time.clockOut}><strong>Clocked Out of Break:&nbsp;</strong>{moment(time.clockOut).format("dddd, MMMM Do YYYY, h:mm a")}</span>
          : null}
          {time.isBreak === false && time.clockOut && this.state.editTimestamp != time._id ?
            <span id={time.clockOut}><strong>Clocked Out:&nbsp;</strong>{moment(time.clockOut).format("dddd, MMMM Do YYYY, h:mm a")}</span>
          : null}
          {time.isBreak && time.clockOut && this.state.editTimestamp === time._id ?
            <span><strong>Clocked Out of Break:&nbsp;</strong>
              <DatePicker
                defaultValue={moment(time.clockOut)}
                format="MM-DD-YYYY h:mm a"
                id={time.clockOut}
                mode={this.state.editMode}
                onChange={(e) => {
                  this.setState({newClockOut: e._d});
                }}
                onOpenChange={this.onPanelOpen.bind(this)}
                onPanelChange={this.onPanelChange.bind(this)}
                showTime={{
                  defaultValue: moment(time.clockOut),
                  format: "HH:mm",
                  use12Hours: true
                }}
                style={{
                  marginBottom: "0.5rem"
                }}
              />
            </span>
          :
            null
          }
          {time.isBreak === false && time.clockOut && this.state.editTimestamp === time._id ?
            <span><strong>Clocked Out:&nbsp;</strong>
              <DatePicker
                defaultValue={moment(time.clockOut)}
                format="MM-DD-YYYY h:mm a"
                id={time.clockOut}
                mode={this.state.editMode}
                onChange={(e) => {
                  this.setState({newClockOut: e._d});
                }}
                onOpenChange={this.onPanelOpen.bind(this)}
                onPanelChange={this.onPanelChange.bind(this)}
                showTime={{
                  defaultValue: moment(time.clockOut),
                  format: "HH:mm",
                  use12Hours: true
                }}
                style={{
                  marginBottom: "0.5rem"
                }}
              />
            </span>
          :
            null
          }
        </div>
        <div
          className="pure-u-sm-1 pure-u-lg-1-3"
        >
          <Button
            onClick={() => {
              if (this.state.editTimestamp != time._id) {
                this.setState({editTimestamp: time._id});
                this.setState({newClockIn: time.clockIn});
                this.setState({newClockOut: time.clockOut});
              } else {
                let _id = time._id;
                let newClockIn = this.state.newClockIn;
                let newClockOut = this.state.newClockOut;
                Meteor.call('time.update',_id,newClockIn,newClockOut);
                this.setState({editTimestamp: ''});
              }
            }}
            title={this.state.editTimestamp === time._id ? "Save Changes" : "Adjust Clock-In/Clock-Out Times"}
            type={this.state.editTimestamp === time._id ? "primary" : ""}
          >
            <Icon
              type={this.state.editTimestamp === time._id ? "save" : "edit"}
            />
            {this.state.editTimestamp === time._id ? "Save Changes" : "Edit Timestamps"}
          </Button>
          {this.state.editTimestamp === time._id ?
            <Button
              title="Delete Timestamp"
              onClick={() => {
                let _id = time._id;
                Meteor.call('time.delete',_id);
                this.setState({editTimestamp: ''});
              }}
              style={{
                display:this.state.editTimestamp && !time.clockOut? "none" : ""
              }}
              type="danger"
            >
              <Icon
                type="delete"
              />
              Delete Timestamp
            </Button>
          : null}
          {this.state.editTimestamp === time._id ?
            <Button
              title="Cancel Changes"
              onClick={() => {
                this.setState({editTimestamp: ''});
              }}
              type="danger"
            >
              <Icon
                type="close-circle-o"
              />
              Cancel
            </Button>
          : null}
          {!time.clockOut && time.isBreak === false ? <Button
              onClick={(e) => {
                if (time.isBreak === false) {
                  this.props.onClockOut(time);
                } else {
                  this.props.onBreakOut(time)
                }
              }}
              disabled={this.props.onBreak ? true : false}
              style={{
                display:this.state.editTimestamp ? "none" : ""
              }}
              title="Clock Out of Task"
              type="danger"
              value={time._id}
            >
              <Icon type="clock-circle-o"/>
              Clock Out
            </Button>
          : null}
          {!time.clockOut && time.isBreak === true ? <Button
              onClick={(e) => {
                this.props.onBreakOut(time);
              }}
              disabled={time.clockOut || this.props.clockedInOrderId !== time.workOrderKey ? true : false}
              style={{
                display:this.state.editTimestamp ? "none" : ""
              }}
              title="Clock Out of Break"
              type="danger"
              value={time._id}
            >
              <Icon type="clock-circle-o"/>
              Clock Out of Break
            </Button>
          : null
          }
        </div>
      </div>
    })
  }

  renderTaskList() {
    return this.state.tasks.map((task) => {
      return <div
        className="pure-u-1"
        key={task._id}
      >
        {task.isHeading ?
          <Divider>
            <h3
              style={{
                fontWeight: "600"
              }}
            >
              {task.contents}
            </h3>
          </Divider>
        : null}
        {task.isCheckbox ?
          <div
            className="workOrderItemDiv"
            key={task._id}
          >
            <div
              className="pure-u-1-24 workOrderCheckboxDiv"
            >
              <Checkbox
                value={task._id}
                checked={task.isChecked}
                onChange={this.onChecked.bind(this)}
              />
            </div>
            <div
              className="pure-u-23-24"
            >
              <p>{task.contents}</p>
            </div>
          </div>
        : null}
      </div>
    })
  }

  renderTotalTime() {
  }

  render() {
    return this.state.selectedWorkOrder.map((workOrder) => {
      return <div
          className="pure-u-1 workOrderDiv"
          key={workOrder._id}
        >
          <div
            className="workOrderHeader"
          >
            <p>ID:&nbsp;{workOrder._id}</p>
            <h2>{workOrder.title}</h2>
            <h3>{workOrder.customerName}</h3>
            <a
              href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(workOrder.location)}
              target="_blank"
            >
              {workOrder.location}
            </a>
          </div>
          <div className="workOrderItemsDivider"/>
            <div
              className="workOrderHeaderButtons"
            >
              <Button
                title="Back to the Dashboard"
                onClick={(e) => {
                  this.props.toDashboard();
                }}
              >
                <Icon type="dashboard"/>
                Dashboard
              </Button>
              <Button
                onClick={(e) => {
                  this.props.toDashboard();
                }}
                title="Complete This Order"
                type="primary"
              >
                <Icon type="check-circle-o"/>
                Complete Order
              </Button>
            </div>
          <div className="workOrderItemsDivider"/>
          <div
            className="workOrderHeaderClock"
          >
            <Button
              onClick={(e) => {
                this.props.onClockIn(workOrder.workOrderKey);
              }}
              disabled={this.props.clockedIn || this.props.onBreak || this.props.clockedInOrderId !== workOrder.workOrderKey ? true : false}
              title={this.props.clockedIn ? "Clock Out of Task" : "Clock Into Task"}
              type={this.props.clockedIn ? "danger" : "primary"}
              value={workOrder._id}
            >
              <Icon type="clock-circle-o"/>
              {this.props.clockedIn && this.props.clockedInOrderId === workOrder.workOrderKey ? "Clock Out" : "Clock In"}
            </Button>
            <Button
              onClick={(e) => {
                this.props.onBreakIn(workOrder.workOrderKey);
              }}
              disabled={this.props.clockedIn && this.props.onBreak === false && this.props.clockedInOrderId === workOrder.workOrderKey ? false : true}
              title={this.props.onBreak ? "Clock Out of Break" : "Clock Into Break"}
              type={this.props.onBreak ? "danger" : "primary"}
              value={workOrder._id}
            >
              <Icon type="coffee"/>
              {this.props.onBreak && this.props.clockedInOrderId === workOrder.workOrderKey ? "Clock Out of Break" : "Clock Into Break"}
            </Button>
            {this.renderTimes()}
            <div
              className="pure-u-1"
            >
              <p id="totalHours"/>
            </div>
          </div>
          <div
            className="workOrderItems"
          >
            {this.renderTaskList()}
          </div>
          <div className="workOrderItemsDivider"/>
          <div
            className="pure-u-1 workOrderFooterDiv"
          >
            <Button
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