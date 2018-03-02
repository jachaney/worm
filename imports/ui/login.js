import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { browserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import  createHistory  from 'history/createBrowserHistory';
import { Menu,Icon,Modal,Dropdown,Card,Input,message } from 'antd';
import SimpleSchema from 'simpl-schema';
import React from 'react';

import { Tracker } from 'meteor/tracker';

const history = createHistory();
const { Meta } = Card;
const confirm = Modal.confirm;
const { TextArea } = Input;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateAccount: false,
      showCreatePasswordEye: false,
      showConfirmPasswordEye: false,
      showLoginEye: false
    }
  };

  componentDidMount() {
    document.addEventListener('keypress',(e) => {
      var key = e.which || e.keyCode;
      if (key === 13 && this.state.showCreateAccount === false) { // 13 is enter
        this.onLogin(e);
      } else if (key === 13 && this.state.showCreateAccount === true) {
        this.onCreateAccount(e);
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keypress',(e) => {
      var key = e.which || e.keyCode;
      if (key === 13 && this.state.showCreateAccount === false) { // 13 is enter
        this.onLogin(e);
      } else if (key === 13 && this.state.showCreateAccount === true) {
        this.onCreateAccount(e);
      }
    });
  }

  onLoginEyeMouseDown() {
    document.getElementById('loginPassword').setAttribute("type","text");
  }

  onLoginEyeMouseUp() {
    document.getElementById('loginPassword').setAttribute("type","password");
  }

  onCreateEyeMouseDown() {
    document.getElementById('createAccountPassword').setAttribute("type","text");
  }

  onCreateEyeMouseUp() {
    document.getElementById('createAccountPassword').setAttribute("type","password");
  }

  onConfirmEyeMouseDown() {
  document.getElementById('createAccountPasswordConfirm').setAttribute("type","text");
  }

  onConfirmEyeMouseUp() {
    document.getElementById('createAccountPasswordConfirm').setAttribute("type","password");
  }

  onEnterLoginPassword(e) {
    if (e.target.value.length > 0) {
      this.setState({showLoginEye: true});
    } else {
      this.setState({showLoginEye: false});
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

  onCreateAccount(e) {
    e.preventDefault();

    let email = document.getElementById('createEmail').value.trim();
    let password = document.getElementById('createAccountPassword').value.trim();
    let confirmPassword = document.getElementById('createAccountPasswordConfirm').value.trim();
    let firstName = document.getElementById('createFirstName').value.trim();
    let lastName = document.getElementById('createLastName').value.trim();
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
        email: {
          min: 1,
          type: String,
          regEx: SimpleSchema.RegEx.EmailWithTLD
        },
        password: {
          min: 6,
          type: String,
          custom() {
            if (!complexPassword.test(password)) {
              return "complexPasswordError";
            }
            if (password !== confirmPassword) {
              return "passwordMismatch";
            }
          }
        },
        firstName: {
          min: 1,
          type: String
        },
        lastName: {
          min: 1,
          type: String
        }
      }).validate({email,password,firstName,lastName});
    } catch (e) {
      message.error(e.message, 10);
      throw new Meteor.Error(400, e.message);
    }
    Accounts.createUser({
      email,
      password,
      profile: {
        firstName,
        lastName,
        email,
        phone: '',
        division: '',
        notes: '',
        isAdmin: true,
        userKey: Random.secret(),
        orgKey: Random.secret(),
        personnelId: Random.id(6)
      }
    }, (err) => {
      if (err) {
        return message.error(err.reason);
      } else {
        this.props.history.push('/dashboard');
        this.props.history.go();
      }
    });
  }

  onLogin(e) {
    e.preventDefault();

    let email = document.getElementById('loginEmail').value.trim();
    let password = document.getElementById('loginPassword').value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        if (!email) {
          return message.error("Please enter your e-mail.");
        } else if (!password) {
          return message.error("Please enter your password.");
        };
          message.error(err.reason);
          return document.getElementById('loginPassword').value = "";
      } else {
          this.props.history.push('/dashboard');
          this.props.history.go()
      }
    });
  }

  render() {
    return (
      <div
        className="pure-u-1 loginDiv"
      >
        <img
          className="backgroundImage"
          id="backgroundImage"
          src="background.jpg"
        />
        <Card
          actions={[
            <Icon
              onClick={this.onLogin.bind(this)}
              title="Login to Your Account"
              type="login"
            >Login</Icon>,
            <Icon
              onClick={() => {
                this.setState({showCreateAccount: true});
              }}
              title="Create an Account"
              type="user-add"
            >Create Account</Icon>
          ]}
          className="loginCard"
          id="loginCard"
          style={{
            display: this.state.showCreateAccount ? "none" : "block"
          }}
        >
          <Input
            id="loginEmail"
            placeholder="Enter Your E-mail Address Here..."
          />
          <Input
            suffix={<Icon
                onMouseDown={this.onLoginEyeMouseDown.bind(this)}
                onMouseUp={this.onLoginEyeMouseUp.bind(this)}
                style={{
                  display: this.state.showLoginEye ? "block" : "none"
                }}
                type="eye"
              />
            }
            id="loginPassword"
            onChange={this.onEnterLoginPassword.bind(this)}
            placeholder="Enter Your Password Here..."
            type="password"
          >
          </Input>
        </Card>
        <Card
          actions={[
            <Icon
              onClick={() => {
                this.setState({showCreateAccount: false});
              }}
              title="Back to Login"
              type="left-square-o"
              >Back</Icon>,
            <Icon
              onClick={this.onCreateAccount.bind(this)}
              title="Create an Account"
              type="user-add"
              >Create Account<br/>and Login</Icon>
            ]}
          className="loginCard"
          id="createAccountCard"
          style={{
            display: this.state.showCreateAccount ? "block" : "none"
          }}
        >
          <Input
            id="createEmail"
            placeholder="Enter Your E-mail Address Here..."
          />
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
            id="createAccountPassword"
            onChange={this.onCreatePassword.bind(this)}
            placeholder="Enter Your Password Here..."
            type="password"
            style={{
              marginBottom: ".5rem"
            }}
          />
          <p className="passwordInstructions">
            *Your password must be at least 6 characters long and contain at least one lower case letter, one upper case letter, and one number.
          </p>
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
            id="createAccountPasswordConfirm"
            onChange={this.onConfirmPassword.bind(this)}
            placeholder="Confirm Your Password..."
            type="password"
            style={{
              marginBottom: ".5rem"
            }}
          />
          <Input
            id="createFirstName"
            placeholder="Enter Your First Name Here..."
          />
          <Input
            id="createLastName"
            placeholder="Enter Your Last Name Here..."
          />
        </Card>
      </div>
    )
  }
}
