import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import moment from 'moment';
import { DatePicker,Menu,Icon,Row,Dropdown,Modal,Select } from 'antd';

import ContactsList from './contactslist';
import CompletedWorkList from './completedworklist';
import CurrentWorkFilter from './currentworkfilter';
import CurrentWorkList from './currentworklist';
import CurrentDashboardSearch from './currentdashboardsearch';
import EditWorkOrder from './editworkorder';
import MyProfile from './myprofile';
import NewContact from './newcontact';
import NewPersonnel from './newpersonnel';
import NewWorkOrder from './newworkorder';
import PersonnelList from './personnellist';
import SelectedContact from './selectedcontact';
import SelectedPersonnel from './selectedpersonnel';
import SelectedWorkOrder from './selectedworkorder';

import { Contacts } from './../api/contacts';
import { Personnel } from './../api/personnel';
import { Time } from './../api/time';
import { WorkOrders } from './../api/workorder';

const history = createHistory();
const { SubMenu } = Menu;
const confirm = Modal.confirm;
const Option = Select.Option;

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
      divisions: [],
      endDate: new Date(),
      filterAssignedTech: '0',
      filterBeginningDate: '',
      filterEndDate: '',
      lastOpenDashboard: '',
      menuCollapsed: true,
      menuMode: 'inline',
      menuClassName: '',
      onBreak: false,
      openKeys: [''],
      personnel: [],
      selectedContactKey: '',
      selectedPersonnelKey: '',
      selectedWorkOrderId: '',
      selectedKeys: [''],
      showAssignOrderModal: false,
      showContactsList: false,
      showCompletedWorkList: false,
      showCurrentWorkFilter: false,
      showCurrentWorkList: true,
      showCurrentDashboardSearch: false,
      showDropdownMenu: true,
			showEditWorkOrder: false,
      showMyProfile: false,
      showNewContact: false,
      showNewPersonnel: false,
      showNewWorkOrder: false,
      showPersonnelDashboard: false,
      showSelectedContact: false,
      showSelectedPersonnel: false,
      showSelectedWorkOrder: false,
      startDate: new Date(),
      thisUserKey: '',
      toggleShowCompleteOn: false,
      workOrders: [],
    }
  };

  componentDidMount() {
    this.dashTracker = Tracker.autorun(() => {
      let workOrdersReady = Meteor.subscribe('WorkOrders');
      const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},
        {sort:{clockedIn: -1,isOnBreak: -1,priority: 1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({isComplete: true},{sort:{completedOn: 1}}).fetch();
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
      const contacts = Contacts.find({},{sort:{lastName: 1,company: 1}}).fetch();
      this.setState({contacts});
      Meteor.subscribe('Personnel');
      let personnel = Personnel.find({},{sort:{lastName: 1}}).fetch();
      this.setState({personnel});
      let userReady = Meteor.subscribe('ThisUser');
      if (userReady.ready()) {
        let confirmPersonnelDocument = Personnel.find({userKey: Meteor.user().profile.userKey}).fetch();
        if (confirmPersonnelDocument.length) {
          return null
        } else {
          Meteor.call('personnel.onrecordnotfound');
        }
      }
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
    this.setState({selectedContactKey: ''});
    this.setState({selectedPersonnelKey: ''});
    this.setState({toggleShowCompleteOn: false});
    this.setState({showPersonnelDashboard: false});
    this.setState({showMyProfile: false});
    this.setState({showNewPersonnel: false});
    this.setState({showEditWorkOrder: false});
    this.setState({showCurrentWorkList: true});
    document.getElementById('backgroundImage').style.display = "block";
  }

  resetContactsDashboard() {
    let contactsReady = Meteor.subscribe('Contacts');
    const contacts = Contacts.find({},{sort:{lastName: 1}}).fetch();
    this.setState ({contacts});
    this.setState({showSelectedWorkOrder: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showCurrentWorkList: false});
    this.setState({showNewContact: false});
    this.setState({selectedWorkOrderId: ''});
    this.setState({selectedContactKey: ''});
    this.setState({selectedPersonnelKey: ''});
    this.setState({showSelectedContact: false});
    this.setState({showPersonnelDashboard: false});
    this.setState({showMyProfile: false});
    this.setState({showNewPersonnel: false});
    this.setState({showCurrentDashboardSearch: true});
    this.setState({showContactsList: true});
    document.getElementById('backgroundImage').style.display = "block";
  }

  resetPersonnelDashboard() {
    let personnelReady = Meteor.subscribe('Personnel');
    const personnel = Personnel.find({},{sort:{lastName: 1}}).fetch();
    this.setState ({personnel});
    this.setState({showSelectedWorkOrder: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showCurrentWorkList: false});
    this.setState({showNewContact: false});
    this.setState({selectedWorkOrderId: ''});
    this.setState({selectedContactKey: ''});
    this.setState({selectedPersonnelKey: ''});
    this.setState({showSelectedContact: false});
    this.setState({showMyProfile: false});
    this.setState({showContactsList: false});
    this.setState({showSelectedPersonnel: false});
    this.setState({showNewPersonnel: false});
    this.setState({showPersonnelDashboard: true});
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

	onEditWorkOrder(e) {
    console.log(e);
		this.setState({selectedWorkOrderId: e});
    this.setState({showCurrentWorkList: false});
    this.setState({showCompletedWorkList: false});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showCurrentWorkFilter: false});
    this.setState({showSelectedWorkOrder: false});
		this.setState({showEditWorkOrder: true});
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

  onPersonnelClick(e) {
    this.setState({selectedPersonnelKey: e});
    this.setState({showCurrentDashboardSearch: false});
    this.setState({showPersonnelDashboard: false});
    this.setState({showSelectedPersonnel: true});
  }

  showAssignOrderModal(e) {
    this.setState({showAssignOrderModal: true});
    this.setState({selectedWorkOrderId: e});
    this.setState({selectedPersonnelKey: "0"});
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
      this.setState({showCurrentDashboardSearch: false});
      this.setState({showNewContact: true});
    } else if (e.key === "myProfile") {
      if (this.state.showCurrentWorkList === true) {
        this.setState({lastOpenDashboard: 'showCurrentWorkList'});
        this.setState({showCurrentWorkList: false});
      } else if (this.state.showContactsList === true) {
        this.setState({lastOpenDashboard: 'showContactsList'});
        this.setState({showContactsList: false});
      } else if (this.state.showPersonnelDashboard === true) {
        this.setState({lastOpenDashboard: 'showPersonnelDashboard'});
        this.setState({showPersonnelDashboard: false});
      }
      this.setState({showCurrentDashboardSearch: false});
      this.setState({showMyProfile: true});
    } else if (e.key === "personnelDashboard") {
      this.resetPersonnelDashboard();
    } else if(e.key === "newPersonnel") {
      this.setState({showPersonnelDashboard: false});
      this.setState({showNewPersonnel: true});
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
    } else if (this.state.showPersonnelDashboard === true) {
      this.setState({showCurrentDashboardSearch: false});
      document.getElementById('dashboardDiv').style.marginTop = "";
      this.resetPersonnelDashboard();
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
    if (this.state.showCurrentWorkList === true && e.trim().length > 0) {
      let workOrders = WorkOrders.find({$or: [{title: {$regex: e, $options: 'i'}},
        {assignedTech: {$regex: e, $options: 'i'}},{location:{$regex: e, $options: 'i'}},
        {dueDate:{$regex: e, $options: 'i'}}]},{sort:{isComplete: 1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
    } else if (this.state.showCurrentWorkList === true && e.trim().length === 0) {
      let workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},
        {sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
        this.setState({workOrders});
    } else if (this.state.showContactsList === true && e.trim().length > 0) {
      let contacts = Contacts.find({$or: [{lastName: {$regex: e, $options: 'i'}},
        {firstName: {$regex: e, $options: 'i'}},{address:{$regex: e, $options: 'i'}},
        {primePhone:{$regex: e, $options: 'i'}},{email:{$regex: e, $options: 'i'}},
        {company:{$regex: e, $options: 'i'}}]}).fetch();
      this.setState ({contacts});
    } else if (this.state.showContactsList === true && e.trim().length === 0) {
      let contacts = Contacts.find({},{sort:{lastName: 1}}).fetch();
      this.setState({contacts});
    } else if (this.state.showPersonnelDashboard === true && e.trim().length > 0) {
      let personnel = Personnel.find({$or: [{lastName: {$regex: e, $options: 'i'}},
        {firstName: {$regex: e, $options: 'i'}},{address:{$regex: e, $options: 'i'}},
        {phone:{$regex: e, $options: 'i'}},{email:{$regex: e, $options: 'i'}},
        {division:{$regex: e, $options: 'i'}},{position:{$regex: e, $options: 'i'}},
        {personnelId:{$regex: e, $options: 'i'}}]}).fetch();
      this.setState ({personnel});
    } else if (this.state.showPersonnelDashboard === true && e.trim().length === 0) {
      let personnel = Personnel.find({},{sort:{lastName: 1}}).fetch();
      this.setState({personnel});
    }
  }

  onFilterByRange(e) {
    let beginning = moment(e[0]).format('YYYY-MM-DD');
    let end = moment(e[1]).add(1,'d').format('YYYY-MM-DD');
    if (e.length > 0) {
      this.setState({workOrders: this.state.workOrders.filter((workOrder) => {
        return moment(workOrder.dueDate).isBetween(beginning,end);
      })})
      this.setState({completedWorkOrders: this.state.completedWorkOrders.filter((workOrder) => {
        return moment(workOrder.dueDate).isBetween(beginning,end);
      })})
    } else {
      const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},
        {sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({isComplete: true},{sort:{dueDate: 1}}).fetch();
      this.setState ({completedWorkOrders});
    }
  }

  onSelectAssignedTechChange(e) {
    if ( e != undefined ) {
      this.setState({workOrders: this.state.workOrders.filter((workOrder) => {
          return workOrder.assignedTech === e;
        })
      });
      this.setState({completedWorkOrders: this.state.completedWorkOrders.filter((workOrder) => {
          return workOrder.assignedTech === e;
        })
      });
    } else {
      const workOrders = WorkOrders.find({$or:[{isComplete: false},{isComplete: undefined}]},
        {sort:{clockedIn: -1,isOnBreak: -1,dueDate: 1}}).fetch();
      this.setState ({workOrders});
      const completedWorkOrders = WorkOrders.find({isComplete: true},{sort:{completedOn: 1}}).fetch();
      this.setState ({completedWorkOrders});
    }
  }

  onFilterByDivision(e) {
    if (e != undefined) {
      this.setState({personnel: this.state.personnel.filter((person) => {
          return person.division === e;
        })
      })
    } else {
      let personnel = Personnel.find({},{sort:{lastName: 1}}).fetch();
      this.setState({personnel});
    }
  }

  onFilterByPosition(e) {
    if (e != undefined) {
      this.setState({personnel: this.state.personnel.filter((person) => {
          return person.position === e;
        })
      })
    } else {
      let personnel = Personnel.find({},{sort:{lastName: 1}}).fetch();
      this.setState({personnel});
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

  onMyProfileExit(e) {
    let dashboardToShow = this.state.lastOpenDashboard;
    if (dashboardToShow === "showCurrentWorkList") {
      this.setState({showCurrentWorkList: true});
    } else if (dashboardToShow === "showContactsList") {
      this.setState({showContactsList: true});
    } else if (dashboardToShow === "showPersonnelDashboard") {
      this.setState({showPersonnelDashboard: true});
    }
    this.setState({showMyProfile: false});
  }

  onFilterClose() {
    if (this.state.showCurrentWorkList || this.state.showCompletedWorkList) {
      this.resetWorkOrderDashboard();
    } else if (this.state.showPersonnelDashboard) {
      this.resetPersonnelDashboard();
    }
  }

  renderAssignToOptions() {
    return this.state.personnel.map((person) => {
      return <Option
        key={person._id}
        value={person._id}
      >
        {person.lastName}, {person.firstName} (ID: {person.personnelId})
      </Option>
    })
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
              disabled={this.state.showNewWorkOrder || this.state.showNewContact ||
                this.state.showNewPersonnel ? true : false}
              key="workOrderDashboard"
            >
              <Icon type="dashboard"/>
              <span>Work Order Dashboard</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showCurrentWorkList
                ? false : true}
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
              disabled={this.state.showNewWorkOrder || this.state.showNewContact ||
                this.state.showNewPersonnel
                ? true : false}
              key="contactsListDashboard"
            >
              <Icon type="dashboard" className="sideNavIcon"/>
              <span>Contacts Dashboard</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showContactsList ? false : true}
              key="addContact"
            >
              <Icon type="user-add"/>
              <span>Add Contact</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showNewContact || !this.state.showContactsList ||
                this.state.showNewPersonnel ? true : false}
              key="showSearch"
            >
              <Icon type="search"/>
              <span>Search Contacts</span>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="personnelSubMenu"
            title={<span><Icon type="team"/><span>Personnel Management</span></span>}
          >
            <Menu.Item
              disabled={this.state.showNewWorkOrder || this.state.showNewContact ||
                this.state.showNewPersonnel ? true : false}
              key="myProfile"
            >
              <Icon type="user"/>
              <span>My Profile</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showNewWorkOrder || this.state.showNewContact ||
                this.state.showNewPersonnel
                ? true : false}
              key="personnelDashboard"
            >
              <Icon type="dashboard"/>
              <span>Personnel Dashboard</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showPersonnelDashboard &&
                Meteor.user().profile.isAdmin ? false : true}
              key="newPersonnel"
            >
              <Icon type="user-add"/>
              <span>Add Personnel</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showPersonnelDashboard ? false : true}
              key="showSearch"
            >
              <Icon type="search"/>
              <span>Search Personnel</span>
            </Menu.Item>
            <Menu.Item
              disabled={this.state.showPersonnelDashboard ? false : true}
              key="showFilter"
            >
              <Icon type="filter"/>
              <span>Filter Personnel</span>
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
          <Modal
            visible={this.state.showAssignOrderModal}
            onOk={() => {
              let workOrderKey = this.state.selectedWorkOrderId;
              let userToAssign = this.state.selectedPersonnelKey;
              let personFound = Personnel.find({userKey: userToAssign}).fetch();
              if (personFound.length > 0) {
                personFound.map((person) => {
                  let assignedTech = person.lastName + ", " + person.firstName + ` (ID: ${person.personnelId})`;
                  let userKey = person.userKey;
                  Meteor.call('workorder.assign',workOrderKey,assignedTech,userKey);
                  Meteor.call('assign.workorderitems',workOrderKey,userKey);
                  this.setState({showAssignOrderModal: false});
                  this.setState({selectedWorkOrderId: ''});
                  this.setState({selectedPersonnelKey: ''});
                })
              } else {
                let assignedTech = "Unassigned";
                let userKey = 0;
                Meteor.call('workorder.assign',workOrderKey,assignedTech,userKey);
                this.setState({showAssignOrderModal: false});
                this.setState({selectedWorkOrderId: ''});
                this.setState({selectedPersonnelKey: ''});
              }
            }}
            onCancel={() => {
              this.setState({selectedWorkOrderId: ''});
              this.setState({selectedPersonnelKey: ''});
              this.setState({showAssignOrderModal: false});
            }}
            title="Assign Work Order"
          >
            <Icon
              className="modalIcon"
              type="solution"
            />
            <span className="modalSpan">&nbsp;Assign Work Order To: </span>
            <Select
              className="assignTaskModal"
              defaultValue="0"
              onChange={(e) => {
                let _id = e;
                let personFound = Personnel.find({_id}).fetch();
                personFound.map((person) => {
                  this.setState({selectedPersonnelKey: person.userKey});
                })
              }}
            >
              <Option value="0">Unassigned</Option>
              {this.renderAssignToOptions()}
            </Select>
          </Modal>
          {this.state.showCurrentDashboardSearch ?
            <CurrentDashboardSearch
              onClose={this.searchClose.bind(this)}
              onSearchEnter={this.onSearchEnter.bind(this)}
              showContactsList={this.state.showContactsList}
            />
          : null}
          {this.state.showCurrentWorkFilter ?
            <CurrentWorkFilter
              workorders={this.state.workOrders}
              personnel={this.state.personnel}
              contact={this.state.contacts}
              divisions={this.state.divisions}
              onClose={this.onFilterClose.bind(this)}
              onFilterByRange={this.onFilterByRange.bind(this)}
              onSelectAssignedTechChange={this.onSelectAssignedTechChange.bind(this)}
              onFilterByDivision={this.onFilterByDivision.bind(this)}
              onFilterByPosition={this.onFilterByPosition.bind(this)}
              toggleShowComplete={this.toggleShowComplete.bind(this)}
              toggleShowCompleteOn={this.state.toggleShowCompleteOn}
              showCurrentWorkList={this.state.showCurrentWorkList}
              showPersonnelDashboard={this.state.showPersonnelDashboard}
              showCompletedWorkList={this.state.showCompletedWorkList}
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
                showAssignOrderModal={this.showAssignOrderModal.bind(this)}
                onEditWorkOrder={this.onEditWorkOrder.bind(this)}
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
              contacts={this.state.contacts}
              personnel={this.state.personnel}
              workOrders={this.state.workOrders}
              onClose={this.resetWorkOrderDashboard.bind(this)}
            />
          : null}
          {this.state.showContactsList ?
            <ContactsList
              contacts={this.state.contacts}
              personnel={this.state.personnel}
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
          {this.state.showMyProfile ?
            <MyProfile
              userKey={Meteor.user().profile.userKey}
              onMyProfileExit={this.onMyProfileExit.bind(this)}
            />
          : null}
          {this.state.showPersonnelDashboard ?
            <PersonnelList
              onPersonnelClick={this.onPersonnelClick.bind(this)}
              personnel={this.state.personnel}
            />
          : null}
          {this.state.showSelectedPersonnel ?
            <SelectedPersonnel
              selectedPersonnelKey={this.state.selectedPersonnelKey}
              onExit={this.resetPersonnelDashboard.bind(this)}
            />
          : null}
          {this.state.showNewPersonnel ?
            <NewPersonnel
              onExit={this.resetPersonnelDashboard.bind(this)}
            />
          : null}
					{this.state.showEditWorkOrder ?
						<EditWorkOrder
              contacts={this.state.contacts}
              personnel={this.state.personnel}
							onEditWorkOrder={this.onEditWorkOrder.bind(this)}
							onClose={this.resetWorkOrderDashboard.bind(this)}
              selectedWorkOrderId={this.state.selectedWorkOrderId}
						/>
					: null}
        </div>
      </div>
    )
  }

};
