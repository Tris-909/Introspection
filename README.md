# Introspection

Introspection is a web based and mobile app for users to record their mistakes, have reports about them, setting up goals to fix them. It is a passion project from Tri Tran in an effort to create his own toolings for life usages.

## Api problems have been solved

- (29/12/2023) Express app scaffolder
- (31/12/2023) Connecting express app with firebase / firestore
- (31/12/2023) Folder Structure for `api` project
- (31/12/2023) Flexible / strong validators for endpoints
- (02/1/2024) Create util funcs to interact with Firestore
- (02/1/2024) Error router ( READ / CREATE / UPDATE / DELETE )
- (02/1/2024) Advanced error handling with custom error message / code and middlewares
- (03/1/2024) Integrating the whole project with TypeScript, adding missing types
- (04/1/2024) Using absolute path for imports by altering `tsconfig`
- (04/1/2024) First ever working migration file and figure out how to run them
- (05/1/2024) Set up jest configs and writing first test cases for controllers/error
- (06/07-1-2024) Set up CircleCI with 2 different environments DEV and PROD for deployment. Set up `Render` as Deployment Service for `api` project

## Web problems have been solved

- (08/01/2024) Setting up React Scaffolder with TypeScript, Setting up Env Var, Setting up CSS Libraries, Setting up Firebase initialization
- (09-10/01/2024) ->
  - Building authentication functions like Sign In / Sign Up / Forgot Password
  - Building UI including responsive layout, components following `Atomic Design` principles
  - Setting up Routers to switch between websites
  - Setting up Zustand for storing app context
  - Setting up some configs related to TypeScript to better dev experience
  - Using `formik` for handling form and build a toast to communicate with users
- (12-13/01/2024) ->
  - Developing dbUtils for Firestore
  - Create greeting user form when the user login the first time
  - Create 404 Not Found page
  - Create an AppBar that always stay at the top of the screen
- (14/01/2024) ->
  - Developing Record `Mistake` Dialog to save mistake into Firestore
  - Fix getAllDocuments function in FireStore and create a query index to able to query documents
- (15-16/01/2024) ->
  - Developing functional pagination components
  - Developing util function to fetch documents with cursor for pagination
  - Developing `Mistake` Component as `Accordion` and list of items as repititions of that mistake
  - Making everything with mobile-first approach
- (20/01/2024) ->
  - Deleting `Mistake` function with confirm dialog
  - Extracting fetched mistakes to global state so we can use it everywhere
  - Adding `Mistake` will update state locally
  - Adding some notification to notify the user after the creation and deletion of a mistake
- (21/01/2024) ->
  - Create ManageCategory Dialog
  - Allow user to edit tag, if a tag is updated it will find all related `Mistakes` and update the tags on it as well
  - Allow user to delete tag then update all related `Mistakes` to remove that tag from them
  - Allow user to create new tag
