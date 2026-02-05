import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  Pagination, 
  Typography, 
  CircularProgress, 
  Stack,
} from "@mui/material";
import Post from "../components/Post";
import { myPosts } from "../store/slices/userSlice";

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

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myPostsData, setMyPostsData] = useState<IPost[]>([]);
  const { postsUpdatedTrigger } = useSelector((state: RootState) => state.user);
  
  const [page, setPage] = useState(1);
  const postsPerPage = 6; 

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await dispatch(myPosts()).unwrap();
      setMyPostsData(res.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMyPosts();
  }, [postsUpdatedTrigger]);

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = myPostsData.slice(indexOfFirstPost, indexOfLastPost);
  const count = Math.ceil(myPostsData.length / postsPerPage);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}><Typography color="error">Error: {error}</Typography></Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4} sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <Typography textAlign="center">No posts found.</Typography>
        )}
      </Stack>

      {count > 1 && (
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={count}
            page={page}
            onChange={handleChange}
            color="primary"
            size="large"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  )
}

export default HomePage;