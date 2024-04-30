# Contact Management App

This is a Contact Management App App built using vite React and json server.

## Getting Started

These instructions will help you set up a development environment and run the application on your local machine.


### Installation

1. Clone the repository or download the source code.

```bash

    git clone https://github.com/jayanth2308/Taiyo.Ai.git

```

2. Navigate to the project directory.


```bash

   cd client

```

3. Install the project dependencies Seperately for the client and json-server.

```bash

   npm install

```

## Running the Application

To start the development server and run the application, use the following commands

1.Run the json server in the first terminal 
```bash

     npm install json-server --save-dev


```
after installing package run this command in the first terminal
```bash

     npx json-server --watch db.json --port 3001

```
2.Now open another terminal and run the following commands
```bash

   cd client

```

```bash

     npm start

```



## Features

This Dashboard allows you to:

- Add a contact,edit and delete the contact .
- A line graph showing the cases fluctuations
- A react leaflet map with markers that indicates the country name, total number
of active, recovered cases and deaths in that particular country as a popup.

## Contributing

Feel free to contribute to this project if you'd like to add more features or improve it.

## Acknowledgments

Thank you for using this Platform!
Happy coding!