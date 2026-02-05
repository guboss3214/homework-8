import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ControlBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

const ControlBar = ({ value, onChange, onSend }: ControlBarProps) => {
  return (
    <Box sx={{ display: 'flex', mt: 2, gap: 1, alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
      />
      <IconButton 
        color="primary" 
        onClick={onSend} 
        disabled={!value.trim()}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ControlBar;