# OpenAI API DOCU documentation generator - Node.js app

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   cd openai-course-project
   ```

4. Install the requirements

   ```bash
   npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   cp .env.example .env
   ```
   On Windows:
   ```powershell
   copy .env.example .env
   ```
   After doing that you can remove `.env.example` from the project 

6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

Firstly, build the app
   ```bash
   npm run build
   ```
Secondly, start runnig the app
   ```bash
   npm run start
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)
