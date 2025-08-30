import "./posts-page.css";
import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, getPostsCount } from "../../redux/apiCalls/postApiCall";

const PostsPage = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { posts, postsCount } = useSelector((state) => state.post);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(postsCount / 3);
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchPosts(currentPage));
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    // @ts-ignore
    dispatch(getPostsCount());
  }, []);

  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PostsPage;
