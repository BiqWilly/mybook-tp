The MyBook TP platform is a full stack web application designed to support a digital library and learning community experience for students and administrators.

The purpose of the website is to allow users to browse books, manage reservations, participate in discussion forums, and handle authentication through a secure and role based system. Students can explore available books, view details, make reservations, and engage with other users through posts and discussions. Administrators are able to manage content and oversee library related operations.

The system is built with a clear separation between frontend and backend responsibilities. The frontend provides an interactive user interface for browsing and user actions, while the backend exposes a REST API that handles authentication, data processing, and database operations. All persistent data is stored in a cloud hosted database.

The application follows modern DevOps and GitOps practices. Source code is managed through a version controlled repository. Automated continuous integration ensures that dependencies are installed and the frontend build process succeeds on every push to the main branch. Automated deployment ensures that approved changes are released consistently to cloud hosting platforms without manual intervention.

This approach improves reliability, maintainability, and scalability while demonstrating industry standard practices in full stack development and deployment.

Frontend Application
Backend API
Cloud Database
Automated Integration
Automated Deployment
Production Ready Architecture
