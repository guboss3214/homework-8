import { useState} from 'react';
import { 
  Card, CardHeader, CardMedia, CardContent, Avatar, Typography, 
  IconButton, Button, Collapse,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import ControlBar from './ControlBar';
import CommentStripe from './CommentStripe';
import { addComment, deleteComment, deletePost, getComment } from '../store/slices/userSlice';

interface PostProps {
  post: {
    id: number;
    user: {
      id: number;
      username: string;
    }
    imageUrl: string;
    description: string;
    createdAt: string;
    commentCount: number;
  }
}

interface IComment {
  id: number;
  text: string;
  user: {
    id: number;
    username: string;
  };
}

const Post = ({ post }: PostProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.user);
  
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<IComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        handleMenuClose();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleExpandClick = async () => {
    setExpanded(!expanded);
    if (!expanded) {
      setLoadingComments(true);
      const res = await dispatch(getComment(post.id)).unwrap();
      setComments(res);
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = await dispatch(addComment({ id: post.id, text: commentText })).unwrap();
    setComments((prev) => [...prev, newComment]);
    setCommentText('');
  };

  const handleDeleteComment = async (commentId: number) => {
    await dispatch(deleteComment({ exhibitId: post.id, commentId })).unwrap();
    setComments((prev) => prev.filter(c => c.id !== commentId)); 
  };

  return (
    <Card sx={{ maxWidth: 500, width: '100%', mb: 3, mx: 'auto', borderRadius: 3, boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: '#1976d2' }}>{post.user.username[0]}</Avatar>}
        action={
          profile?.id === post.user.id && (
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete Post
                </MenuItem>
              </Menu>
            </>
          )
        }
        title={post.user.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      
      <CardMedia component="img" height="300" image={post.imageUrl} alt="post" sx={{ objectFit: 'cover' }} />
      
      <CardContent>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>{post.description}</Typography>
        
        <Button 
          startIcon={<ChatBubbleOutlineIcon />} 
          onClick={handleExpandClick}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {post.commentCount} Comments
        </Button>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <CommentStripe
            comments={comments} 
            loading={loadingComments} 
            currentUserId={profile?.id} 
            onDelete={handleDeleteComment} 
          />
          
          <ControlBar
            value={commentText} 
            onChange={setCommentText} 
            onSend={handleAddComment} 
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Post;