import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { DatePicker,Layout,Menu,Icon,Row,Dropdown,Modal } from 'antd';

import ContactsList from './contactslist';
import CompletedWorkList from './completedworklist';
import CurrentWorkFilter from './currentworkfilter';
import CurrentWorkList from './currentworklist';
import CurrentDashboardSearch from './currentdashboardsearch';
import NewContact from './newcontact';
import NewWorkOrder from './newworkorder';
import SelectedContact from './selectedcontact';
import SelectedWorkOrder from './selectedworkorder';

import { Contacts } from './../api/contacts';
import { Employees } from './../api/employees';
import { Time } from './../api/time';
import { WorkOrders } from './../api/workorder';

const history = createHistory();
const { SubMenu } = Menu;
const { Header,Content,Footer,Sider } = Layout;
const confirm = Modal.confirm;

export default class Dashboard extends React.Component {
  rootSubmenuKeys = ['workSubMenu', 'contactsSubMenu'];
  constructor(props) {
    super(props);
    this.state = {
      clockedIn: false,
      clockedInOrderId: '',
      completedWorkOrders: [],
      contacts: [],
      disableAddContact: false,
      disableContactsList: false,
      disableCurrentWorkFilter: false,
      disableCurrentWorkList: false,
      disableCurrentDashboardSearch: false,
      disableContactsList: false,
      endDate: new Date(),
      menuCollapsed: true,
      menuMode: 'inline',
      menuClassName: '',
      onBreak: false,
      openKeys: [''],
      selectedContactKey: '',
      selectedWorkOrderId: '',
      selectedKeys: [''],
      showContactsList: false,
      showCompletedWorkList: false,
      showCurrentWorkFilter: false,
      showCurrentWorkList: true,
      showCurrentDashboardSearch: false,
      showDropdownMenu: true,
      showNewContact: false,
      showNewWorkOrder: false,
      showSelectedContact: false,
      showSelectedWorkOrder: false,
      startDate: new Date(),
      toggleShowCompleteOn: false,
      workOrders: [],
    }
  };

  componentDidMount() {
    this.dashTracker = Tracker.autorun(() => {
      let workOrdersReady = Meteor.subscribe('WorkOrders');
      const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},{sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({isComplete: true},{sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState ({completedWorkOrders});
      const clockedInOrder = WorkOrders.find({clockedIn: true}).fetch();
      try {
        clockedInOrder.map((order) => {
          this.setState({clockedIn: order.clockedIn});
          this.setState({clockedInOrderId: order.workOrderKey});
          this.setState({onBreak: order.onBreak});
        })
      } catch (e) {
        return null;
      }
      let contactsReady = Meteor.subscribe('Contacts');
      const contacts = Contacts.find({},{sort:{lastName: 1}}).fetch();
      this.setState({contacts});
    })
  }

  componentWillUnmount() {
    this.dashTracker.stop();
  }

  resetWorkOrderDashboard() {
    let workOrdersReady = Meteor.subscribe('WorkOrders');
    const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},{sort:{clockedIn: -1, dueDate: 1}}).fetch();
    this.setState ({workOrders});
    this.setState({showSelectedWorkOrder: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showNewWorkOrder: false});
    this.setState({showContactsList: false});
    this.setState({showCompletedWorkList: false});
    this.setState({selectedWorkOrderId: ''});
    this.setState({showCurrentWorkList: true});
    document.getElementById('backgroundImage').style.display = "block";
  }

  resetContactsDashboard() {
    let contactsReady = Meteor.subscribe('Contacts');
    const contacts = Contacts.find({},{sort:{lastName: 1}}).fetch();
    this.setState ({contacts});
    this.setState({showSelectedWorkOrder: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showCurrentWorkList: false});
    this.setState({showNewContact: false});
    this.setState({selectedContactKey: ''});
    this.setState({showSelectedContact: false});
    this.setState({showContactsList: true});
    document.getElementById('backgroundImage').style.display = "block";
  }

  onOrderClick(e) {
    this.setState({selectedWorkOrderId: e});
    this.setState({showCurrentWorkList: false});
    this.setState({showCompletedWorkList: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showSelectedWorkOrder: true});
    if (this.state.clockedIn === false) {
      this.setState({clockedInOrderId: e});
    }
  }

  onContactClick(e) {
    this.setState({selectedContactKey: e});
    this.setState({showContactsList: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showSelectedContact: true});
  }

  handleMenuItemClick(e) {
    let dashboardDiv = document.getElementById('dashboardDiv');
    if (e.key === "menuToggle") {
      if (this.state.menuCollapsed === false) {
        this.setState({menuCollapsed: true});
        this.setState({menuMode: 'vertical'});
        this.setState({openKeys: []});
        this.setState({selectedKeys: []});
      } else {
        this.setState({menuCollapsed: false});
        this.setState({menuMode: 'inline'});
        if (!!this.state.showCurrentWorkList || !!this.state.showNewWorkOrder || !!this.state.showSelectedWorkOrder ) {
          this.setState({openKeys: ['workSubMenu']});
        }
      }
    } else if (e.key === "workOrderDashboard") {
      this.resetWorkOrderDashboard();
    } else if (e.key === "newWorkOrder") {
      this.setState({showCurrentWorkList: false});
      this.setState({showSelectedWorkOrder: false});
      this.setState({showNewWorkOrder: true});
      this.setState({openKeys: []});
      this.setState({showCurrentDashboardSearch: false});
      this.setState({showCurrentWorkFilter: false})
    } else if (e.key === "showSearch") {
      this.setState({showCurrentWorkFilter: false})
      this.setState({showCurrentDashboardSearch: true});
    } else if (e.key === "showFilter") {
      this.setState({showCurrentDashboardSearch: false});
      this.setState({showCurrentWorkFilter: true})
    } else if (e.key === "contactsListDashboard") {
      this.resetContactsDashboard();
    } else if (e.key === "addContact") {
      this.setState({showContactsList: false});
      this.setState({showNewContact: true});
    } else if (e.key === "logout") {
      confirm({
        title: "Are you sure you want to logout?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          Accounts.logout();
          setTimeout(function() {
            history.push('/');
            history.go();
          },100);
        },
        onCancel() {
          null;
        }
      })
    }
  }

  hideMenu() {
    this.setState({menuCollapsed: true});
    this.setState({openKeys: []});
  }

  searchClose() {
    if (this.state.showCurrentWorkList === true) {
      this.setState({showCurrentDashboardSearch: false});
      document.getElementById('dashboardDiv').style.marginTop = "";
      this.resetWorkOrderDashboard();
    } else if (this.state.showContactsList === true) {
      this.setState({showCurrentDashboardSearch: false});
      document.getElementById('dashboardDiv').style.marginTop = "";
      this.resetContactsDashboard();
    }
  }

  onOpenChange (openKeys) {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  onSearchEnter(e) {
    if (this.state.showCurrentWorkList === true) {
      Meteor.subscribe('WorkOrders');
      let workOrders = WorkOrders.find({$or: [{title: {$regex: e, $options: 'i'}},
        {assignedTech: {$regex: e, $options: 'i'}},{location:{$regex: e, $options: 'i'}},
        {dueDate:{$regex: e, $options: 'i'}}]}).fetch();
      this.setState ({workOrders});
    } else if (this.state.showContactsList === true){
      Meteor.subscribe('Contacts');
      let contacts = Contacts.find({$or: [{lastName: {$regex: e, $options: 'i'}},
        {firstName: {$regex: e, $options: 'i'}},{address:{$regex: e, $options: 'i'}},
        {primePhone:{$regex: e, $options: 'i'}},{email:{$regex: e, $options: 'i'}},
        {company:{$regex: e, $options: 'i'}}]}).fetch();
      this.setState ({contacts});
    }
  }

  onFilterByRange(e) {
    let beginning = moment(e[0]).format('YYYY-MM-DD');
    let end = moment(e[1]).add(1,'d').format('YYYY-MM-DD');
    Meteor.subscribe('WorkOrders');
    if (e.length > 0) {
      let workOrders = WorkOrders.find({$and:[{dueDate: {$gte: beginning, $lte: end}},
        {$or: [{isComplete: false},{isComplete: undefined}]}]},
        {sort: {dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({$and:[{dueDate: {$gte: beginning, $lte: end}},{isComplete: true}]},{sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState({completedWorkOrders})
    } else {
      const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},{sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({isComplete: true},{sort:{dueDate: 1}}).fetch();
      this.setState ({completedWorkOrders});
    }
  }

  onSelectAssignedTechChange(e) {
    Meteor.subscribe('WorkOrders');
    if ( e != undefined ) {
      let workOrders = WorkOrders.find({assignedTech: e},{sort: {dueDate: 1}}).fetch();
      this.setState ({workOrders});
    } else {
      let workOrders = WorkOrders.find({},{sort: {dueDate: 1}}).fetch();
      this.setState ({workOrders});
    }
  }

  onClockIn(e) {
    let workOrderKey = e;
    this.setState({clockedInOrderId: e});
    this.setState({clockedIn: true});
    Meteor.call('workorder.clockin',workOrderKey);
    Meteor.call('time.clockin',workOrderKey);
  }

  onClockOut(e) {
    let workOrderKey = e.workOrderKey;
    let _id = e._id;
    this.setState({clockedIn: false});
    Meteor.call('workorder.clockout',workOrderKey);
    Meteor.call('time.clockout',_id);
  }

  onBreakIn(e) {
    let workOrderKey = e;
    this.setState({onBreak: true});
    Meteor.call('workorder.breakin',workOrderKey);
    Meteor.call('time.breakin',workOrderKey);
  }

  onBreakOut(e) {
    let workOrderKey = e.workOrderKey;
    let _id = e._id;
    this.setState({onBreak: false});
    Meteor.call('workorder.breakout',workOrderKey);
    Meteor.call('time.breakout',_id);
  }

  toggleShowComplete(e) {
    this.setState({showCurrentWorkList: !this.state.showCurrentWorkList});
    this.setState({showCompletedWorkList: !this.state.showCompletedWorkList});
    this.setState({toggleShowCompleteOn: !this.state.toggleShowCompleteOn});
  }

  exitCompletedOrder() {
    this.setState({showSelectedWorkOrder: false});
    this.setState({selectedWorkOrderId: ''});
    this.setState({showCurrentWorkFilter: true});
    this.setState({showCompletedWorkList: true});
  }

  render() {
    return (
      <div>
        <img
          className="backgroundImage"
          id="backgroundImage"
          src="background.jpg"
        />
        <Menu
          className="sideNavVertical"
          defaultSelectedKeys={['workOrderDashboard']}
          id="sideNav"
          inlineCollapsed={this.state.menuCollapsed}
          mode={this.state.menuMode}
          onClick={this.handleMenuItemClick.bind(this)}
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange.bind(this)}
          selectedKeys={this.state.selectedKeys}
        >
          <Menu.Item
            key="menuToggle"
          >
            <Icon type={this.state.menuCollapsed ? "menu-unfold" : "menu-fold"}/>
            <span>{this.state.menuCollapsed ? "Show Menu" : "Hide Menu"}</span>
          </Menu.Item>
          <SubMenu
            key="workSubMenu"
            title={<span><Icon type="calendar"/><span>Work Order Management</span></span>}
          >
            <Menu.Item
              disabled={this.state.showNewWorkOrder ? true : false}
              key="workOrderDashboard"
            >
              <Icon type="dashboard"/>
              <span>Work Order Dashboard</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showNewWorkOrder || !this.state.showCurrentWorkList
                ? true : false}
              key="newWorkOrder"
            >
              <Icon type="plus-square-o"/>
              <span>New Work Order</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showCurrentWorkList ? false : true}
              key="showSearch"
            >
              <Icon type="search"/>
              <span>Search Work Orders</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showCurrentWorkList ? false : true}
              key="showFilter"
            >
              <Icon type="filter"/>
              <span>Filter Work Orders</span>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="contactsSubMenu"
            title={<span><Icon type="contacts"/><span>Contacts</span></span>}
          >
            <Menu.Item
              key="contactsListDashboard"
            >
              <Icon type="dashboard" className="sideNavIcon"/>
              <span>Contacts Dashboard</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showNewContact || !this.state.showContactsList
                ? true : false}
              key="addContact"
            >
              <Icon type="user-add"/>
              <span>Add Contact</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showNewContact || !this.state.showContactsList
                ? true : false}
              key="showSearch"
            >
              <Icon type="search"/>
              <span>Search Contacts</span>
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="logout"
          >
            <Icon
              title="Logout"
              type="logout"
            />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
        <div
          className="pure-g currentWorkListDivWide"
          id="dashboardDiv"
          onClick={this.hideMenu.bind(this)}
        >
          {this.state.showCurrentDashboardSearch ?
            <CurrentDashboardSearch
              onClose={this.searchClose.bind(this)}
              onSearchEnter={this.onSearchEnter.bind(this)}
            />
          : null}
          {this.state.showCurrentWorkFilter ?
            <CurrentWorkFilter
              workorders={this.state.workOrders}
              onClose={this.resetWorkOrderDashboard.bind(this)}
              onFilterByRange={this.onFilterByRange.bind(this)}
              onSelectAssignedTechChange={this.onSelectAssignedTechChange.bind(this)}
              toggleShowComplete={this.toggleShowComplete.bind(this)}
              toggleShowCompleteOn={this.state.toggleShowCompleteOn}
            />
          : null}
          <div
            id="currentWorkList"
            style={{
              width: "100%"
            }}
          >
            {this.state.showCurrentWorkList && this.state.workOrders.length === 0
            && !this.state.showCurrentWorkFilter && !this.state.showCurrentDashboardSearch ?
              <h3 className=" pure-u-1 noWorkOrders">Use the side menu to create an order.</h3>
            : null}
            {this.state.showCurrentWorkList && this.state.workOrders.length > 0 ?
              <CurrentWorkList
                startdate={this.state.startDate}
                enddate={this.state.endDate}
                id={this.state.selectedWorkOrderId}
                workOrders={this.state.workOrders}
                onOrderClick={this.onOrderClick.bind(this)}
                clockedIn={this.state.clockedIn}
                clockedInOrderId={this.state.clockedInOrderId}
                onBreak={this.state.onBreak}
              />
            : null}
          </div>
          {this.state.showSelectedWorkOrder ?
            <SelectedWorkOrder
              toDashboard={this.resetWorkOrderDashboard.bind(this)}
              exitCompletedOrder={this.exitCompletedOrder.bind(this)}
              selectedWorkOrderId={this.state.selectedWorkOrderId}
              clockedIn={this.state.clockedIn}
              clockedInOrderId={this.state.clockedInOrderId}
              onBreak={this.state.onBreak}
              onClockIn={this.onClockIn.bind(this)}
              onClockOut={this.onClockOut.bind(this)}
              onBreakIn={this.onBreakIn.bind(this)}
              onBreakOut={this.onBreakOut.bind(this)}
            />
          : null}
          {this.state.showNewWorkOrder ?
            <NewWorkOrder
              workOrders={this.state.workOrders}
              onClose={this.resetWorkOrderDashboard.bind(this)}
            />
          : null}
          {this.state.showContactsList ?
            <ContactsList
              contacts={this.state.contacts}
              onContactClick={this.onContactClick.bind(this)}
            />
          : null}
          {this.state.showNewContact ?
            <NewContact
              onClose={this.resetContactsDashboard.bind(this)}
            />
          : null}
          {this.state.showSelectedContact ?
            <SelectedContact
              selectedContactKey={this.state.selectedContactKey}
              toDashboard={this.resetContactsDashboard.bind(this)}
            />
          : null}
          {this.state.showCompletedWorkList ?
            <CompletedWorkList
              onOrderClick={this.onOrderClick.bind(this)}
              workOrders={this.state.completedWorkOrders}
            />
          : null}
        </div>
      </div>
    )
  }
};
