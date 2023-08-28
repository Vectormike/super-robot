# Senior Backend Engineer Test - Submission

## Overview

This project is a RESTful API built using Node.js, Express, TypeScript, and PostgreSQL. It features a simple token-based authentication system, basic input validation, and error handling. The database consists of three tables: Users, Posts, and Comments. The API endpoints facilitate CRUD operations for these tables. Additionally, there is a specific endpoint that fetches the top 3 users with the most posts and the latest comment made by each of those users.

## Project Structure

- `/models` - Contains database models for Users, Posts, and Comments.
- `/controllers` - Contains logic for handling requests.
- `/routes` - Contains endpoint routes.
- `/middlewares` - Contains middleware functions, including authentication.
- `/tests` - Contains unit tests.
- `/utils` - Contains utility functions and constants.
- `Dockerfile` - Instructions for building the Docker container.
- `.env` - Contains environment variables (not committed to Git for security).

## Endpoints

1. Create and retrieve users: `/users`
2. Create a post for a user and retrieve all posts of a user: `/users/:id/posts`
3. Add a comment to a post: `/posts/:postId/comments`
4. Fetch the top 3 users with the most posts and the latest comment they made: (Endpoint URL provided in the Postman collection)

## Tools/Stack

- Node.js (with TypeScript & Express)
- MySQL
- Redis
- Docker
- Postman for API documentation

## Getting Started

### Prerequisites

- Node.js
- MySQL
- Redis
- Docker

### Setup

1. Clone the repository:

   ```bash
   git clone [repository-link]
   ```

2. Navigate to the project directory:

   ```bash
   cd [project-directory]
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the `.env` file with your environment variables.

5. Build and run the Docker container:

   ```bash
   docker-compose up --build
   ```

6. The API should now be running at `http://localhost:PORT`, where `PORT` is the port specified in the `.env` file.

## Testing

Run unit tests using the following command:

```bash
npm test
```

## API Documentation

The Postman collection with all the endpoint documentation can be found [here](Postman-Collection-Public-URL).

## Deployment

The live version of the API is hosted on Heroku and can be accessed [here](Hosted-API-URL).

## Feedback

If you have any feedback or run into issues, please file an issue on this GitHub repository.

---

Feel free to customize the README according to your project's specifics.
