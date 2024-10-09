import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const { id } = useParams();

  const allPosts = useSelector((state) => state.posts.posts.items);
  // console.log("info", allPosts);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dataCom, setDataCom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`/posts/${id}`),
          axios.get(`/posts/${id}/comments`),
        ]);

        setData(postResponse.data);
        setDataCom(commentsResponse.data);
        setIsLoading(false);
      } catch (err) {
        console.warn(err);
        alert("Ошибка при получении данных");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <Markdown children={data.text} />
      </Post>
      <CommentsBlock items={dataCom.comments} isLoading={false}>
        <Index />
      </CommentsBlock>
    </Box>
  );
};
