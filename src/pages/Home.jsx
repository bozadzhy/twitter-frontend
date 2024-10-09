import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";

import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { selectIsAuth } from "../redux/slices/auth";
import { styled } from "@mui/material";
import { purple } from '@mui/material/colors';  

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [isNewPosts, setIsNewPosts] = useState(true);
  const sortedPosts = posts?.items
    .slice()
    .sort((a, b) => a.viewsCount - b.viewsCount);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const postItems = isPostLoading
    ? [...Array(5)]
    : isNewPosts
    ? posts?.items || []
    : sortedPosts || [];
    const reversedArray = postItems.slice().reverse();

    const itemsArr = useSelector((state) => state.posts.posts.items);
    const commentsArr = itemsArr?.map((item) => item.comments);
    console.log("commentsArr", commentsArr)
    const allComments = commentsArr?.flat();

  return (
    <>
      <Box sx={{mt: 2, mb: 2}}>
        <Button
        sx={{mr: 2}}
          variant={isNewPosts ? "contained" : "outlined"}
          onClick={() => setIsNewPosts(true)}
          color="primary"
        >
          New Posts
        </Button>
        <Button
       
          variant={isNewPosts ? "outlined" : "contained"}
          onClick={() => setIsNewPosts(false)}
        >
          Popular Posts
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={8} item>
          <>
            {reversedArray.map((obj, index) =>
              isPostLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  key={obj._id}
                  _id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl
                      ? `https://fullstack-backend-d6nr.onrender.com${obj.imageUrl}`
                      : ""
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.commentsCount || 0}
                  tags={obj.tags.map((tag) => tag.trim())}
                  isEditable={userData?._id === obj.user._id}
                />
              )
            )}
          </>
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={allComments}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
