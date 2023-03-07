   class APIfeatures {
   constructor(query, queryObj) {
      this.query = query
      this.queryObj = queryObj
   }

   filter() {
      // Exclude unwanted fields
      const queryObj = {...this.queryObj}
      const excludedFields = ['sort', 'page', 'limit', 'skip', 'fields']
      excludedFields.forEach(field => delete queryObj[field])

      // If regex set insensitivity to upper and lower cases
      Object.keys(queryObj).forEach(query => {
         if (queryObj[query].hasOwnProperty('regex')){
            queryObj[query].options = 'i'
         }
      })

      if (Object.keys(queryObj).length > 0) {

         Object.keys(queryObj).forEach(key => {
            const el = queryObj[key]

            if (el.hasOwnProperty('in') && !Array.isArray(el.in))
               el.in = el.in.split(',')
         })

         const queryStr = JSON.stringify(queryObj)
            .replace(/\b(gte|gt|lt|lte|regex|options|in)\b/g, match => `$${match}`)

         this.query = this.query.find(JSON.parse(queryStr))
      } else {
         this.query = this.query.find()
      }

      return this
   }

   populate(populateObj) {
      this.query.populate(populateObj)

      return this
   }

   sort() {
      let sortBy = '-createdAt'

      if (this.queryObj.sort) sortBy = this.queryObj.sort.split(',').join(' ')

      this.query = this.query.sort(sortBy)
      return this
   }

   select(selectOpt) {
      let select = '-__v'

      if (this.queryObj.select) {
         select = this.queryObj.select.split(',').join(' ')
      }
      else if (selectOpt) {
         select = selectOpt
      }

      this.query = this.query.select(select)
      return this
   }

   paginate() {
      const page = this.queryObj.page * 1 || 1
      const limit = this.queryObj.limit * 1 || 10

      const skip = (page - 1) * limit

      this.query = this.query.skip(skip).limit(limit)
      return this
   }
}

module.exports = APIfeatures