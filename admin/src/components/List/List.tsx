import {FC, useEffect, useState} from "react";
import {FormControl, Grid, Input, InputAdornment, InputLabel} from "@mui/material";
import {ICardItem} from "../../types/cardTypes";
import SearchIcon from '@mui/icons-material/Search';
import ListItem from "../ListItem/ListItem";
import useNavigation from "../../hooks/api/useNavigation";
import PageNavigation from "../Navigation/PageNavigation/PageNavigation";
import ItemSkeleton from "../ListItem/Skeleton";
import SortBar from "./SortBar";
import {ObjStrKeys} from "../../types/formsStateTypes";
import useMedia from "../../hooks/useMedia";


const initSort = {
   createdAt: -1
}

const List: FC = () => {

   const { isTablet } = useMedia()
   const [searchState, setSearchState] = useState('')
   const [sortState, setSortState] = useState(initSort)
   const {
      elements,
      nextPageHandler,
      prevPageHandler,
      page,
      pagesCount,
      loading,
      changeParams,
   } = useNavigation(15, '&sort=-createdAt')

   const mockItem: ICardItem = {
      slug: 'new',
      mainPhoto: '',
      title: 'xxx',
      beforeTitle: 'xxx',
      text: 'xxx'
   }

   useEffect(() => {
      const sortVal = Object.keys(sortState).reduce((acc, key, i, arr) => {
         const sign = sortState[key as keyof typeof sortState] > 0 ? '' : '-'
         const comma = i < arr.length - 1 ? ',' : ''

         acc = acc + sign + key + comma

         return acc
      }, '')

      let paramsObj: ObjStrKeys = {
         sort: sortVal
      }

      if (searchState) {
         paramsObj['title[regex]'] = searchState
      }

      if (!loading && sortState) {
         changeParams(paramsObj)
      }
   }, [searchState, sortState, changeParams, loading])

   return (
      <div style={{
         width: '100%',
         display: 'flex',
         flexDirection: 'column',
      }}>
         <FormControl fullWidth sx={{m: 1}} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Пошук за назвою</InputLabel>
            <Input
               id="standard-adornment-amount"
               value={searchState}
               onChange={e => setSearchState(e.target.value)}
               startAdornment={<InputAdornment position="start" style={{cursor: 'pointer'}}>
                  <SearchIcon/>
               </InputAdornment>}
            />
         </FormControl>

         <SortBar state={sortState} setState={setSortState}/>

         <Grid
            container
            sx={{width: '100%'}}
            alignItems='center'
            spacing={isTablet ? 2 : 0}
            rowSpacing={!isTablet ? 2 : 0}
         >
            <ListItem
               card={mockItem}
               mock={1}
            />

            {loading && [0, 1, 2].map(el => <ItemSkeleton key={el}/>)}

            {!loading && elements.map((el, i) =>
               <ListItem
                  card={el}
                  key={el.slug + i}
               />
            )}

            <PageNavigation
               nextPageClick={nextPageHandler}
               prevPageClick={prevPageHandler}
               page={page}
               pagesCount={pagesCount}
               disable={loading}
            />
         </Grid>
      </div>
   )
}

export default List