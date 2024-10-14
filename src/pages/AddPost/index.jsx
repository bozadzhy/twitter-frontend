import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
// библиотека для редактирования статьи
import SimpleMDE from "react-simplemde-editor";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const inputFileRef = React.useRef(null);
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [comments, setComments] = React.useState("")
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  const handleChangeFile = async (e) => {
    try {
      // специальная конструкция для отправки на бекенд
      const formDarta = new FormData();
      formDarta.append("image", e.target.files[0]);
      const { data } = await axios.post("/upload", formDarta);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("ошибка при загрузке файлов");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };
  // контролируемій редактор как в библиотеке
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        tags,
        text,
        comments,
      };
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;  
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.worn(err);
      alert("ошибка при создании статьи");
    }
  };
  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.toString());
        setComments(data.comments);
      });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`https://fullstack-backend-d6nr.onrender.com${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      {/* <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Comments"
        fullWidth
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      /> */}
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Cохранить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
