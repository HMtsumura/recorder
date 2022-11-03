import React, { Component } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Color, ColorPicker, createColor } from 'material-ui-color';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { ThirdPartyDraggable } from '@fullcalendar/interaction';
import Stack from '@mui/material/Stack';
import Select from 'react-select';

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
// TODO ユーザー編集
// TODO バリデーション　サインイン・サインアップ・レコード入力・編集
// TODO デザイン
// TODO セッション管理して、セッションない間はURL直うちでもログイン画面に戻されるようにする
// TODO SQLインジェクション対策等
// TODO ユーザーの重複登録ができないようにする
// TODO ログインに失敗した時の処理
// TODO フロントで期待する値が入力されてない時のエラー(必須項目入力せずに登録しようとしたりとか)、サーバー側で受け付けない場合のエラー(ユーザーの重複など)

const server = 'http://localhost:3000/contents';
const categorizedContents = 'http://localhost:3000/contents/categorized';
const registContent = 'http://localhost:3000/contents/regist';
const editContent = 'http://localhost:3000/contents/edit';
const deleteContent = 'http://localhost:3000/contents/delete';
const contentById = 'http://localhost:3000/contents/contentById';
const registCategory = 'http://localhost:3000/categories/regist';

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

interface State {
  result: Array<recordObj>,
  categories: Array<categoryObj>,
  openRegistForm: boolean,
  openEditForm: boolean,
  date: any,
  color: Color,
  selected_category: string,
  selected_category_id: string,
  regist_title: string,
  regist_comment: string,
  regist_selected_category_name: string,
  regist_selected_category_id: string,
  edit_id: string,
  edit_title: string,
  edit_color: Color,
  edit_comment: string,
  edit_ymd: any,
  edit_selected_category_name: string,
  edit_selected_category_id: string
}

interface recordObj {
  id: string,
  title: string,
  color_code: string,
  comment: string,
  label: string,
  value: string,
  record_ymd: string
}

interface categoryObj {
  value: string,
  label: string
}

class App extends Component {
  state: State = {
    result: [],
    categories: [],
    openRegistForm: false,
    openEditForm: false,
    date: null,
    color: createColor("red"),
    selected_category: "",
    selected_category_id: "",
    regist_title: "",
    regist_comment: "",
    regist_selected_category_name: "",
    regist_selected_category_id: "",
    edit_id: "",
    edit_title: "",
    edit_ymd: null,
    edit_comment: "",
    edit_selected_category_name: "",
    edit_color: createColor("red"),
    edit_selected_category_id: "",
  }
  constructor(props: any, state: State) {
    super(props);
    this.state = {
      result: [],
      categories: [],
      openRegistForm: false,
      openEditForm: false,
      date: new Date(),
      color: createColor("red"),
      selected_category: "",
      selected_category_id: "",
      regist_title: "",
      regist_comment: "",
      regist_selected_category_name: "",
      regist_selected_category_id: "",
      edit_id: "",
      edit_title: "",
      edit_ymd: null,
      edit_comment: "",
      edit_selected_category_name: "",
      edit_color: createColor("red"),
      edit_selected_category_id: ""
    };

    this.handleClick = this.handleClick.bind(this);
    // this.handleChange= this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getAllContents();
  }

  getAllContents() {
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
  handleClick(event: any) {
    event.preventDefault();
    console.log(this.state.date);
    let ymd;
    if (typeof this.state.date === 'string') {
      ymd = this.state.date;
    } else {
      const y = this.state.date.getFullYear();
      const m = ('0' + (this.state.date.getMonth() + 1)).slice(-2);
      const d = ('0' + this.state.date.getDate()).slice(-2);
      ymd = y + '-' + m + '-' + d;
    }
    axios.get(registContent, {
      params: {
        user_id: '1',
        title: this.state.regist_title,
        comment: this.state.regist_comment,
        color_code: this.state.color.hex,
        record_ymd: ymd,
        category_id: this.state.regist_selected_category_id
      }
    }).then((res) => {
      this.handleCloseRegitForm();
      this.getAllContents();
      console.log(res);
    }).catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        result: e,
      });
    });
  }

  handleOpenRegistForm = () => {
    this.setState({
      openRegistForm: true,
      date: new Date(),
      regist_title: "",
      regist_comment: ""
    });
    console.log(this.state);
  };

  handleCloseRegitForm = () => {
    this.setState({ openRegistForm: false });
  };

  handleDateChange = (newDate: Date | null) => {
    this.setState({ date: newDate });
  }

  handleColorChange = (newColor: Color) => {
    this.setState({ color: newColor });
  }

  handleEditColorChange = (newColor: Color) => {
    this.setState({ edit_color: newColor });
  }

  handleRegist = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let ymd;
    if (typeof this.state.date === 'string') {
      ymd = this.state.date;
    } else {
      const y = this.state.date.getFullYear();
      const m = ('0' + (this.state.date.getMonth() + 1)).slice(-2);
      const d = ('0' + this.state.date.getDate()).slice(-2);
      ymd = y + '-' + m + '-' + d;
    }
    const formData = new FormData(event.currentTarget);
    axios.get(registContent, {
      params: {
        user_id: '1',
        title: formData.get('title'),
        comment: formData.get('comment'),
        color_code: this.state.color.hex,
        record_ymd: ymd,
        category_id: this.state.regist_selected_category_id
      }
    }).then((res) => {
      this.handleCloseRegitForm();
      this.getAllContents();
    }).catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        result: e,
      });
    });
  }

  handleOpenEditForm = (record: recordObj) => {
    const y = record.record_ymd.split('-')[0]
    const m = record.record_ymd.split('-')[1];
    const d = record.record_ymd.split('-')[2];
    this.setState({
      openEditForm: true,
      edit_id: record.id,
      edit_title: record.title,
      edit_comment: record.comment,
      edit_color: createColor(record.color_code),
      edit_ymd: `${m}/${d}/${y}`,
      edit_selected_category_name: record.label,
      edit_selected_category_id: record.value
    });
  }

  handleCloseEditForm = () => {
    this.setState({ openEditForm: false });
  }

  handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let ymd;
    if (typeof this.state.edit_ymd === 'string') {
      const split_ymd = this.state.edit_ymd.split('/');
      ymd = split_ymd[2] + '-' + split_ymd[0] + '-' + split_ymd[1];
    } else {
      const y = this.state.edit_ymd.getFullYear();
      const m = ('0' + (this.state.edit_ymd.getMonth() + 1)).slice(-2);
      const d = ('0' + this.state.edit_ymd.getDate()).slice(-2);
      ymd = y + '-' + m + '-' + d;
    }

    const formData = new FormData(event.currentTarget);
    axios.get(editContent, {
      params: {
        content_id: this.state.edit_id,
        title: formData.get('edit_title'),
        comment: formData.get('edit_comment'),
        color_code: this.state.edit_color.hex,
        record_ymd: ymd,
        category_id: this.state.edit_selected_category_id
      }
    }).then((res) => {
      this.handleCloseEditForm();
      this.getAllContents();

    }).catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        result: e,
      });
    });
  }

  handleDelete = () => {
    axios.get(deleteContent, {
      params: {
        content_id: this.state.edit_id,
      }
    }).then((res) => {
      this.handleCloseEditForm();
      this.getAllContents();
      console.log(res);
    }).catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        result: e,
      });
    });
  }
  handleEventClick = (event: any) => {
    axios.get(contentById, {
      params: {
        content_id: event.event.id,
      }
    }).then((res) => {
      const record: recordObj = res.data[0][0];
      const y = record.record_ymd.split('-')[0]
      const m = record.record_ymd.split('-')[1];
      const d = record.record_ymd.split('-')[2];
      this.setState({
        openEditForm: true,
        edit_id: record.id,
        edit_title: record.title,
        edit_comment: record.comment,
        edit_color: createColor(record.color_code),
        edit_ymd: `${m}/${d}/${y}`,
        edit_selected_category_name: record.label,
        edit_selected_category_id: record.value
      });
    }).catch((e) => {
      console.error(e);
      this.setState({
        status: false,
        // result: e,
      });
    });
  }

  handleDateClick = (event: any) => {
    this.setState({
      openRegistForm: true,
      regist_title: "",
      regist_comment: "",
      date: event.dateStr
    });
  }

  handleSelect = (event: any) => {
    if (event == null) {
      this.getAllContents();
      this.setState({
        selected_category: "",
        selected_category_id: ""
      });
    } else {
      const selectedId: string = event.value;
      this.setState(
        {
          selected_category: event.label,
          selected_category_id: event.value
        }
      )
      axios.get(categorizedContents, {
        params: {
          id: selectedId
        }
      }).then((res) => {
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
  }

  handleRegistCategoryChange = (event: any) => {
    if (event != null) {
      if (event.__isNew__) {
        axios.get(registCategory, {
          params: {
            user_id: '1',
            category_name: event.label,
          }
        }).then((res) => {
          this.setState({
            categories: res.data[0],
            regist_selected_category_id: res.data[1][0]
          });
        }).catch((e) => {
          console.error(e);
          this.setState({
            status: false,
            // result: e,
          });
        });
        this.setState({
          regist_selected_category_name: event.label,
        });
        console.log(this.state.regist_selected_category_id);
      } else {
        this.setState({
          regist_selected_category_name: event.label,
          regist_selected_category_id: event.value
        });
      }
    } else {
      this.setState({
        regist_selected_category_name: "",
        regist_selected_category_id: ""
      });
    }
  }

  handleEditCategoryChange = (event: any) => {
    if (event != null) {
      this.setState({
        edit_selected_category_name: event.label,
        edit_selected_category_id: event.value
      });
    } else {
      this.setState({
        edit_selected_category_name: "",
        edit_selected_category_id: ""
      });
    }
  }

  handleRegistTitleChange = (event: any) => {
    this.setState({ regist_title: event.target.value });
  }

  handleRegistCommentChange = (event: any) => {
    this.setState({ regist_comment: event.target.value });
  }

  render() {
    let events: any = [];
    this.state.result.forEach((elem: recordObj) => {
      const event = {
        id: elem.id,
        title: elem.title,
        date: elem.record_ymd,
        color: elem.color_code
      }
      events.push(event);
    });

    return (
      <div>

        <FormControl sx={{ minWidth: 150 }}>
          <Select
            isClearable
            options={this.state.categories}
            onChange={this.handleSelect}
            styles={{
              menu: provided => ({ ...provided, zIndex: 9999 })
            }}
          ></Select>
        </FormControl>
        <AddCircleIcon color="primary" fontSize="large" onClick={this.handleOpenRegistForm}></AddCircleIcon>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          eventClick={this.handleEventClick}
          dateClick={this.handleDateClick}
          initialView="dayGridMonth"
          events={events}
        />
        <Modal
          open={this.state.openEditForm}
          onClose={this.handleCloseEditForm}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box component="form" onSubmit={this.handleEdit} noValidate sx={style}>
            <FormControl fullWidth>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                記録
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="date"
                  value={this.state.edit_ymd}
                  onChange={(newValue: any) => {
                    this.setState({ edit_ymd: newValue });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Select
                isClearable
                options={this.state.categories}
                styles={{
                  menu: provided => ({ ...provided, zIndex: 9999 })
                }}
                onChange={this.handleEditCategoryChange}
                defaultValue={{ value: this.state.edit_selected_category_id, label: this.state.edit_selected_category_name }}
              ></Select>
              <ColorPicker
                value={this.state.edit_color}
                onChange={this.handleEditColorChange}
                palette={palette}
                hideTextfield />
              <div>
                <TextField
                  id="title-field"
                  label="Title"
                  name="edit_title"
                  defaultValue={this.state.edit_title}
                  required
                >
                </TextField>
              </div>
              <TextField
                id="comment-field"
                label="Comment"
                name="edit_comment"
                multiline
                rows={5}
                defaultValue={this.state.edit_comment}
              />
              <div>
                <Stack spacing={2} direction="row">
                  <Button
                    fullWidth
                    type="button"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={this.handleDelete}
                  >
                    削除
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    startIcon={<ChangeCircleIcon />}
                  >
                    更新
                  </Button>
                </Stack>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default App;