## Displacement MIDI Broadcaster

> This application is meant to run on the computer connected to the panel for the displacement project https://formblu.com/displacement. The application will intake midi data and broadcast it to the server connecting Unity clients via socket.io.

## Prerequisites

This project is tested on the following Node and NPM versions.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
9.8.1
v18.18.2
```

## Table of contents

- [Displacement MIDI Broadcaster](#Displacement-MIDI-Broadcaster)
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

Start with cloning this repo on your local machine:
To install the needed modules run in the project directory:
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

- Nazia Parvez - Owner of https://formblu.com/ and creative mind behind the project
- John-Michael Reed - Creator of the hardware and its [code](https://github.com/BleepLabs/Parvez-touch-panel). See their Github: [BleepLabs aka Dr. Bleep](https://github.com/BleepLabs)

## Built With

- Node.js
- Electron
- node-midi

## Authors

- **Isaac Hisey** - _Initial work_ - [TheTornadoTitan](https://github.com/thetornadotitan)
