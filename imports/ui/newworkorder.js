import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import moment from 'moment';
import { DatePicker,TimePicker,Checkbox,Input,Select,Menu,Button,Icon,message,Divider } from 'antd';

import { Contacts } from './../api/contacts';
import { Materials } from './../api/materials';
import { WorkOrders } from './../api/workorder';
import { WorkOrderItems } from './../api/workorderitems';

const history = createHistory();
const Option = Select.Option;
const { TextArea } = Input;

export default class NewWorkOrder extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      materials: [],
      selectedCustomer: '',
      selectedDueDate: '',
      selectedFrequency: '0',
      selectedPriority: '0',
      selectedAssignTo: '0',
      selectedStartTime: '',
      thisWorkOrder: [],
      workOrderId: '',
      workOrderItems: [],
    }
  };

  componentDidMount() {
    let _id = Random.id();
    Meteor.call('new.workorder', _id);
    this.setState({workOrderId: _id});
    this.newOrderTracker = Tracker.autorun(() => {
      let newWorkOrderReady = Meteor.subscribe('WorkOrders');
      const thisWorkOrder = WorkOrders.find({_id: _id}).fetch();
      this.setState({thisWorkOrder});
      this.state.thisWorkOrder.map((workOrder) => {
        let workOrderItemsReady = Meteor.subscribe('WorkOrderItems');
        const workOrderItems = WorkOrderItems.find({workOrderKey: workOrder.workOrderKey}).fetch();
        this.setState({workOrderItems});
        Meteor.subscribe('Materials');
        let materials = Materials.find({workOrderKey: workOrder.workOrderKey}).fetch();
        this.setState({materials});
      })
    })
  }

  componentWillUnmount() {
    this.newOrderTracker.stop();
  }

  onTaskChange(e) {
    let _id = e.target.id;
    let contents = e.target.value;
    Meteor.call('update.workorderitem',_id,contents);
  }

  updateMaterialContents(e) {
    let contentKey = e.target.id;
    let contents = e.target.value;
    Meteor.call('material.updatecontents',contentKey,contents);
  }

  updateMaterialQty(e) {
    let qtyKey = e.target.id;
    let qty = e.target.value;
    Meteor.call('material.updateqty',qtyKey,qty);
  }

  renderWorkOrderItems() {
    return this.state.workOrderItems.map((item) => {
      return <div
        className="pure-u-1"
        key={item._id}
      >
        {item.isHeading ? <div
          className="workOrderItemDiv"
        >
          <div
            className="pure-u-1-24 workOrderCheckboxDiv"
          >
            <Icon
              className="workOrderItemDelete"
              type="delete"
              title="Delete Header"
              onClick={() => {
                let _id = item._id;
                Meteor.call('delete.workorderitem', _id)
              }}
            />
          </div>
          <div
            className="pure-u-23-24"
          >
            <TextArea
              autosize={{minRows: 1}}
              id={item._id}
              onChange={this.onTaskChange.bind(this)}
            />
          </div>
        </div>
        : null}
        {item.isCheckbox ? <div
          className="workOrderItemDiv"
        >
          <div
            className="pure-u-1-24 workOrderCheckboxDiv"
          >
            <Icon
              className="workOrderItemDelete"
              type="delete"
              title="Delete Checkbox"
              onClick={() => {
                let _id = item._id;
                Meteor.call('delete.workorderitem', _id)
              }}
            />
          </div>
          <div
            className="pure-u-1-24 workOrderCheckboxDiv"
          >
            <Checkbox/>
          </div>
          <div
            className="pure-u-22-24"
          >
            <TextArea
              autosize={{minRows: 1}}
              id={item._id}
              onChange={this.onTaskChange.bind(this)}
            />
          </div>
        </div>
        : null}
      </div>
    })
  }

  renderPersonnelOptions() {
    return this.props.personnel.map((person) => {
      return <Option
        key={person._id}
        value={`${person.lastName}, ${person.firstName} (ID: ${person.personnelId})`}
      >
        {person.lastName}, {person.firstName} (ID: {person.personnelId})
      </Option>
    })
  }

  renderCustomerList() {
    return this.props.contacts.map((contact) => {
      return <Option
        key={contact._id}
        value={contact._id}
      >
        {contact.lastName}, {contact.firstName} ` (ID:${contact.contactKey})`
      </Option>
    })
  }

  renderMaterials() {
    return this.state.materials.map((material) => {
      return <div
        key={material._id}
      >
        <div
          className="pure-u-2-24 workOrderCheckboxDiv"
        >
          <Icon
            className="workOrderItemDelete"
            type="delete"
            title="Delete Material"
            onClick={() => {
              let _id = material._id;
              Meteor.call('material.remove',_id)
            }}
          />
        </div>
        <div
          className="pure-u-20-24"
        >
          <Input
            id={material.contentKey}
            onChange={this.updateMaterialContents.bind(this)}
          />
        </div>
        <div
          className="pure-u-2-24"
        >
          <Input
            id={material.qtyKey}
            onChange={this.updateMaterialQty.bind(this)}
          />
        </div>
      </div>
    })
  }

  render() {
    return this.state.thisWorkOrder.map((workOrder) => {
      return <div
        id="newWorkOrderDiv"
        className="pure-u-1 workOrderDiv"
        key={workOrder._id}
      >
        <div
          className="workOrderHeader"
        >
          <p>ID: {workOrder._id}</p>
          <label>Job Title:</label>
          <Input
            id="newTitle"
          />
          <label>Customer:</label>
          <br/>
          <div
            className="pure-u-sm-1 pure-u-lg-1-2"
          >
            <Select
              allowClear
              className="filterAssignedTech"
              mode="combobox"
              placeholder="Choose from a list of your contacts..."
              value={this.state.selectedCustomer}
              onChange={(e) => {
                if (e != undefined) {
                  let foundContact = Contacts.find({_id: e}).fetch();
                  foundContact.map((contact) => {
                    this.setState({selectedCustomer: `${contact.lastName}, ${contact.firstName} (ID:${contact.contactKey})`});
                    $("Input").eq(2).val(`${contact.lastName}, ${contact.firstName} (ID:${contact.contactKey})`);
                    $("Input").eq(3).val(`${contact.address}`);
                  })
                } else {
                  this.setState({selectedCustomer: ''});
                  $("Input").eq(2).val('');
                  $("Input").eq(3).val('');
                }
              }}
            >
              {this.renderCustomerList()}
            </Select>
          </div>
          <div
            className="pure-u-sm-1 pure-u-lg-1-2"
          >
            <Input
              type="text"
              id="newCustomer"
              placeholder="...or type in your customer's name here."
            />
          </div>
          <label>Location:</label>
          <Input
            type="text"
            id="newLocation"
          />
        </div>
        <div
          className="pure-u-1 pure-u-lg-1-5"
        >
          <label>Scheduled Due Date:&nbsp;</label>
          <DatePicker
            className="newWorkOrderOptions"
            id="newSelectDate"
            format="MM-DD-YYYY"
            onChange={(e) => {
              let selectedDueDate = moment(e).format('YYYY-MM-DD');
              this.setState({selectedDueDate});
            }}
          />
        </div>
        <div
          className="pure-u-1 pure-u-lg-1-5"
        >
          <label>Scheduled Start Time:&nbsp;</label>
          <TimePicker
            className="newWorkOrderOptions"
            id="newSelectTime"
            use12Hours
            format="h:mm a"
            onChange={(e) => {
              let selectedStartTime = moment(e).format('HH:mm');
              this.setState({selectedStartTime});
            }}
          />
        </div>
        <div
          className="pure-u-1 pure-u-lg-1-5"
        >
          <label>Frequency:&nbsp;</label>
          <Select
            className="newWorkOrderOptions"
            defaultValue="0"
            id="newFrequency"
            onChange={(e) => {
              this.setState({selectedFrequency: e});
            }}
            style={{width: 200}}
          >
            <Option value="0">Never Repeat</Option>
            <Option value="1">Repeat Every Week</Option>
            <Option value="2">Repeat Every Month</Option>
            <Option value="3">Repeat Semi-Annually</Option>
            <Option value="4">Repeat Yearly</Option>
            <Option value="5">Custom Schedule</Option>
          </Select>
        </div>
        <div
          className="pure-u-1 pure-u-lg-1-5"
          >
            <label>Priority:&nbsp;</label>
            <Select
              className="newWorkOrderOptions"
              defaultValue="0"
              id="newPriority"
              onChange={(e) => {
                this.setState({selectedPriority: e});
              }}
              style={{width: 200}}
              >
                <Option value="0">Normal</Option>
                <Option value="1">Semi-Important</Option>
                <Option value="2">Very Important</Option>
                <Option value="3">Emergency</Option>
              </Select>
            </div>
        <div
          className="pure-u-1 pure-u-lg-1-5"
        >
          <label>Assign To:&nbsp;</label>
          <Select
            className="newWorkOrderOptions"
            defaultValue="0"
            id="newAssignTo"
            onChange={(e) => {
              this.setState({selectedAssignTo: e});
            }}
            style={{width: 200}}
          >
            <Option value="0">Unassigned</Option>
            {this.renderPersonnelOptions()}
          </Select>
        </div>
        <div
          className="workOrderItems"
        >
          <div className="workOrderItemsDivider"/>
          {this.renderWorkOrderItems()}
        </div>
        <div
          className="pure-u-1 newItemButtonsDiv"
          id="newItemButtonsDiv"
        >
          <Button onClick={(e) => {
            let isHeading = true;
            let isCheckbox = false;
            let workOrderKey = workOrder.workOrderKey;
            Meteor.call('new.workorderitem',isHeading,isCheckbox,workOrderKey);
          }}>Add Header</Button>
          <Button onClick={(e) => {
            let isHeading = false;
            let isCheckbox = true;
            let workOrderKey = workOrder.workOrderKey;
            Meteor.call('new.workorderitem',isHeading,isCheckbox,workOrderKey);
          }}>Add Checkbox</Button>
        </div>
        <div
          className="workOrderItems"
        >
          <Divider>Materials:</Divider>
          <h3
            className="pure-u-22-24"
            style={{
              display: this.state.materials.length > 0 ? null : "none",
              textAlign: "center"
            }}
          >
            Name:
          </h3>
          <h3
            className="pure-u-2-24"
            style={{
              display: this.state.materials.length > 0 ? null : "none",
              textAlign: "center"
            }}
          >
            Qty:
          </h3>
          {this.renderMaterials()}
        </div>
        <div
          className="pure-u-1 newItemButtonsDiv"
          id="newItemButtonsDiv"
        >
          <Button onClick={(e) => {
            let workOrderKey = workOrder.workOrderKey;
            Meteor.call('material.new',workOrderKey);
          }}>Add Material</Button>
        </div>
        <Divider>
          Work Order Notes:
        </Divider>
        <TextArea
          id="workOrderNotes"
          defaultValue={workOrder.notes}
        />
        <div className="workOrderItemsDivider"/>
        <div
          className="pure-u-1 workOrderFooterDiv"
        >
          <Button
            type="primary"
            onClick={(e) => {
              let _id = workOrder._id;
              let workOrderKey = workOrder.workOrderKey;
              let title = document.getElementById('newTitle').value;
              let customerName = document.getElementById('newCustomer').value;
              let dueDate = this.state.selectedDueDate;
              let startTime = this.state.selectedStartTime;
              let location = document.getElementById('newLocation').value;
              let frequency = this.state.selectedFrequency;
              let priority = this.state.selectedPriority;
              let assignedTech = this.state.selectedAssignTo;
              let notes = document.getElementById('workOrderNotes').value;
              Meteor.call('save.workorder',_id,title,location,frequency,dueDate,startTime,customerName,assignedTech,priority,workOrderKey,notes,(err,res) => {
                if (err) {
                  return message.error(err.reason);
                } else {
                  this.props.onClose();
                }
              });
          }}>Save</Button>
          <Button
            type="danger"
            onClick={(e) => {
              let workOrderKey = workOrder.workOrderKey;
              Meteor.call('delete.workorder',workOrderKey);
              Meteor.call('delete.workorderitems',workOrderKey);
              Meteor.call('materials.bulkremove',workOrderKey);
              this.props.onClose();
          }}>Cancel</Button>
        </div>
      </div>
    })
  }

}
