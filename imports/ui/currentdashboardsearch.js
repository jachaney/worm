import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Menu, Icon, Dropdown, Input, Button} from 'antd';


const history = createHistory();
const Search = Input.Search;

export default class CurrentDashboardSearch extends React.Component{

  render() {
    return (
      <div
        id="searchDiv"
        className="searchDiv"
      >
        <div
          className="pure-u-sm-2-3 pure-u-lg-21-24 searchInput"
        >
          <Input
            id="searchInput"
            onChange={() => {
              let e = document.getElementById('searchInput').value;
              this.props.onSearchEnter(e);
            }}
            placeholder="Type your search here..."
            addonAfter={
              <Icon
                onClick={() => {
                  document.getElementById('searchInput').value="";
                  let e = document.getElementById('searchInput').value;
                  this.props.onSearchEnter(e);
                }}
                title="Clear Search"
                type="rollback"
              />
            }
          />
        </div>
        <div
          className="pure-u-sm-1-3 pure-u-lg-3-24 searchCloseButton"
        >
          <Button
            onClick={() => {
              this.props.onClose();
            }}
            title="Close Search"
          >
            <Icon
              type="close-circle-o"
            />
            <span>Close Search</span>
          </Button>
        </div>
      </div>
    )
  }
}
