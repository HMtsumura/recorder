import React, {Component} from 'react';
import axios from 'axios';

// const server = 'http://localhost:8088/users';

interface State{
  result: string 
}

class App extends Component {
  state: State ={
    result: ''
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: '',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    axios.get('/users')
      .then((res) => {
        this.setState({
          status: true,
          result: res.data
        });
        console.log(this.state);
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          status: false,
          result: e,
        });
      });
  }

  render() {
    const result = <div>{this.state.result}</div>
    return (
      <div>
        <button onClick={this.handleClick}>Get Data</button>
        {result}
      </div>
    );
  }
}

export default App;