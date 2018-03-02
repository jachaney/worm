import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Input,Menu,Button,Icon,Divider,Modal,message } from 'antd';

import { Personnel } from './../api/personnel';

const { TextArea } = Input;

export default class MyProfile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      myProfileInfo: [],
      showCreatePasswordEye: false,
      showConfirmPasswordEye: false,
      showChangePasswordModal: false,
      showOldPasswordEye: false,
      showSaveProfileModal: false
    }
  };

  componentDidMount() {
    this.myProfileTracker = Tracker.autorun(() => {
      let myProfileReady = Meteor.subscribe('Personnel');
      let myProfileInfo = Personnel.find({_id: this.props.id}).fetch();
      this.setState({myProfileInfo});
    })
  }

  componentWillUnmount() {
    this.myProfileTracker.stop();
  }

  verifyData() {
    if (Meteor.user().profile.isAdmin) {
      let _id = Meteor.user()._id;
      let user = Meteor.user().profile;
      let input = $("Input");
      let note = $("TextArea");
      let firstName = input[0].value.trim();
      let lastName = input[1].value.trim();
      let email = input[2].value.trim();
      let phone = input[3].value.trim();
      let address = input[4].value.trim();
      let division = input[5].value.trim();
      let notes = note[0].value.trim();
      if (firstName != user.firstName || lastName != user.lastName ||
        email != user.email || division != user.division ||
        phone != user.phone || notes != user.notes || address != user.address) {
          return this.setState({showSaveProfileModal: true});
        } else {
          this.props.onMyProfileExit();
        }
    } else {
      this.props.onMyProfileExit();
    }
  }

  hidePasswordModal(e) {
    this.setState({showChangePasswordModal: false});
  }

  onOldEyeMouseDown() {
    let input = $("Input");
    input[5].setAttribute("type","text");
  }

  onOldEyeMouseUp() {
    let input = $("Input");
    input[5].setAttribute("type","password");
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

  changeUserPassword(e) {
    e.preventDefault();
    let input = $("Input");
    let oldPassword = input[5].value.trim();
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
      return message.error(e.message, 10);
      throw new Meteor.Error(400, e.message);
    }
    Accounts.changePassword(oldPassword, newPassword, function(err) {
      if (err) {
        return alert(err.reason);
      } else {
        input[5].value = "";
        input[6].value = "";
        input[7].value = "";
        this.setState({showChangePasswordModal: false});
        return message.success("Password changed",5);
      }
    }.bind(this));
  }

  render() {
    return this.state.myProfileInfo.map((user) => {
      return <div
        className="pure-u-1 myProfileDiv"
        key={user._id}
      >
        <Modal
          visible={this.state.showChangePasswordModal}
          title="Change Your Password"
          onOk={this.changeUserPassword.bind(this)}
          onCancel={this.hidePasswordModal.bind(this)}
        >
          <p>Please enter your current password:</p>
          <Input
            suffix={<Icon
               onMouseDown={this.onOldEyeMouseDown.bind(this)}
               onMouseUp={this.onOldEyeMouseUp.bind(this)}
               style={{
                 display: this.state.showOldPasswordEye ? "block" : "none"
               }}
               type="eye"
             />
          }
            onChange={this.onOldPassword.bind(this)}
            placeholder="Enter Your Current Password..."
            type="password"
            style={{
             marginBottom: ".5rem"
           }}
          />
          <p>Please enter your new password:</p>
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
            *Your password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.
          </p>
          <p>Confirm your new password:</p>
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
                let userKey = Meteor.user().profile.userKey;
                let isAdmin = Meteor.user().profile.isAdmin;
                let personnelId = Meteor.user().profile.personnelId;
                let input = $("Input");
                let note = $("TextArea");
                let firstName = input[0].value.trim();
                let lastName = input[1].value.trim();
                let email = input[2].value.trim();
                let phone = input[3].value.trim();
                let address = input[4].value.trim()
                let division = input[5].value.trim();
                let notes = note[0].value.trim();
                Meteor.call('userprofile.update',userKey,firstName,lastName,email,
                  phone,address,division,notes,isAdmin,personnelId);
                Meteor.call('personnel.update',userKey,firstName,lastName,email,
                  phone,address,division,notes,isAdmin,personnelId);
                message.success("Profile updated", 5);
                this.props.onMyProfileExit();
              }}
            >
              <Icon type="save"/>
              Save
            </Button>,
            <Button
              key="discard"
              type="danger"
              onClick={() => {
                this.props.onMyProfileExit();
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
          <h1>{user.lastName}, {user.firstName}</h1>
          <p>Login: {Meteor.user().emails[0].address}</p>
          <p>Personnel ID# {user.personnelId}</p>
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
            title="Change Password"
          >
            <Icon type="key"/>
            Change Your Password
          </Button>
        </div>
        <Divider/>
        <div
          className="contactsDivItems"
        >
          <p>First Name:</p>
          {user.isAdmin ?
            <Input
              defaultValue={user.firstName}
            />
          : <p>{user.firstName}</p>
          }
          <p>Last Name:</p>
          {user.isAdmin ?
            <Input
              defaultValue={user.lastName}
            />
          : <p>{user.lastName}</p>
          }
          <p>E-mail:</p>
          {user.isAdmin ?
            <div>
              <Input
                defaultValue={user.email}
              />
              <p className="passwordInstructions">
                *Changing your e-mail here will not change the e-mail address that you use to login.
              </p>
            </div>
          : <p>{user.email}</p>
          }
          <p>Phone:</p>
          {user.isAdmin ?
            <Input
              defaultValue={user.phone}
            />
          : <p>{user.phone}</p>
          }
          <p>Address:</p>
          {user.isAdmin ?
            <Input
              defaultValue={user.address}
            />
          : <p>{user.address}</p>
          }
          <p>Division:</p>
          {user.isAdmin ?
            <Input
              defaultValue={user.division}
            />
          : <p>{user.division}</p>
          }
        </div>
        <div
          className="contactsDivItems"
        >
          <Divider>
            <h3>Notes:</h3>
          </Divider>
          {user.isAdmin ?
            <TextArea
              defaultValue={user.notes === undefined ? "" : user.notes}
            />
          : <p>{user.notes}</p>
          }
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
