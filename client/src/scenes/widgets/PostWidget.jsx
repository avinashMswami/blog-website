import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme,InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setComments } from "state";
// import {
//   Box,
//   Divider,
//   Typography,
//   InputBase,
//   useTheme,
//   Button,
//   IconButton,
//   useMediaQuery,
// } from "@mui/material";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,   
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [the_comment, setthe_comment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchcomment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: the_comment }),
      });
  
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        // Handle the error, show a message, or return early
        return;
      }
  
      const {comments} = await response.json();
      
      // console.log(`this id the comments form the updated comments: ${comments}`);
      // Assuming postId is available, pass it in the payload
      dispatch(setComments({ postId, comments: comments }));

      setthe_comment("");

    } catch (error) {
      console.error("Error:", error);
      // Handle the error
    }
  };
  


  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        canIPost = {false}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {/* <Typography>{comments.length}</Typography> */}
          </FlexBetween>
        </FlexBetween>

        {/* <IconButton>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>
      
      {isComments && (
        <Box mt="0.5rem">
        <FlexBetween>
        <InputBase
        placeholder="Add a comment..."
        onChange={(e) => setthe_comment(e.target.value)}
        value={the_comment}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "2rem",
          padding: "0.5rem 1rem", // Adjusted padding
          fontSize: "0.9rem",
          mb: "0.5rem",
          mr:"0.5rem"
        }}
      />
      <Button
          disabled={!the_comment}
          onClick={patchcomment}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            fontSize: "0.7rem"
          }}
        >
          Comment
        </Button>
        </FlexBetween>
        {/* {console.log(comments);} */}
          { comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
