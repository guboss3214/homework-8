import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentProps {
  comment: {
    id: number;
    text: string;
    user: {
      id: number;
      username: string;
    };
  };
  isMyComment: boolean;
  onDelete: (id: number) => void;
}

const Comment = ({ comment, isMyComment, onDelete }: CommentProps) => {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        isMyComment && (
          <IconButton 
            edge="end" 
            aria-label="delete" 
            onClick={() => onDelete(comment.id)}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{ px: 2, py: 1 }}
    >
      <ListItemAvatar sx={{ minWidth: 45 }}>
        <Avatar 
          sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: '#efefef', color: '#555' }}
        >
          {comment.user.username[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
            {comment.user.username}
          </span>
        }
        secondary={
          <span style={{ color: 'text.primary', fontSize: '0.85rem', display: 'block', marginTop: '2px' }}>
            {comment.text}
          </span>
        }
      />
    </ListItem>
  );
};

export default Comment;