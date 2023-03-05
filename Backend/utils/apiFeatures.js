const { json } = require("express");

class Apifeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        // console.log(keyword)
        this.query = this.query.find({ ...keyword });
        return this
    }

    filter() {
        const querycopy = { ...this.queryStr };

        //remove some fields for category
        const removefields = ["keyword", "page", "limit"];
        removefields.forEach((key) => delete querycopy[key])

        //filter for price and rating
        // console.log(querycopy)

        let queryStr = JSON.stringify(querycopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr))

        // console.log(queryStr)
        return this;
    }
    Pagination(resultPerpage){
        const currentPage=Number(this.queryStr.page) || 1;
        const skip=resultPerpage*(currentPage-1);
        this.query=this.query.limit(resultPerpage).skip(skip)
        return this
    }
}
module.exports = Apifeatures