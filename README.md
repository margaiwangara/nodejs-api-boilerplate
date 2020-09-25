## Nodejs REST API Boilerplate

This is a boilerplate for creating REST APIs in Nodejs. The files are arranged
based on the functions they performs. The file and folder structure is as follows

Full Documentation [https://nodejsapiboilerplate.herokuapp.com](https://nodejsapiboilerplate.herokuapp.com)

#### Updates

##### 26th November 2019

Added github versioning through the terminal
**Important:** Create a `secret.env` file inside the config folder and add config variables as follows:

```env

GITHUB_TOKEN=xxxx <!-- Secret token to be used by github -->
GITHUB_USERNAME=xxxx <!-- Github username of repo you want to add a release to -->
GITHUB_REPO_NAME=xxxx <!-- The name of the github repository -->

```

The env variables above are **required** and in the absence of them the commands will not work. They are used as follows

```javascript
const URL = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO_NAME}/releases?access_token=${process.env.GITHUB_TOKEN}`;
```

After adding the environment variables, open terminal and type `node utils/versioner.js releases -t v1.0.0 -b master -n v1.0.0 -c 'Release of version 1.0.0' -d false -p false` to create a release with name of `v1.0.0`

```javascript
/**
 * Explanation for the tags added to the command
 * -t - tag of the release - Required
 * -n - name of the release
 * -b - branch to add the release to, type -h to view description in command prompt
 * -c - body description of the release
 * -d - means draft, publish the release as draft or not, false | true, default is false
 * -p - prerelease, publish it as a prerelease, default is false
 */
```

To view description of each --tag type the command `node utils/versioner.js releases -h`

##### 26th November 2019

Added security fixes

- NoSQL Injection
- HPP
- XSS

Provided global access by using the CORS package

##### 25th November 2019

Added a number of functionalities within the past few days

- Authentication
  - Password Hashing
  - Password Reset Token
- Authorization
  - Roles - admin, user
- Middleware
  - userAuthorized - checks if user is logged in before providing access
  - roleAuthorized - checks the roles passed in as parameters compared to user role in database
- Model
  - User
  - Post
- Associations
  - Linked posts and users
  - Used virtuals and reference keys to populate related data
- Email Sending
  - Email Confirmation
  - Password Reset
- Image Upload
  - Users can upload a profile image

##### 20th November 2019

Added middleware to enable **sorting**, **selection**, **pagination** and **filtering**.

**Sorting** of items in ascending and descending based on any field in the documents by adding `/api/foo?sort=field` to sort in ascending or `/api/foo?sort=-field` to sort in descending order.

**Selection by** has been added to provide data based on what needs to be displayed such that if only the name and description of lets say a product is to be displayed the query is comma separated such as such `/api/foo?select=name,description` to only get the item's name, description and the id is by default

**Filtering** is available using `greater than[gt]`, `less than[lt]`, `greater than or equal to[gte]`, `less than or equal to[lte]` and `in[in]`(for arrays). To get an item lets say with a price `greater than 500` the following query may be added `/api/foo?price[gt]=500`, all prices greater than 500 will be displayed

**Pagination** has also been added based on the common practise with `limit` and `page` option as such `/api/foo?page=2&limit=10`

**N/B:** These queries can be used together as such `/api/foo?select=name,description&sort=-name&price[gte]=100&limit=10&page=2` meaning `display name and description of items with prices greater than or equal to 100 and show 10 results per page but only results on the second page`

###### Usage

Import the `advancedResults.js` file into the route files where the middleware needs to be applied the add the `advancedResults` method as follows

```javascript
// add model
const Foo = require("../models/foo");
// import advanced results
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(advancedResults(Foo), getFoos) //add advanced results as middleware
  .post(createFoo);
```

Then go to the `controllers` folder and add `advancedResults` method into the `GET all` method

```javascript
/**
 * @desc    GET all data
 * @route   /api/foo
 */
exports.getFoos = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults); //add here since we added it to res
  } catch (error) {
    next(error);
  }
};
```

##### Unknown Time

Added a seeder.js file for easy and efficient database population. Just run the commands `node utils/seeder.js -c` to add records and `node utils/seeder.js -d` to delete all records

#### Folder and File Structure

- data
  - foo.json
  - posts.json
  - users.json
- config
  - config.env
- controllers
  - auth.js
  - foo.js
  - posts.js
  - users.js
- handlers
  - error.js
- middlewares
  - advancedResult.js
  - auth.js
- models
  - foo.js
  - index.js
  - posts.js
  - users.js
- public
  - uploads
- routes
  - auth.js
  - foo.js
  - posts.js
  - users.js
- utils
  - ErrorResponse.js
  - seeder.js
  - sendEmail.js
- index.js

It is pretty self explanatory

```javascript
// Just clone the repo and run

  npm install

// or

  yarn install

// then use as a starter for all your projects

```
