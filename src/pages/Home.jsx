import React, { useEffect, useState, useLayoutEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios.js";

import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
// import { SideBlock } from "../components/SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import styles from "../components/SideBlock/SideBlock.module.scss";
import AccessibilityNewSharpIcon from '@mui/icons-material/AccessibilityNewSharp';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [users, setUsers] = useState([]);

  const [isNewPosts, setIsNewPosts] = useState(true);
  const sortedPosts = posts?.items
    .slice()
    .sort((a, b) => a.viewsCount - b.viewsCount);

  useLayoutEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const postItems = isPostLoading
    ? [...Array(5)]
    : isNewPosts
    ? posts?.items || []
    : sortedPosts || [];
  const reversedArray = postItems.slice().reverse();
  // console.log("reversedArray", reversedArray);
  // const itemsArr = useSelector((state) => state.posts.posts.items);
  // const commentsArr = itemsArr?.map((item) => item.comments);
  // console.log("commentsArr", commentsArr)
  // const allComments = commentsArr?.flat();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          sx={{ mr: 2 }}
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
                  commentsCount={obj.comments.length || 0}
                  tags={obj.tags.map((tag) => tag.trim())}
                  isEditable={userData?._id === obj.user._id}
                />
              )
            )}
          </>
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          {/* <CommentsBlock items={allComments} isLoading={false} /> */}
          <Paper>
            <Typography variant="h6" classes={{ root: styles.title }}>
              Users
            </Typography>
            <List>
              {(isPostLoading ? [...Array(5)] : users).map((obj, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      {isPostLoading ? (
                        <Skeleton variant="circular" width={40} height={40} />
                      ) : (
                        
                        <AccessibilityNewSharpIcon/>
                      )}
                    </ListItemAvatar>
                    {isPostLoading ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Skeleton variant="text" height={25} width={120} />
                        <Skeleton variant="text" height={18} width={230} />
                      </div>
                    ) : (
                      <Typography variant="h5" gutterBottom>
                      {obj.fullName}
                    </Typography>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
