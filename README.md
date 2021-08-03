# Vehicle Service & Maintenance Log

[Vehicle Service & Maintenance Log](https://www.maintlog.net/ "Vehicle Service & Maintenance Log")

### A vehicle maintenance log application.

- Create, Edit, Delete, and View Vehicle Service History
- Track what was completed, when, by whom, and with what costs (i.e.: parts and labor)
- Log entries can include part numbers, tools used, short description, longer description for remembering detailed steps/instructions, image uploads for receipts or to show work in progress (before and afters, etc.), all associated with any one of the user's saved vehicles.

#### Installation Instructions

1. Clone this repository `git clone https://github.com/Usarneme/maint_log`
2. Enter the new directory `cd maint_log`
3. Install server dependencies with `npm install`
4. Create a file called variables.env with `touch variables.env` and include the following information:

```env
NODE_ENV=development
DATABASE=mongodb:// **YOUR LOCAL DB CONNECTION STRING**
MAIL_USER= **YOUR MAIL SERVICE USERNAME**
MAIL_PASS= **YOUR MAIL SERVICE PASSWORD**
MAIL_HOST= **YOUR MAIL SERVICE HOST ADDRESS**
MAIL_PORT= **YOUR MAIL SERVICE PORT #**
PORT=7777
SECRET= **YOUR SERVER SESSION SECRET**
KEY= **YOUR SERVER SESSION KEY**
CLOUDINARY_URL= **YOUR CLOUDINARY/OTHER IMAGE HOSTING SERVICE URL**
FRONTEND_URL=http://localhost:7777
FRONTEND_ORIGINS=['http://localhost:3000','https://localhost:3000','http://localhost:7777','https://localhost:7777','https://maintenancelog.net','http://maintenancelog.net','https://maintlog.net','http://maintlog.net','https://www.maintenancelog.net','http://www.maintenancelog.net','https://www.maintlog.net','http://www.maintlog.net']
ATLAS_DB= **YOUR CLOUD DATABSE PROVIDER CONNECTION STRING**
```

NOTE: You'll have to replace everything between four asterisks with your own service private info.

5. Enter the client directory `cd client`
6. Install client dependencies with `npm install`
7. Return to the project root with `cd..`
8. Run the back end and front end dev servers with `npm run start:dev`
9. Visit http://localhost:7777 in your browser of choice

#### Features

- Default Dark Mode
- Theme Switching
- User Account Creation
- Forgot Password Reset Utility
- Save Multiple Vehicles
- Vehicle Lookup via VIN
- Vehicle Lookup via Year+Make+Model
- Manual Entry of Vehicle Details
- Track Vehicle Odometer
- Image Uploads
- Indexed Searching
- Set future due date for upcoming vehicle service
- Set future mileage for upcoming vehicle service
- Image Uploads for receipts or to demonstrate service specifics

#### Possible Upcoming Features

- Charts showing costs by date range, vehicle
- Metrics detailing service intervals
- Export and/or Share Log
- Export and/or Share Metrics/Charts
- Notifications of upcoming services based on odometer and/or date
- Share and compare your service entries with other users - become a social tool for DIY mechanics

#### Built With

##### Backend

- NodeJS Server (Express)
- MongoDB (via Mongoose Node Driver)
- PUG (Jade) Email Templates (w/Text Backup for non-HTML Email Clients)
- Cloudinary Image Hosting

##### Frontend

[Frontend Documentation](https://usarneme.github.io/maint_log_docs/ "Frontend Documentation")

- React
- JavaScript (UI/Behavior)
- HTML5
- JSX
- CSS3

Please visit us at: [www.maintlog.net](https://www.maintlog.net/ "Vehicle Service & Maintenance Log")

#### Copyright Tom/Usarneme
