import { List, CircularProgress, Box, Typography } from '@mui/material';
import Comment from './Comment';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Link } from 'react-router-dom';

interface IComment {
  id: number;
  text: string;
  user: {
    id: number;
    username: string;
  };
}

interface CommentStripeProps {
  comments: IComment[];
  loading: boolean;
  currentUserId?: number; 
  onDelete: (id: number) => void;
}

const CommentStripe = ({ comments, loading, currentUserId, onDelete }: CommentStripeProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        { isAuthenticated ? ('No comments yet. Be the first to comment!') : <> Please <Link to='/login'>login</Link> to send a comment! </>}
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0 }}>
      {comments.map((item) => (
        <Comment
          key={item.id} 
          comment={item} 
          isMyComment={item.user.id === currentUserId}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};

export default CommentStripe;