# WebUntis - WhatsApp Bridge/ChatBot

This tool is a chatbot for WhatsApp to retrieve data from the timetable app/website [WebUntis](https://webuntis.com) for schools and universities.

The repository is still under development and might contain some bugs. Please report these bugs so I can fix them as soon as possible :D

---

## Features

### Timetable Live-Updates

If there is a new substitute lesson or a class is cancelled, you will receive a message via WhatsApp.

![Example Message Live-Update](https://i.2807.eu/CLSWn.png)

### ChatBot with Untis-Data

You can also chat with this bot via private message or in groups. Below you will find a list of all the commands this bot can use.

Unfortunately, the commands `!teacher` and `!room` only work with a WebUntis account that has access as a teacher.

### All Commands:

| Command |   Alias   |                     Description                      | needed WebUntis-Access |
| :-----: | :-------: | :--------------------------------------------------: | :--------------------: |
| config  | configure | configure Chat-Settings and create links to WebUntis |        student         |
|  eval   |           |      execute evaultation commands (only Admin)       |           /            |
|  ping   |           |                just a normal Ping :D                 |           /            |
|  room   |   raum    |          check the current class in a room           |        teacher         |
| teacher |  lehrer   |     search in which room a teacher is right now      |        teacher         |

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
pm2 start main.js
```

---

</details>

## Configuration

For my personal use I use my private home phone number with a WhatsApp account.

### [config.json](./config.json.example)

-   **timetable** should looks like this :D
-   **class_name** can be anything, just to identify
-   **classID** this is the classID of WebUntis
-   **whatsapp_groupID** is the groupID of WhatsApp

---

```js
{
    "timetable": [
        {"lesson": 1, "start": "07:50", "end": "08:35"},
        {"lesson": 2, "start": "08:35", "end": "09:20"},
        {"lesson": 3, "start": "09:40", "end": "10:25"},
        {"lesson": 4, "start": "10:25", "end": "11:10"},
        {"lesson": 5, "start": "11:30", "end": "12:15"},
        {"lesson": 6, "start": "12:15", "end": "13:00"},
        {"lesson": 7, "start": "13:20", "end": "14:05"},
        {"lesson": 8, "start": "14:10", "end": "14:55"},
        {"lesson": 9, "start": "14:55", "end": "15:40"}
    ],
    "classes": [
        {
            "class_name": "Q1",
            "classID": "872",
            "whatsapp_groupID": "123456789123456789@g.us"
        }
    ]
}
```

> [!TIP]
> Using [getGroupIDs.js](./getGroupIDs.js) you can get the IDs of all groups that a whatsapp account is connected to.
>
> ```
> node getGroupIDs.js
> ```

---

### Environment .env

-   **NODE_ENV** should be on production
-   **chrome_path** with that you can provide the chrome path (it is not necessary on windows or in codespace)
-   **untis_baseurl**, **untis_school**, **untis_username**, **untis_password**
-   **untis_teacher_access** there are some commands that only works with a teacher account. If you have access to a teacher account set this to **true**
-   **whatsapp_admins** every user that is permitted to use admin only commands like _!eval_
-   **language_model** you can choose the language of your bot. You can add your own language model in src/language/[language].json
-   **APIPORT** API Port of the API :D

![Construction WebUntis-URL](https://i.2807.eu/jqlb8.png)

```
NODE_ENV=production
chrome_path="path to chrome (remove line if not necessary)"

untis_baseurl="test123.webuntis.com"
untis_school="school_name here"
untis_username="user_login here"
untis_password="your password here"
untis_teacher_access=false

whatsapp_admins=['491234567890@c.us']

language_model="english.json"

APIPORT="5006"
```

## Credits

Big thanks to the collaborators of [webuntis](https://github.com/SchoolUtils/WebUntis) and [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) for the work on those libraries!
