# HackCC 2025's QR service

## Overview

The QR identification service for HackCC 2025. Its main purpose is to authenticate and identify hacker's account.


The application service also helps with
- providing meals for hacker.
- keeping track of attendance at workshops.

The application built with [Nest.js](https://nestjs.com/). For other libraries or tools, the list of documentation below should be referenced:
- [Docker Compose](https://docs.docker.com/compose/intro/compose-application-model/)

## Getting Started
To run the app locally, follow the instructions below

### Prequisites
Requirements to deploy and run this project
- [Node.js v17 or higher.](https://nodejs.org/en/about/previous-releases)
- [Npm latest release](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Extension Requirement
Please use the following extension in order to comply to the project's stand
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Installation
At the location of where you want to place this project at, clone the repository using the command below
```bash
git clone git@github.com:HackCC-Official/qr-service-2025.git
```

Then enter directory and install the dependencies
```bash
cd qr-service-2025
npm install
```

### Environment Variable
Use the following env template or the one found `.env.example`.
```

```

## Running the application locally
Before running the application locally, make sure to create a `.env.local` file wihin the project source folder and fill the environmental variables from `.env.example` correctly. 

To run the application locally, use docker-compose to create a container of it
```bash
npm run start:docker
```

in some cases, such as environmental variable changes, you probably want to rebuild the container
```bash
npm run start:rebuild
```

Having the [Docker desktop](https://www.docker.com/) application will help immensely in this project

## Live Deployment
TBA

