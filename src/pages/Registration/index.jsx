import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { selectIsAuth, fetchRegister } from "../../redux/slices/auth";

import styles from "./Login.module.scss";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "12345",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    // отправляем в бекенд нашего юзера через редакс
    // dispatch(fetchAuth(values));

    const data = await dispatch(fetchRegister(values));
    console.log(data);
    if ("token" in data.payload) {
      localStorage.setItem("token", data.payload.token);
    } else {
      alert("не удалось авторизоваться");
    }
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "укажите имя" })}
          fullWidth
          label="Полное имя"
        />
        <TextField
          type="email"
          className={styles.field}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "укажите почту" })}
          fullWidth
          label="E-Mail"
        />
        <TextField
          type="password"
          className={styles.field}
          label="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "укажите пароль" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
