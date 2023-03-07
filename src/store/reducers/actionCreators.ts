import {DataType} from "../../types/content/data"
import {createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"


export const fetchSocialLinks = createAsyncThunk(
   'socialLinks/fetchAll',
   async (__, thunkApi) => {

      const res = await axios(`/api/data/${DataType.CONTACTS}`)

      if (res.data?.item)
         return res.data.item
      else
         throw new Error('No social links fetched')
   }
)