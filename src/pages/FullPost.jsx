import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { Box } from "@mui/material";

export const FullPost = () => {
  const { id } = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [dataCom, setDataCom] = useState(null);
useEffect(() => {
    axios.get(`/posts/${id}/comments`).then(({ data }) => {
      setDataCom(data);
    });
  }, []);
  console.log("dataCom", dataCom);


  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("oшибка при получении статьи");
      });
  }, []);
  // console.log("data", data);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <Box sx={{mt:2}}>
      <Post
      
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `https://fullstack-backend-d6nr.onrender.com${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <Markdown children={data.text} />
      </Post>
      <CommentsBlock
        items={dataCom.comments}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </Box>
  );
};
