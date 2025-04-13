# TaskManagementApptest1

## Task Management Web App

A simple task management web application built using **Node.js**, **Express**, **EJS**, and **PostgreSQL**. This project demonstrates server-side rendering (SSR), input validation, persistent data storage, and secure backend practices.



## Features

- View a list of tasks
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Validate user input (title and description)
- Store data in a PostgreSQL database using secure, parameterized queries
- Fully server-rendered using EJS templates
- Styled using raw CSS


## Tech Stack

- Backend: Node.js, Express
- Database: PostgreSQL
- Templating: EJS
- Styling: CSS (Flexbox/Grid layout)
- No client-side JavaScript (SSR only)



## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) (v13+)
- [Git](https://git-scm.com/)


## Installation
**Clone the repository:**

   git clone [https://github.com/2019120162/TaskManagementApptest1.git]
   cd task-manager

Install dependencies:

**npm install**

Create a PostgreSQL database:

You can use psql or a GUI like pgAdmin.

**CREATE DATABASE taskmanager;**

Create the tasks table:

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


Run the app:

**npm start**

Visit http://localhost:3000 in your browser



## Youtube Video

[https://youtu.be/SIG6PjDSWus]
