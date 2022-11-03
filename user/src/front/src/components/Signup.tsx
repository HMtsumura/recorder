import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// バリデーションルール
const schema = yup.object().shape({
  email: yup
    .string()
    .required('required')
    .email('wrong email address'),
  password: yup
    .string()
    .required('required')
    .min(6, 'at least 6 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
      'weak passwrod'
    ),
  repassword: yup
      .string()
      .oneOf([yup.ref('password')], 'passwordが一致しません。')
      .required('required')
      ,
});

const signUp = 'http://localhost:3000/users/signUp';

// フォームの型
interface SignUpFormInput {
  email: string
  password: string
  repassword: string
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
  const { handleSubmit, formState: { errors }, control } = useForm<SignUpFormInput>({
    resolver: yupResolver(schema),
  });

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<SignUpFormInput> = (data, event) => {
    axios.get(signUp, {
      params: {
        user_name: data.email,
        password: data.password,
        repassword: data.repassword
      }
    }).then((res) => {
      console.log(res);
      navigate('/', {state: res.data[0]});
    }).catch((e) => {
      console.error(e);
    });
  }
  
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
          <Box component="form" sx={{ mt: 1 }}>
          <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email Address"
                  id="email"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email ? errors.email?.message : ""}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  id="password"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.password}
                  helperText={errors.password ? errors.password?.message : ""}
                />
              )}
            />
            <Controller
              name="repassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Repassword"
                  id="repassword"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.repassword}
                  helperText={errors.repassword ? errors.repassword?.message : ""}
                />
              )}
            />
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="repassword"
              label="Password"
              type="password"
              id="repassword"
              autoComplete="current-password"
            /> */}
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