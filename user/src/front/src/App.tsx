import React, {Component} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, DatePickerProps} from '@mui/x-date-pickers';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


// TODO 変数名考える必要あり
const server = 'http://localhost:3000/contents';
const categorizedContents = 'http://localhost:3000/contents/categorized';
interface State{
  result: Array<recordObj>,
  categories: Array<categoryObj>,
  color_code: String,
  open: boolean,
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
    open: false
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: [],
      categories: [],
      color_code: '',
      open: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleDateChange= this.handleDateChange.bind(this);
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
        categories: res.data[1],
        open: true
      });
    })      .catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        result: e,
      });
    });
  }
  
  handleOpen = () => { 
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleDateChange = (newValue: Date|null)=>{
    this.setState({date: newValue});
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
        <Button onClick={this.handleOpen}>Open modal</Button>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <div>
              <TextField 
                id="title-field" 
                label="Title"
                required
              >
              </TextField>
            </div>
            <TextField
                id="comment-field"
                label="Comment"
                multiline
                rows={5}
                defaultValue=""
            />
            <div>
              <Button 
              fullWidth 
              variant="contained" 
              onClick={this.handleOpen}
              >
                登録
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default App;