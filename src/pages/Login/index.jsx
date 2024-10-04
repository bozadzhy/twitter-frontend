import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

import styles from "./Login.module.scss";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "1test@gmail.com",
      password: "12345",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    // отправляем в бекенд нашего юзера через редакс
    // dispatch(fetchAuth(values));

    const data = await dispatch(fetchAuth(values));
    console.log(data);
    if ("token" in data.payload) {
      localStorage.setItem("token", data.payload.token);
    } else {
      alert("не удалось авторизоваться")
    }
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="email"
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "укажите почту" })}
          fullWidth
        />
        <TextField
          type="password"
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "укажите пароль" })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
