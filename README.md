## Nodejs REST API Boilerplate

This is a boilerplate for creating REST APIs in Nodejs. The files are arranged
based on the functions they performs. The file and folder structure is as follows

##### Update

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
