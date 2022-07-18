# AMoviesDB RESTful API

RESTful API wich provide all needed actions like Authentication, Authorization, CRUD and file upload to Google Drive

## App Details

Technologies:

-   Express.js
-   Node.js
-   Mongoose

Packages:

-   jsonwebtoken
-   express-validator
-   express-formidable
-   googleapis
-   bcrypt
-   cors

## Live Demo

-   Live Demo [HERE](https://amoviesdb-rest-api.herokuapp.com/)

## RESTful API

### The following endpoints are supported:

Catalog

-   `GET /api/catalog` - list all movies
-   `GET /api/catalog?page=1` - return list of first 8 movies
-   `GET /api/catalog?search=searchedValue` - returns list of searched movies
-   `POST /api/catalog` - create a new movie (post a JSON object in a request body, e.g. `{"title": "Avengers", "imageUrl": "https://terrigen-cdn-dev.marvel.com/content/prod/1x/avengersendgame_lob_crd_05.jpg", "youtubeUrl": "https://www.youtube.com/watch?v=eOrNdBpGMv8", "description": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity."}`)
-   `GET /api/catalog/:movieId` - returns a movie with given `movieId`
-   `GET /api/catalog/most-liked` - list of 4 most liked movies
-   `GET /api/catalog/my-movies/:userId` - list of all movies created from user with `userId`
-   `GET /api/catalog/:movieId` - return a movie by given `movieId`
-   `PUT /api/catalog/:movieId` - edit movie by `movieId` send a JSON object in the request body, holding all fields, e.g. `{"title": "Avengers", "imageUrl": "https://terrigen-cdn-dev.marvel.com/content/prod/1x/avengersendgame_lob_crd_05.jpg", "youtubeUrl": "https://www.youtube.com/watch?v=eOrNdBpGMv8", "description": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity."}`, with `X-Authorization` header wich contains accessToken (who can take from login/register response) **and must be creator of movie**
-   `DELETE /api/catalog/:movieId` - delete movie by given `movieId` **must be creator of movie**
-   `POST /api/catalog/like/:movieId` - gives current user a like to movie with given `movieId`
-   `POST /api/catalog/dislike/:movieId` - remove current user like from movie with given `movieId`
-   `POST /api/catalog/comments/:movieId` - create a new movie comment (post a JSON object in request body, e.g `{ "content": "comment content"}`)

Users

-   `POST /api/users/register` - registers a new user (send a JSON object in the request body, holding all fields, e.g. `{ "firstName": "Peter", "lastName": "Peterson", "username": "peter", "email": "peter@abv.bg", "password": "123456" }` and response is `{firstName: "user firstName", "lastName": "user lastName", "email": "user email", "id": "user id", "accessToken": "with generated JWT token", }` and adding default user avatar **important - every request need to have header X-Authorization with accessToken**
-   `POST /api/users/login` - logs in an existing user (send a JSON object in the request body, holding all fields, e.g. `{ "email": "peter@abv.bg", "password": "123456" }` response is same as register **important - every request need to have header X-Authorization with accessToken**
-   `GET /api/users/logout` - logs out an existing user (response is a object `{ "message": "Successfully logout."}`)
-   `GET /api/users/:userId` - returns a user object e.g. `{ _id: user._id, firstName: user.firstName, lastName: user.lastName,username: user.username,email: user.email,avatar: user.avatar,myMovies: user.myMovies,updatedAt: user.updatedAt }`
-   `PUT /api/users/:userId` - edit user by `userId` send a FormData object e.g. `const formData = new FormData(event.target)` and send formData with or whitout avatar image **(avatar must by jpg/png format)** this route using express-formidable middleware
