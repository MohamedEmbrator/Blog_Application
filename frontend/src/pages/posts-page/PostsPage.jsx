import "./posts-page.css";
import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination/Pagination";
import { useEffect , useState} from "react";
import { posts } from "../../dummyData";

const POST_PER_PAGE = 3;

const PostsPage = () => {

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>
      <Pagination 
       pages={5} 
       currentPage={currentPage}
       setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PostsPage;
