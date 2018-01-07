import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';

const history = createHistory();

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  };

  componentDidMount() {
    this.dashTracker = Tracker.autorun(() => {

    })
  }

  componentWillUnmount() {
    this.dashTracker.stop();
  }

  render() {
    return (
      <div>
        <p>Content will go here...</p>
      </div>
    )
  }
};
