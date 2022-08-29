import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
export const  Loader=()=> {
  return (
    <>
      {/* <Spinner animation="grow" style={{marginLeft: "100px"}} /> */}
      <Box sx={{ width: '425%' ,marginBottom:"404px"}}>
        <LinearProgress />
      </Box>
    
    </>
  )
}
