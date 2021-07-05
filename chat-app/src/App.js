import React, { Component } from 'react';
import './App.css';
import {Sidebar} from './components/Sidebar/Sidebar'
import {Grid} from 'semantic-ui-react'
import Messages from './components/Messages/Messages'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid columns="equal">
          <Sidebar />
          <Grid.Column className="mainPanel">
            <Messages/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;