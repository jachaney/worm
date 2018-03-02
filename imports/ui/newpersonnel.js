import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Input,Button,Icon,Divider,Switch,Modal,message } from 'antd';

const { TextArea } = Input;

export default class NewPersonnel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showCreatePasswordEye: false,
      showConfirmPasswordEye: false,
      showSaveProfileModal: false,
      isAdmin: false
    }
  };

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

  renderButtons() {
    return <div
      className="contactsDivButton"
    >
      <Modal
        visible={this.state.showSaveProfileModal}
        title="Confirm"
        onOk={() => {
          let input = $("Input");
          let note = $("TextArea");
          let isAdmin = this.state.isAdmin;
          let firstName = input[0].value.trim();
          let lastName = input[1].value.trim();
          let email = input[2].value.trim();
          let phone = input[3].value.trim();
          let address = input[4].value.trim();
          let division = input[5].value.trim();
          let password = input[6].value.trim();
          let confirmPassword = input[7].value.trim();
          let notes = note[0].value.trim();
          Meteor.call('personnel.add',email,password,confirmPassword,firstName,
            lastName,phone,address,division,notes,isAdmin);
          this.props.onExit();
        }}
        onCancel={() => {
          this.setState({showSaveProfileModal: false});
        }}
      >
        <Icon
          className="modalIcon"
          type="user-add"
        />
        Confirm creation of your new personnel.
      </Modal>
      <Button
        className="contactsButton"
        onClick={() => {
          this.setState({showSaveProfileModal: true});
        }}
        title="Save Personnel"
        type="primary"
      >
        <Icon type="user-add"/>
        Save
      </Button>
      <Button
        className="contactsButton"
        onClick={() => {
          this.props.onExit();
        }}
        title="Cancel"
        type="danger"
      >
        <Icon type="close-circle-o"/>
        Cancel
      </Button>
    </div>
  }

  render() {
    return <div
      className="pure-u-1 contactsDiv"
    >
      <div
        className="contactsHeader"
      >
        <h1>Add Personnel</h1>
      </div>
      <Divider/>
        {this.renderButtons()}
      <Divider/>
      <div
        className="contactsDivItems"
      >
        <span>Administrator:&nbsp;</span>
        <Switch
          defaultChecked={this.state.isAdmin}
          onChange={(e) => {
            this.setState({isAdmin: e});
          }}
        />
        <p/>
        <p>First Name:</p>
        <Input/>
        <p>Last Name:</p>
        <Input/>
        <p>E-mail:</p>
        <Input/>
        <p className="passwordInstructions">
          *This will be your new personnel's login e-mail.
        </p>
        <p>Phone:</p>
        <Input/>
        <p>Address:</p>
        <Input/>
        <p>Division:</p>
        <Input/>
        <p>Please enter a password for your new personnel:</p>
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
          placeholder="Enter a password for your new personnel..."
          type="password"
          style={{
           marginBottom: ".5rem"
         }}
        />
        <p className="passwordInstructions">
          *The password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.
        </p>
        <p>Confirm the password for your new personnel:</p>
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
          placeholder="Confirm the password for your new personnel..."
          type="password"
          style={{
            marginBottom: ".5rem"
          }}
        />
      </div>
      <div
        className="contactsDivItems"
      >
        <Divider>
          <h3>Notes:</h3>
        </Divider>
        <TextArea/>
      </div>
      {this.renderButtons()}
    </div>
  }

}
