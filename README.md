1. Storing the Code
The project code stays in one place on GitHub in a folder called mybook-tp. Inside that folder, there are two smaller folders. One folder is for the part users see, and the other folder is for the logic that runs behind the scenes. All new updates go to the main branch.

2. Automatic Checking
We use a tool that automatically checks the code every time a change is made. This tool prepares the environment and downloads all the necessary parts for both the front and back sections. It then tries to build the website. This step makes sure that the code works perfectly before it is sent to the internet.

3. Putting the User Interface Online
The part that users see is hosted on a platform called Vercel. Since the code is linked to this platform, any update on GitHub tells Vercel to grab the new files and build the site. This happens automatically so that the website is always up to date.

4. Putting the Server Online
The logic and database connection run on a platform called Render. This service is also connected to the same code folder. Once the automatic checks are finished, Render downloads the latest backend code and starts the server. This makes the system ready to handle requests from users.

5. Keeping Secrets Safe
Important settings and passwords are kept in a safe place on the hosting platforms. These secrets include the link to the database and special keys for security. We do not put these secrets into the code folder because that would be dangerous.

6. How Everything Works Together
The process follows these steps:

A person sends new code to GitHub.

The system automatically checks and builds the code.

Vercel updates the website for users to see.

Render updates the server to handle data.

Users open the website link and use the application.

The website talks to the server to save or load information.
