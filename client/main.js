import  createHistory  from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker';

import { Routing } from '../imports/routing/routing';

Meteor.startup(() => {
  Tracker.autorun(() => {
      ReactDOM.render(Routing, document.getElementById('worm'))
    });
});
