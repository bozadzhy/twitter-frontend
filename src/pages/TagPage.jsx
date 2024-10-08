import React from "react";
import { Post } from "../components/Post";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

export const TagPage = () => {
  const { name } = useParams();
  const posts = useSelector((state) => state.posts.posts.items);
  const filteredPostsByTagName = posts.filter(
    (post) => post.tags.includes(name)
  );
  console.log("filteredPostsByTagName", filteredPostsByTagName);

  return (
    <Box sx={{mt: 2}}>
    {
        filteredPostsByTagName.map((obj)=> (
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
        tags={obj.tags}
       
      />
        ))
    }
      
    </Box>
  );
};

export default TagPage;
