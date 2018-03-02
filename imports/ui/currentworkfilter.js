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
      selectDivisionValue: '',
      selectPositionValue: '',
      workOrders: this.props.workorders,
    }
  }

  onRangeSelected(e) {
    this.setState({rangePickerValue: e})
    this.props.onFilterByRange(e);
  }

  onSelectAssignedTech(e) {
    this.setState({selectValue: e});
    this.props.onSelectAssignedTechChange(e);
  }

  onSelectDivision(e) {
    this.setState({selectDivisionValue: e});
    this.props.onFilterByDivision(e);
  }

  onSelectPosition(e) {
    this.setState({selectPositionValue: e});
    this.props.onFilterByPosition(e);
  }

  renderTechs() {
    let personnel = this.props.personnel;
    let uniqueDivisions = [];
    return this.props.personnel.map((person) => {
      return <Option
        key={person._id}
        value={person.lastName + ", " + person.firstName + ` (ID: ${person.personnelId})`}
      >
        {person.lastName}, {person.firstName} (ID: {person.personnelId})
      </Option>
    })
  }

  renderDivisions() {
    let personnel = this.props.personnel;
    let uniqueDivisions = _.uniq(personnel,false,function(d) {return d.division});
    let divisions = _.pluck(uniqueDivisions,'division')
    return divisions.map((division) => {
      return <Option
        key={division}
        value={division}
      >
        {division}
      </Option>
    })
  }

  renderPositions() {
    let personnel = this.props.personnel;
    let uniquePositions = _.uniq(personnel,false,function(d) {return d.position});
    let positions = _.pluck(uniquePositions,'position')
    return positions.map((position) => {
      return <Option
        key={position}
        value={position}
      >
        {position}
      </Option>
    })
  }

  forWorkOrderDashboard() {
    return <div>
      <div
        className="pure-u-sm-1 pure-u-lg-1-4 filterElements"
      >
        <span>By Date Range:&nbsp;</span>
        <RangePicker
          onChange={this.onRangeSelected.bind(this)}
          defaultValue={this.state.rangePickerValue}
          ranges={{'Today':[moment(),moment()],
            'This Week':[moment().startOf('week'),moment().endOf('week')],
            'This Month':[moment().startOf('month'),moment().endOf('month')],
            'This Year':[moment().startOf('year'),moment().endOf('year')]}}
        />
      </div>
      <div
        className="pure-u-sm-1 pure-u-lg-1-4 filterElements"
      >
        <span>And/Or By Assigned Employee:&nbsp;</span>
        <Select
          allowClear
          disabled={Meteor.user().profile.isAdmin ? false : true}
          className="filterAssignedTech"
          ref="filterAssignedTech"
          mode="combobox"
          onChange={this.onSelectAssignedTech.bind(this)}
          placeholder="Select An Employee..."
          value={this.state.selectValue}
        >
          {this.renderTechs()}
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
          className="filterCloseButton"
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
  }

  forPersonnelDashboard() {
    return <div>
      <div
        className="pure-u-sm-1 pure-u-lg-1-3 filterElements"
      >
        <span>By Division:&nbsp;</span>
        <Select
          allowClear
          disabled={Meteor.user().profile.isAdmin ? false : true}
          className="filterAssignedTech"
          ref="filterByDivision"
          mode="combobox"
          onChange={this.onSelectDivision.bind(this)}
          placeholder="Select A Division..."
          value={this.state.selectDivisionValue}
        >
          {this.renderDivisions()}
        </Select>
      </div>
      <div
        className="pure-u-sm-1 pure-u-lg-1-3 filterElements"
      >
        <span>And/Or By Position:&nbsp;</span>
        <Select
          allowClear
          disabled={Meteor.user().profile.isAdmin ? false : true}
          className="filterAssignedTech"
          ref="filterByPosition"
          mode="combobox"
          onChange={this.onSelectPosition.bind(this)}
          placeholder="Select A Position..."
          value={this.state.selectPositionValue}
        >
          {this.renderPositions()}
        </Select>
      </div>
      <div
        className="pure-u-sm-1 pure-u-lg-1-3 filterElements filterClose"
      >
        <Button
          className="filterCloseButton"
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
        {this.props.showCurrentWorkList || this.props.showCompletedWorkList ?
          this.forWorkOrderDashboard() : null}
        {this.props.showPersonnelDashboard ?
          this.forPersonnelDashboard() : null}
      </div>
    )
  }
}
