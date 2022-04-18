import React, {Component, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {DatePicker} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Color, ColorPicker, createColor } from 'material-ui-color';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { threadId } from 'worker_threads';

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

// TODO メソッド名・変数名考える必要あり
// TODO 要素のコンポーネント化
// TODO classじゃなくてexport default functionでreturnで返すようにする
// TODO タグ選択・作成
// TODO 登録内容編集・削除
// TODO　日別の枠出力
// TODO 日別にデータ分ける
// TODO 日別でデータ取得
// TODO ユーザー作成・編集
// TODO バリデーション
// TODO デザイン
// TODO セッション
// TODO SQLインジェクション対策等
const server = 'http://localhost:3000/contents';
const categorizedContents = 'http://localhost:3000/contents/categorized';
const registContent = 'http://localhost:3000/contents/regist';

const palette = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: 'yellow',
  cyan: 'cyan',
  lime: 'lime',
  gray: 'gray',
  orange: 'orange',
  purple: 'purple',
  black: 'black',
  white: 'white',
  pink: 'pink',
  darkblue: 'darkblue',
};

interface State{
  result: Array<recordObj>,
  categories: Array<categoryObj>,
  open: boolean,
  date: any,
  color: Color,
  selected_category: string,
  selected_category_id: string
}

interface recordObj{
  id: Number,
  title: string,
  color_code: string,
  comment: string,
  category_name: string,
  record_ymd: string
}

interface categoryObj{
  id: string,
  category_name: string
}

class App extends Component {
  state: State ={
    result: [],
    categories: [],
    open: false,
    date: null,
    color: createColor("red"),
    selected_category: "",
    selected_category_id: ""
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: [],
      categories: [],
      open: false,
      date: new Date(),
      color: createColor("red"),
      selected_category: "",
      selected_category_id: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleDateChange= this.handleDateChange.bind(this);
    this.getAllContents();
  }

  getAllContents(){
    axios.get(server)
      .then((res) => {
        console.log(res.data[1]);
        this.setState({
          status: true,
          result: res.data[0],
          categories: res.data[1]
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
  handleClick() {
    this.getAllContents();    
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>){
    const selectedId: string|null = e.target[e.target.selectedIndex].getAttribute('id');
    axios.get(categorizedContents,{
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
    }).catch((e) => {
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

  handleDateChange = (newDate: Date|null)=>{
    this.setState({date: newDate});
  }

  handleColorChange = (newColor: Color)=>{
    this.setState({color: newColor});
  }

  handleCategorySelect = (event: SelectChangeEvent, child: any)=>{
    console.log(child.props.id);
    this.setState(
      { 
        selected_category: event.target.value
      , selected_category_id: child.props.id
      }
    );
  }

  handleRegist = (event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const formattedDate = [
      this.state.date.getFullYear(),
      ('0' + (this.state.date.getMonth() + 1)).slice(-2),
      ('0' + this.state.date.getDate()).slice(-2)
    ].join('');
    const formData = new FormData(event.currentTarget);
    console.log({
      title: formData.get('title'),
      comment: formData.get('comment'),
      color: this.state.color.hex,
      date: formattedDate
    });
    axios.get(registContent,{
      params: {
        user_id: '1',
        title: formData.get('title'),
        comment: formData.get('comment'),
        color_code: this.state.color.hex,
        record_ymd: formattedDate,
        category_id: this.state.selected_category_id
      }
    }).then((res)=>{
      this.handleClose();
      this.getAllContents();
      console.log(res);
    }).catch((e)=>{
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
        <AddCircleIcon onClick={this.handleOpen}></AddCircleIcon>
        <Button onClick={this.handleOpen}>Open modal</Button>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box component="form" onSubmit={this.handleRegist} noValidate sx={ style }>
            <FormControl fullWidth>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                記録
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="date"
                  value={this.state.date}
                  onChange={(newValue: any) => {
                    this.setState({date: newValue});
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="selected_category"
                value={this.state.selected_category}
                label="category"
                onChange={this.handleCategorySelect}
              >
                {this.state.categories.map((category: categoryObj)=>(
                  <MenuItem id={category.id} value={category.category_name}>{category.category_name}</MenuItem>
                ))}
              </Select>
              <ColorPicker
                value={this.state.color} 
                onChange={this.handleColorChange}
                palette={palette}
                hideTextfield/>
              <div>
                <TextField 
                  id="title-field" 
                  label="Title"
                  name="title"
                  required
                >
                </TextField>
              </div>
              <TextField
                  id="comment-field"
                  label="Comment"
                  name="comment"
                  multiline
                  rows={5}
                  defaultValue=""
              />
              <div>
                <Button
                fullWidth
                type="submit"
                variant="contained" 
                onClick={this.handleOpen}
                >
                  登録
                </Button>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default App;