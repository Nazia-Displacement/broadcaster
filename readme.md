## Displacement MIDI Broadcaster

> This application is designed to operate on the computer connected to the panel for the [Displacement](https://formblu.com/displacement) project. It receives MIDI data and broadcasts it to the server, enabling connections with Unity clients through Socket.IO.

## Prerequisites

This project is tested on the following Node and NPM versions. [Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install. To make sure you have them available on your machine, try running the following command.

```sh
$ npm -v && node -v
```

9.8.1  
v18.18.2

## Table of contents

- [Displacement MIDI Broadcaster](#displacement-midi-broadcaster)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Serving the app](#serving-the-app)
    - [Building a distribution version](#building-a-distribution-version)
  - [Credits](#credits)
  - [Built With](#built-with)
  - [Authors](#authors)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine: To install the needed modules run in the project directory:

```sh
npm install
```

## Usage

### Serving the app

```sh
$ npm start
```

### Building a distribution version

```sh
$ npm run build
```

## Credits

- [Displacement Team](https://formblu.com/displacement-prototyping)

## Built With

- Node.js
- Electron
- node-midi

## Authors

- **Isaac Hisey** - _Initial work_ - [TheTornadoTitan](https://github.com/thetornadotitan)
