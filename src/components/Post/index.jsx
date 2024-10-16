import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { fetchRemovePost } from "../../redux/slices/posts";
import { Typography } from "@mui/material";

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();

  const onClickRemove = () => {
    if (window.confirm("Are you sure you want to remove post?")) {
      dispatch(fetchRemovePost(_id));
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }
  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={`/posts/${_id}`}
      >
        <div className={styles.wrapper}>
          <UserInfo {...user} additionalText={createdAt} />
          <div className={styles.indention}>
            <h3
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {isFullPost ? title : <>{title}</>}
            </h3>
            
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li>
                <EyeIcon />
                <span>{viewsCount}</span>
              </li>
              <li>
                <CommentIcon />
                <span>{commentsCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </Link>
      <ul className={styles.tags}>
              {tags.toString() !== "" &&
                tags.map((name) => (
                  <li key={name}>
                    <Link to={`/tags/${name}`}>#{name}</Link>
                  </li>
                ))}
            </ul>
    </div>
  );
};
