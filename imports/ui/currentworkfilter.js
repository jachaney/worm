import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Menu,Icon,Dropdown,Input,Button,DatePicker,Select,AutoComplete,Switch} from 'antd';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const OptGroup = AutoComplete.OptGroup;
const history = createHistory();

export default class CurrentWorkFilter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      rangePickerValue: [],
      selectValue: '',
      workOrders: this.props.workorders,
    }
  }

  onRangeSelected(e) {
    this.setState({rangePickerValue: e})
    this.setState({selectValue: ''});
    this.props.onFilterByRange(e);
  }

  onSelectAssignedTech(e) {
    this.setState({selectValue: e});
    this.setState({rangePickerValue: []});
    this.props.onSelectAssignedTechChange(e);
  }

  renderTechs(e) {
    <span>
      Employee ID:&nbsp;{e}
    </span>
  }

  renderOptions() {
    return this.state.workOrders.map((workOrder) => {
      return <Option
        value={workOrder._id}
        key={workOrder._id}
      >
        {workOrder._id}&nbsp;({workOrder.assignedTech})
      </Option>
    })
  }

  toggleShowComplete(e) {
    this.props.toggleShowComplete();
  }

  render() {
    return (
      <div
        id="filterDiv"
        className="pure-u-1 filterDiv"
      >
        <div
          className="pure-u-sm-1 pure-u-lg-1-4 filterElements"
        >
          <span>By Date Range:&nbsp;</span>
          <RangePicker
            id="filterRangePicker"
            onChange={this.onRangeSelected.bind(this)}
            value={this.state.rangePickerValue}
          />
        </div>
        <div
          className="pure-u-sm-1 pure-u-lg-1-4 filterElements"
        >
          <span>Or By Assigned Employee:&nbsp;</span>
          <Select
            allowClear
            className="filterAssignedTech"
            id="filterAssignedTech"
            mode="combobox"
            onChange={this.onSelectAssignedTech.bind(this)}
            placeholder="Select An Employee..."
            value={this.state.selectValue}
          >
            {this.renderOptions()}
          </Select>
        </div>
        <div
          className="pure-u-sm-1 pure-u-lg-1-4 filterElements"
        >
          <span>Show Completed Orders:&nbsp;</span>
          <Switch
            defaultChecked={this.props.toggleShowCompleteOn}
            onChange={this.toggleShowComplete.bind(this)}
          />
        </div>
        <div
          className="pure-u-sm-1 pure-u-lg-1-4 filterElements filterClose"
        >
          <Button
            onClick={() => {
              this.props.onClose();
            }}
            title="Close Filter"
          >
            <Icon
              type="close-circle-o"
            />
            <span>Close Filter</span>
          </Button>
        </div>
      </div>
    )
  }
}
