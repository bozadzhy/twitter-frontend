import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../axios.js";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { fetchCreateComment } from "../../redux/slices/posts.js";



export const Index = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [comment, setComment] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleCommentSubmit(id, comment);
  };

  const handleCommentSubmit = async (id, comment) => {
    try {
      await dispatch(fetchCreateComment({ id, body: comment }));
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src="https://mui.com/static/images/avatar/5.jpg"
      />
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Отправить
        </Button>
      </form>
    </div>
  );
};
