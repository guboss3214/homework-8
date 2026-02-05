import { List, CircularProgress, Box, Typography } from '@mui/material';
import Comment from './Comment';

const CommentStripe = ({ comments, loading, currentUserId, onDelete }: any) => {
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
        No comments yet. Be the first to comment!
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