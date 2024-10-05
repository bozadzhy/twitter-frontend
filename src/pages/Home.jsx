import React, { useEffect } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";

import { fetchPosts, fetchTags } from "../redux/slices/posts";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import BasicTabs from "../components/BasicTabs";
import { selectIsAuth } from "../redux/slices/auth";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(()=> {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [])

  return (
    <>
    <BasicTabs/>
  
      {/* <Tabs style={{ marginBottom: 15 }} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs> */}

      <Grid container spacing={4}>
        <Grid xs={8} item>
          <>
            {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
              isPostLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  key={index}
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
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              )
            )}
          </>
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "John Smith",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "New Comment",
              },
              {
                user: {
                  fullName: "Dave Smith",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
