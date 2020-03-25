# Interview Scheduler

Interview Scheduler is a fullstack app base on React, Express and PostgresSQL.
One can create, edit and delete an appoinment of interview using the app.

## Final Product

!["Screenshot of Interview Page"](https://github.com/wangxx1412/scheduler/blob/master/docs/Interview-Scheduler.png?raw=true)
!["Screenshot of Add Appointment"](https://github.com/wangxx1412/scheduler/blob/master/docs/Interview-Scheduler-Add.png?raw=true)

## Setup

Install dependencies with `npm install`.

Scheduler-API is served from Heroku with blank appoinments,

Or if you already have [Scheduler-API](https://wxx-scheduler-api.herokuapp.com/) at local, please package.json with:

```
 "proxy": "http://localhost:8001",
```

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Functionalities

- Choose one of weekday from Daylist to add appointment
- Add new appointment with name and select interviewer
- Edit appointment that has been created
- Cancel appointment
- Api is hosted on heroku with black data
- Test with storybook, cypress, react-testing library

## TODO Strech

- Websockets
