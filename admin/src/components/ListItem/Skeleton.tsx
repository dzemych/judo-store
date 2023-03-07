import {FC} from "react";
import Stack from "@mui/material/Stack";
import {Card, CardActionArea, Container, Grid, Skeleton} from "@mui/material";


const ItemSkeleton: FC = () => {
   return (
      <Grid item xs={12} sm={6}>
         <Card>
            <CardActionArea
               sx={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
               }}
            >
               <Stack spacing={1}>
                  <Skeleton variant="rounded" height={180} />

                  <Container sx={{ mt: 1, pb: 2 }}>
                     <Skeleton variant="rectangular" height={17} sx={{ mt: 1.5 }} />
                     <Skeleton variant="rectangular" height={20} sx={{ mt: 1.5 }} />
                     <Skeleton variant="rectangular" height={17} sx={{ mt: 1.5 }} />
                  </Container>
               </Stack>
            </CardActionArea>
         </Card>
      </Grid>
   )
}

export default ItemSkeleton