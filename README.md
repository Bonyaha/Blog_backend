<!-- starting server -->

1. npm start(normal start)
2. npm run dev (start with nodemon for restarting it when changes are made)
3. npm test (for testing)
4. npm run lint(for running linting)
   If you clone the project, run the npm install command before starting the application with npm start or npm run dev.

npm update - for updating the dependencies of the project

<!-- when you clone project from github -->

1. git clone address
2. cd bloglist-frontend // go to cloned repository
3. rm -rf .git //remove the git configuration of the cloned application
4. npm install //install its dependencies
5. npm start

### Commands for creating build folder and copy it to the backend

"build:ui": "rm -rf build && cd ../Frontend && npm run build && cp -r build ../Backend",\
"deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"

Q: "rm -rf build && cd ../Frontend && npm run build && cp -r build ../Backend",
what does this command do?
A: Let's break down the command step by step:

1. `rm -rf build`: This command removes the existing `build` folder in the backend directory. The `-r` flag means to remove the directory and its contents recursively, and the `-f` flag forces the removal without prompting for confirmation.

2. `cd ../Frontend`: This command changes the current directory to the `Frontend` folder. The `../` notation is used to navigate up one level in the directory hierarchy.

3. `npm run build`: This command executes the npm script named `build` in the `Frontend` folder. It is assumed that there is a script defined in the `package.json` file of the `Frontend` repository that performs the build process for the frontend application.

4. `cp -r build ../Backend`: This command copies the `build` folder (which was generated in the frontend build process) and its contents from the `Frontend` directory to the `Backend` directory. The `-r` flag indicates a recursive copy, ensuring that the entire `build` directory with its subdirectories and files is copied.

In summary, this command sequence removes the existing `build` folder from the backend, builds the frontend by running the `build` script in the frontend repository, and then copies the generated `build` folder to the backend directory. This allows you to automate the process of creating a production build of the frontend and integrating it with the backend without requiring manual steps.

### the second command (npm run deploy:full) run the first one and commit it to remote git repo

node mongo.js password - command for interacting with the database (instead 'password' word paste your password from mongo db)

MongoDb:
url for connection:
mongodb+srv://Roman:`<password>`@cluster1.d7mltpu.mongodb.net/?retryWrites=true&w=majority (Replace `<password>` with the password for the Roman user)
