## Nodejs REST API Boilerplate

This is a boilerplate for creating REST APIs in Nodejs. The files are arranged
based on the functions they performs. The file and folder structure is as follows

##### Updates

###### 20th November 2019

Added a middleware to enable sorting of items in ascending and descending based on any field in the documents by adding `/api/foo?sort=field` to sort in ascending or `/api/foo?sort=-field` to sort in descending order.
The items can also be selected based on what needs to be displayed such that if only the name and description of lets say a product is to be displayed the query is comma separated such as such `/api/foo?select=name,description` to only get the item's name, description and the id is by default
Another option is filtering using `greater than[gt]`, `less than[lt]`, `greater than or equal to[gte]`, `less than or equal to[lte]` and `in[in]`(for arrays). To get an item lets say with a price `greater than 500` the following query may be added `/api/foo?price[gt]=500`, all prices greater than 500 will be displayed
Pagination has also been added based on the common practise with `limit` and `page` option as such `/api/foo?page=2&limit=10`

**N/B:** These queries can be used together as such `/api/foo?select=name,description&sort=-name&price[gte]=100&limit=10&page=2` meaning `display name and description of items with prices greater than or equal to 100 and show 10 results per page but only results on the second page`

###### Unknown Time

Added a seeder.js file for easy and efficient database population. Just run the commands `node utils/seeder.js -c` to add records and `node utils/seeder.js -d` to delete all records

- config
  - config.env
- controllers
  - foo.js
- handlers
  - error.js
- middlewares
  - #no files yet
- models
  - index.js
  - foo.js
- routes
  - foo.js
- utils **new**
  - ErrorResponse.js
  - seeder.js
- index.js

It is pretty self explanatory

```javascript
// Just clone the repo and run

  npm install

// or

  yarn install

// then use as a starter for all your projects

```
