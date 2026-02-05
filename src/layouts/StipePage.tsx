import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Container, Pagination, Stack, Typography, Skeleton } from "@mui/material";
import { getAllPosts } from "../store/slices/userSlice";
import type { AppDispatch } from "../store/store";
import Post from "../components/Post";

interface IPost {
  id: number;
  imageUrl: string;
  description: string;
  commentCount: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

const StripePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getAllPosts()).unwrap();
      setPosts(res.data); 
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const count = Math.ceil(posts.length / postsPerPage);
  const currentPosts: IPost[] = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight={800} sx={{ mb: 5 }}>
        Community Feed
      </Typography>

      <Stack spacing={4} sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        {loading ? (
          [1, 2, 3].map((n) => (
            <Box key={n} sx={{ width: '100%' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 2 }} />
              <Skeleton variant="text" width="60%" height={25} />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))
        ) : (
          currentPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        )}

        {!loading && posts.length === 0 && (
          <Typography variant="h6" align="center" color="text.secondary">
            No posts available. Be the first to share something!
          </Typography>
        )}
      </Stack>

      {count > 1 && (
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={count} 
            page={page} 
            onChange={(_, v) => {
              setPage(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default StripePage;