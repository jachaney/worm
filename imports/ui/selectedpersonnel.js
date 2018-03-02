import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Input,Menu,Button,Icon,Divider,Switch,Modal,message } from 'antd';

import { Personnel } from './../api/personnel';

const { TextArea } = Input;

export default class SelectedPersonnel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      selectedPersonnel: [],
      showChangePasswordModal:false,
      showConfirmPasswordEye: false,
      showCreatePasswordEye: false,
      showSaveProfileModal: false
    }
  };

  componentDidMount() {
    let personnelKey = this.props.selectedPersonnelKey;
    this.selectedPersonnelTracker = Tracker.autorun(() => {
      let selectedPersonnelReady = Meteor.subscribe('Personnel');
      const selectedPersonnel = Personnel.find({userKey: personnelKey}).fetch();
      this.setState ({selectedPersonnel});
      selectedPersonnel.map((person) => {
        this.setState({isAdmin: person.isAdmin});
      })
    })
  }

  componentWillUnmount() {
    this.selectedPersonnelTracker.stop();
  }

  verifyData() {
    if (Meteor.user().profile.isAdmin) {
      this.state.selectedPersonnel.map((person) => {
        let isAdmin = this.state.isAdmin;
        let input = $("Input");
        let note = $("TextArea");
        let firstName = input[0].value.trim();
        let lastName = input[1].value.trim();
        let email = input[2].value.trim();
        let phone = input[3].value.trim();
        let address = input[4].value.trim();
        let division = input[5].value.trim();
        let notes = note[0].value.trim();
        if (firstName != person.firstName || lastName != person.lastName ||
          email != person.email || division != person.division ||
          phone != person.phone || notes != person.notes || address != person.address ||
          isAdmin != person.isAdmin) {
            return this.setState({showSaveProfileModal: true});
          } else {
            this.props.onExit();
          }
      })
    } else {
      this.props.onExit();
    }
  }

  changeUserPassword(e) {
    e.preventDefault();
    this.state.selectedPersonnel.map((person) => {
      let userKey = person.userKey;
      let input = $("Input");
      let newPassword = input[6].value.trim();
      let confirmPassword = input[7].value.trim();
      let complexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      SimpleSchema.setDefaultMessages({
        messages: {
          en: {
            "complexPasswordError": "Your password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.",
            "passwordMismatch": "Your passwords do not match. Please verify your password.",
          }
        }
      });
      try {
        new SimpleSchema({
          newPassword: {
            min: 6,
            type: String,
            custom() {
              if (!complexPassword.test(newPassword)) {
                return "complexPasswordError";
              }
              if (newPassword !== confirmPassword) {
                return "passwordMismatch";
              }
            }
          }
        }).validate({newPassword});
      } catch (e) {
        return message.error(e.message, 5);
        throw new Meteor.Error(400, e.message);
      }
      Meteor.call('personnel.resetpassword',userKey,newPassword);
      message.success("Password Reset",5);
      this.setState({showChangePasswordModal: false});
    })
  }

  hidePasswordModal(e) {
    this.setState({showChangePasswordModal: false});
  }

  onCreateEyeMouseDown() {
    let input = $("Input");
    input[6].setAttribute("type","text");
  }

  onCreateEyeMouseUp() {
    let input = $("Input");
    input[6].setAttribute("type","password");
  }

  onConfirmEyeMouseDown() {
    let input = $("Input");
    input[7].setAttribute("type","text");
  }

  onConfirmEyeMouseUp() {
    let input = $("Input");
    input[7].setAttribute("type","password");
  }

  onOldPassword(e) {
    if (e.target.value.length > 0) {
      this.setState({showOldPasswordEye: true});
    } else {
      this.setState({showOldPasswordEye: false});
    }
  }

  onCreatePassword(e) {
    if (e.target.value.length > 0) {
      this.setState({showCreatePasswordEye: true});
    } else {
      this.setState({showCreatePasswordEye: false});
    }
  }

  onConfirmPassword(e) {
    if (e.target.value.length > 0) {
      this.setState({showConfirmPasswordEye: true});
    } else {
      this.setState({showConfirmPasswordEye: false});
    }
  }

  render() {
    return this.state.selectedPersonnel.map((person) => {
      return <div
        className="pure-u-1 contactsDiv"
        key={person._id}
      >
        <Modal
          visible={this.state.showChangePasswordModal}
          title="Change Your Password"
          onOk={this.changeUserPassword.bind(this)}
          onCancel={this.hidePasswordModal.bind(this)}
        >
          <p>Please enter the new password:</p>
          <Input
            suffix={<Icon
               onMouseDown={this.onCreateEyeMouseDown.bind(this)}
               onMouseUp={this.onCreateEyeMouseUp.bind(this)}
               style={{
                 display: this.state.showCreatePasswordEye ? "block" : "none"
               }}
               type="eye"
             />
          }
            onChange={this.onCreatePassword.bind(this)}
            placeholder="Enter Your New Password..."
            type="password"
            style={{
             marginBottom: ".5rem"
           }}
          />
          <p className="passwordInstructions">
            *The password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.
          </p>
          <p>Confirm the new password:</p>
          <Input
            suffix={<Icon
                onMouseDown={this.onConfirmEyeMouseDown.bind(this)}
                onMouseUp={this.onConfirmEyeMouseUp.bind(this)}
                style={{
                  display: this.state.showConfirmPasswordEye ? "block" : "none"
                }}
                type="eye"
              />
            }
            onChange={this.onConfirmPassword.bind(this)}
            placeholder="Confirm Your Password..."
            type="password"
            style={{
              marginBottom: ".5rem"
            }}
          />
        </Modal>
        <Modal
          visible={this.state.showSaveProfileModal}
          onOk={() => {}}
          onCancel={() => {}}
          footer={[
            <Button
              key="save"
              type="primary"
              onClick={() => {
                this.state.selectedPersonnel.map((person) => {
                  let userKey = person.userKey;
                  let isAdmin = this.state.isAdmin;
                  let personnelId = person.personnelId;
                  let input = $("Input");
                  let note = $("TextArea");
                  let firstName = input[0].value.trim();
                  let lastName = input[1].value.trim();
                  let email = input[2].value.trim();
                  let phone = input[3].value.trim();
                  let address = input[4].value.trim();
                  let division = input[5].value.trim();
                  let notes = note[0].value.trim();
                  Meteor.call('userprofile.update',userKey,firstName,lastName,email,
                    phone,address,division,notes,isAdmin,personnelId);
                  Meteor.call('personnel.update',userKey,firstName,lastName,email,
                    phone,address,division,notes,isAdmin,personnelId);
                  message.success("Profile updated", 5);
                  this.props.onExit();
                })
              }}
            >
              <Icon type="save"/>
              Save
            </Button>,
            <Button
              key="discard"
              type="danger"
              onClick={() => {
                this.props.onExit();
              }}
            >
              <Icon type="delete"/>
              Discard
            </Button>
          ]}
        >
          <p>Save changes to your profile?</p>
        </Modal>
        <div
          className="contactsHeader"
        >
          <h1>{person.lastName}, {person.firstName}</h1>
          {Meteor.user().profile.isAdmin ?
            <p>Login: {Meteor.user().emails[0].address}</p>
          : null}
          {Meteor.user().profile.isAdmin ?
            <p>Personnel ID# {person.personnelId}</p>
          : null}
        </div>
        <Divider/>
        <div
          className="contactsDivButton"
        >
          <Button
            className="contactsButton"
            onClick={this.verifyData.bind(this)}
            title="Back to the Dashboard"
          >
            <Icon type="dashboard"/>
            Dashboard
          </Button>
          <Button
            className="contactsButton"
            onClick={() => {this.setState({showChangePasswordModal:true})}}
            title="Reset Personnel's Password"
            style={{
              display: Meteor.user().profile.isAdmin ? null : "none"
            }}
          >
            <Icon type="key"/>
            Reset Password
          </Button>
        </div>
        <Divider/>
        <div
          className="contactsDivItems"
        >
          <span>Administrator:&nbsp;</span>
          <Switch
            disabled={Meteor.user().profile.isAdmin ? false : true}
            defaultChecked={person.isAdmin}
            onChange={(e) => {
              this.setState({isAdmin: e});
            }}
          />
          <p/>
          <p>First Name:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.firstName}
            />
          : <p>{person.firstName}</p>}
          <p>Last Name:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.lastName}
            />
          : <p>{person.lastName}</p>}
          <p>E-mail:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.email}
            />
          : <p>{person.email}</p>}
          <p>Phone:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.phone}
            />
          : <p>{person.phone}</p>}
          <p>Address:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.address}
            />
          : <p>{person.address}</p>}
          <p>Division:</p>
          {Meteor.user().profile.isAdmin ?
            <Input
              defaultValue={person.division}
            />
          : <p>{person.division}</p>}
        </div>
        <div
          className="contactsDivItems"
        >
          <Divider>
            <h3>Notes:</h3>
          </Divider>
          {Meteor.user().profile.isAdmin ?
            <TextArea
              defaultValue={person.notes}
            />
          : <p>{person.notes}</p>}
        </div>
        <div
          className="pure-u-1 contactsDivButton"
        >
          <Button
            className="contactsButton"
            onClick={this.verifyData.bind(this)}
            title="Back to the Dashboard"
          >
            <Icon type="dashboard"/>
            Dashboard
          </Button>
          <Button
            className="contactsButton"
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
