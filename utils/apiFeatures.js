class ApiFeatures{
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
      }

    filter(){
        const queryStringObj={...this.queryString}
        const excludesFields = ['page', 'sort', 'limit', 'fields','keyword'];
        excludesFields.forEach(field => delete queryStringObj[field]);
        let queryStr = JSON.stringify(queryStringObj);
        //convert 
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
          const fields = this.queryString.fields.split(',').join(' ');
          this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
          this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
      }

      search() {
        if (this.queryString.keyword) {
          let query = {};
            query.$or = [
              { name: { $regex: this.queryString.keyword, $options: 'i' } },
              { description: { $regex: this.queryString.keyword, $options: 'i' } },
            ];
          this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
      }

      
    }
    
module.exports = ApiFeatures;
    