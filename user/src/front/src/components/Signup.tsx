import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

// バリデーションルール
const schema = yup.object({
  email: yup
    .string()
    .required('必須だよ')
    .email('正しいメールアドレス入力してね'),
  name: yup.string().required('必須だよ'),
  password: yup
    .string()
    .required('必須だよ')
    .min(6, '少ないよ')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
      'パスワード弱いよ'
    ),
})

const signUp = 'http://localhost:3000/users/signUp';

// フォームの型
interface SignUpFormInput {
  email: string
  name: string
  password: string
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const { register, formState: { errors } } = useForm<SignUpFormInput>({
    resolver: yupResolver(schema),
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.get(signUp, {
      params: {
        user_name: data.get('email'),
        password: data.get('password'),
        repassword: data.get('repassword'),
      }
    }).then((res) => {
      navigate('/', {state: res.data[0]});
    }).catch((e) => {
      console.error(e);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              // name="email"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={"email" in errors}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              // name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={"password" in errors}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repassword"
              label="Password"
              type="password"
              id="repassword"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid item>
                <Link href="/signin" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}