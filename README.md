# WebUntis - WhatsApp Bridge/ChatBot

This tool is a chatbot for WhatsApp to retrieve data from the timetable app/website [WebUntis](https://webuntis.com) for schools and universities.

The repository is still under development and might contain some bugs. Please report these bugs so I can fix them as soon as possible :D

--- 

## Features

### Timetable Live-Updates
If there is a new substitute lesson or a class is cancelled, you will receive a message via WhatsApp.

![Example Message Live-Update](https://github.com/Florian2807/webuntis-whatsapp-bridge/assets/84639717/33c827ce-660c-463c-9d43-20aeedd55363)


### ChatBot with Untis-Data
You can also chat with this bot via private message or in groups. Below you will find a list of all the commands this bot can use.

Unfortunately, the commands `!teacher` and `!room` only work with a WebUntis account that has access as a teacher.

### All Commands: 

| Command  | Alias | Description  | needed WebUntis-Access|
|:--------:|:-----:|:------------:|:---------------------:|
 | config | configure | configure Chat-Settings and create links to WebUntis | student
 | eval |  | execute evaultation commands (only Admin) | /
 | ping |  | just a normal Ping :D | /
 | room | raum | check the current class in a room | teacher
 | teacher | lehrer | search in which room a teacher is right now | teacher 

--- 

## Installation

Install [Node.js](https://nodejs.org/), if you don't have it already.

**Clone** the repository:
```bash
git clone https://github.com/Florian2807/webuntis-whatsapp-bridge | cd webuntis-whatsapp-bridge
```
**Edit** the config.json:
```bash
cp config.json.example config.json
vim config.json
```
**Install** the dependencies:
```bash
npm install
```
To **Run** the server:
```bash
node main.js
```

---
<details>
  <summary><u>Use PM2</u></summary>

  You also can use [PM2](https://www.npmjs.com/package/pm2) to run this application in the background:

  **Install** PM2 as a global dependency:
  ```bash
  npm install -g pm2
  ```

  **Run** the application:
  ```bash
  pm2 start index.js
  ```
  ---
</details>

## Configuration

For my personal use I use my private home phone number with a WhatsApp account.

### [config.json](./config.json.example)

- **class_name** can be anything, just to identify
- **classID** this is the classID of WebUntis
- **whatsapp_groupID** is the groupID of WhatsApp

With [getGroupIDs.js](./getGroupIDs.js) you can get all groups with IDs the WhatsApp account is connected to.

```js
{
  "classes": [
    {
      "class_name": "Q1",
      "classID": "123",
      "whatsapp_groupID": "112233445566778899@g.us"
    }
  ]
}
```
___

### Environment .env
- **NODE_ENV** should be on production 
- **untis_school**

![Construction WebUntis-URL](https://github.com/Florian2807/webuntis-whatsapp-bridge/assets/84639717/6b77aa3f-f1d1-4ed1-b1f0-bc44d3be72ab)


- **untis_teacher_access** there are some commands that only works with a teacher account. If you have access to a teacher account set this to **true**
- **whatsapp_admins** every user that is permitted to use admin only commands like *!eval*
- **APIPORT** API Port of the API :D 
```
NODE_ENV=production

untis_school="school_name here"
untis_username="user_login here"
untis_password="your password here"
untis_baseurl="test123.webuntis.com"
untis_teacher_access=false

whatsapp_admins=['491234567890@c.us']

APIPORT="5006"
```
