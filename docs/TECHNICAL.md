# Technical Documentation
This document describes the technical description of the project.

## Refactoring 5 Sept 2026
Refactor few things and make the project more structured. Instead of using React scripts the project is change to Vite.JS scafolding the React App at Client. React Scripts is slow and takes too long to start the server but Vite.JS helps in serving the Client's development envirnoment much faster. The `Backend/` folder is changed with `server/`. Because it pairs much better with `client/` folder. All the folder and files are renamed with small case letters.

Challenge could be faced after `git pull` is to running the client. Delete `client/node_modules/` folder and run the installation again using `install.bat` for Windows and `install.sh` for Unix or Linux.
