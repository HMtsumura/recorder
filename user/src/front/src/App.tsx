import React, {Component} from 'react';
import axios from 'axios';
// TODO 変数名考える必要あり
const server = 'http://localhost:3000/contents';
const categorizedContents = 'http://localhost:3000/contents/categorized';

interface State{
  result: Array<recordObj>,
  categories: Array<categoryObj>,
  color_code: String
}

interface recordObj{
  id: Number,
  title: string,
  color_code: string,
  comment: string,
  category_name: string,
  record_ymd: string,
}

interface categoryObj{
  id: string,
  category_name: string
}
class App extends Component {
  state: State ={
    result: [],
    categories: [],
    color_code: '',
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: [],
      categories: [],
      color_code: '',
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange= this.handleChange.bind(this);
  }

  handleClick() {
    axios.get(server)
      .then((res) => {
        console.log(res.data[1]);
        this.setState({
          status: true,
          result: res.data[0],
          categories: res.data[1],
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

  handleChange(e: React.ChangeEvent<HTMLSelectElement>){
    const selectedId: string|null = e.target[e.target.selectedIndex].getAttribute('id');
    axios.get(categorizedContents, {
      params: {
        id: selectedId
      }
    }).then((res)=>{
      console.log(res.data[1]);
      this.setState({
        status: true,
        result: res.data[0],
        categories: res.data[1]
      });
    })      .catch((e) => {
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
        <select onChange={(e) => this.handleChange(e)}>
        {this.state.categories.map((category: categoryObj)=>(
          <option id={category.id} value={category.category_name}>{category.category_name}</option>
        ))}
        </select>
        {this.state.result.map((elem: recordObj)=>(
          <ul>
            <li>{elem.id}</li>
            <li>{elem.category_name}</li>
            <li style={{backgroundColor: elem.color_code}}>{elem.title}</li>
            <li>{elem.comment}</li>
            <li>{elem.record_ymd}</li>
          </ul>
        ))}
      </div>
    );
  }
}

export default App;