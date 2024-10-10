import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { fetchCreateComment } from "../redux/slices/posts";

export const FullPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [comment, setComment] = React.useState("");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dataCom, setDataCom] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleCommentSubmit(id, comment);
  };

  const handleCommentSubmit = async (id, comment) => {
    try {
      await dispatch(fetchCreateComment({ id, body: comment }));
      setComment("");
      setIsSubmitted(!isSubmitted)

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  // Первый useEffect для получения поста
  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных поста");
        setIsLoading(false);
      });
  }, []);

  // Второй useEffect для получения комментариев
  useEffect(() => {
    axios.get(`/posts/${id}/comments`)
      .then(({data}) => {
      setDataCom(data);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных комментариев");
      });
  }, [isSubmitted]);

  console.log("datacom", dataCom)

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={
          data.imageUrl
            ? `https://fullstack-backend-d6nr.onrender.com${data.imageUrl}`
            : ""
        }
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments.length}
        tags={data.tags}
        isFullPost
      >
        <Markdown children={data.text} />
      </Post>
      <CommentsBlock items={dataCom.comments.length > 0 ? dataCom.comments : []} isLoading={isLoading}>
        <Box fullWidth sx={{ display: "flex", p: 2 }}>
          <Avatar
            sx={{ mr: 2 }}
            src="https://mui.com/static/images/avatar/5.jpg"
          />
          <form style={{ width: "100%" }} onSubmit={onSubmit}>
            <TextField
              sx={{ mb: 2 }}
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
        </Box>
      </CommentsBlock>
    </Box>
  );
};
