import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // const isProfile = fromWhere === "profilepage" ? true : false;

  const fetchPosts = async () => {
    let url = "http://localhost:3001/posts";

    // if (isProfile) {
    //   url = `http://localhost:3001/posts/${userId}/posts`;
    // }

    try {
      console.log("Fetching posts...");
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
      console.log("Posts fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  useEffect(() => {
    // console.log("Component is mounting or updating...");

    // // Log current values for debugging
    // console.log("fromWhere:", fromWhere);
    // console.log("userId:", userId);
    // console.log("token:", token);

    fetchPosts();
  }, []);

  // Log Redux state for debugging
  useEffect(() => {
    console.log("Redux state:", posts);
  }, [posts]);

  return (
    <>
      {posts && posts.length>0 && posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
