import { Pagination as MuiPagination, Stack } from '@mui/material';

interface Props {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination = ({ count, page, onChange }: Props) => {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', my: 4 }}>
      <MuiPagination 
        count={count} 
        page={page} 
        onChange={onChange} 
        color="primary" 
        variant="outlined" 
        shape="rounded" 
      />
    </Stack>
  );
};

export default Pagination;