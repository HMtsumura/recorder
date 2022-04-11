import React, {Component} from 'react';
import axios from 'axios';

const server = 'http://localhost:3000/contents';

interface State{
  result: Array<obj>,
  color_code: String
}

interface obj{
  id: Number,
  title: string,
  color_code: string,
  comment: string,
  record_ymd: string,
}

class App extends Component {
  state: State ={
    result: [],
    color_code: '',
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: [],
      color_code: '',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    axios.get(server)
      .then((res) => {
        this.setState({
          status: true,
          result: res.data,
          color_code: res.data[0].color_code
        });
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
    return (
      <div>
        <button onClick={this.handleClick}>Get Data</button>
        {this.state.result.map((elem: obj)=>(
          <ul>
            <li>{elem.id}</li>
            <li>{elem.title}</li>
            <li style={{backgroundColor: elem.color_code}}>{elem.color_code}</li>
            <li>{elem.comment}</li>
            <li>{elem.record_ymd}</li>
          </ul>
        ))}
      </div>
    );
  }
}

export default App;