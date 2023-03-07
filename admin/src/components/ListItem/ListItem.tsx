import {FC, SyntheticEvent, useEffect, useState} from "react";
import {
   Card,
   CardActionArea,
   Container,
   Grid,
   styled,
   Typography,
   TypographyProps
}
   from "@mui/material";
import {ICardItem} from "../../types/cardTypes";
import useFormatDate from "../../hooks/useFormatDate";
import {useNavigate} from "react-router-dom";
import addImg from '../../assets/images/add.png'
import classes from './ListItem.module.sass'
import Loader from "../UI/Loader";


interface IProps {
   card: ICardItem
   mock?: number
}

interface ICardTextProps extends TypographyProps {
   mock?: number
}

const CardText = styled(Typography)<ICardTextProps>( ({theme, mock}) => ({
   fontWeight: 600,
   lineHeight: '100%',
   fontSize: '1.1rem',
   marginBottom: theme.spacing(1.5),
   ...(!!mock && {
      color: theme.palette.grey['200'],
      background: theme.palette.grey['200'],
      margin: 14
   })
}) )

const ListItem: FC<IProps> = ({ card, mock= 0 }) => {

   const formatedDate = useFormatDate(card.date)
   const navigate = useNavigate()

   const [imgLoading, setImgLoading] = useState(false)

   const onChange = (e: SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()

      navigate(`/product/${card.slug}`)
   }

   useEffect(() => {
      const newImg = new Image()

      setImgLoading(true)

      newImg.onload = () => { setImgLoading(false) }

      newImg.src = mock ? addImg : card.mainPhoto
   }, [card, mock])

   return (
      <Grid
         item
         xs={12}
         sm={6}
      >
         <Card onClick={onChange}>
            <CardActionArea
               sx={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
               }}
            >
               <div className={classes.img_wrapper}>
                  { imgLoading &&
                     <div className={classes.img_loader}>
                        <Loader/>
                     </div>
                  }

                  <img
                     src={mock ? addImg : card.mainPhoto}
                     alt={card.title}
                     className={mock ? classes.mock_img : classes.img}
                  />
               </div>

               <Container sx={{ mt: 1, pb: 2 }}>
                  { card.beforeTitle &&
                     <CardText mock={mock}>
                        {card.beforeTitle}
                     </CardText>
                  }

                  <CardText mock={mock} sx={{ fontSize: '1.3rem' }}>
                     {card.title}
                  </CardText>

                  { card.afterTitle &&
                     <CardText>
                        {card.afterTitle}
                     </CardText>
                  }

                  { card.date &&
                     <CardText gutterBottom>
                        {formatedDate}
                     </CardText>
                  }

                  { card.text &&
                     <CardText
                        color={'text.secondary'}
                        sx={{
                           fontSize: '.9rem',
                           fontWeight: 400,
                           mb: 0
                        }}
                        mock={mock}
                     >
                        {card.text}
                     </CardText>
                  }
               </Container>
            </CardActionArea>
         </Card>
      </Grid>
   )
}

export default ListItem