import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Link,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import type { IPostData } from '../interfaces/PostData';
import { NewspaperOutlined } from '@mui/icons-material';
import { createPost, logout } from '../store/slices/userSlice';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [postData, setPostData] = useState<IPostData>({ image: null, description: '' });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPostData({ image: null, description: '' });
    setPreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostData({ ...postData, image: file });
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async () => {
    if (postData.description && postData.image) {
      const formData = new FormData();
      formData.append('image', postData.image); 
      formData.append('description', postData.description);

      try {
        await dispatch(createPost(formData)).unwrap(); 
        handleClose();
      } catch (error) {
        console.error("Failed to create post:", error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1} 
        sx={{ backgroundColor: '#ffffff', color: '#1976d2', borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

            {isAuthenticated && (
              <>
                <Link
                  component={RouterLink}
                  to="/home"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#5f6368',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': { color: '#1976d2' }
                  }}
                >
                  <NewspaperIcon fontSize="small" />
                  My posts
                </Link>

                <Link
                  component={RouterLink}
                  to="/"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': { color: '#5f6368' }
                  }}
                >
                  <NewspaperOutlined fontSize="small" />
                  All posts
                </Link>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="contained" 
                  disableElevation
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpen}
                  sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                >
                  New Post
                </Button>

                <IconButton 
                  onClick={handleLogout} 
                  color="error" 
                  sx={{ border: '1px solid #f8d7da', borderRadius: '12px' }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Button 
                component={RouterLink}
                to="/login"
                variant="outlined" 
                startIcon={<LoginIcon />}
                sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create new Post</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
            {postData.image ? (
              <Box>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} 
                />
                <Button size="small" color="error" onClick={() => {setPostData({ ...postData, image: null }); setPreview('');}}>
                  Remove
                </Button>
              </Box>
            ) : (
              <Button component="label" variant="outlined" sx={{ width: '100%', py: 2 }}>
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            )}
          </Box>
          <TextField
            label="Post description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={postData.description}
            onChange={(e) => setPostData({ ...postData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!postData.description || !postData.image}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;