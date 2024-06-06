# EDResurgence-VotingJSON-Builder
Updated Electron based desktop application for sever hosts to create the required voting.json and mods.json files with the new updated json format for Eldewrito 0.7

[![Discord](https://img.shields.io/badge/Discord-Join%20the%20ED%20Modpacks%20Discord-green?style=for-the-badge&logo=discord&link=https://discord.gg/CPc7Gf7TPf)](https://discord.gg/CPc7Gf7TPf)

<img src="./resources/icon.png" width=300 >

## What is ED Resurgence Voting Json Builder

ED Resurgence Voting Json Builder is a tool designed for ElDewrito server hosts to quickly and easily build a valid voting.json and mods.json file for their server playlist rotation.

## Minor Warning

running the app installer for the first time may trigger your antivirus, this is a false alert due to the app not being signed, if you have used other electron applications such as the r2modman mod manager this is the same issue. The application is safe but if you feel more comfortable creating your own distributable feel free to fork the repo and click the actions tab, select the `Build/release Electron app` workflow and run the workflow in the latest release branch/tag.

## Features

- Support for an extensive list of ElDewrito mods and growing!
- User personalization with a list of background options
- Accessible UI with options for high contrast text
- Streamlined process automation to build valid json files with minimal user requirements
- Server override pre-game and post-game commands built into each variant entry
- Support for base-game Gamemodes and Maps
- Persistent data storage to save user preferences and save voting.jsons to quickly and easily switch and reload server playlists
- Tested and valid JSON output to guarantee you get your server up and running with minimal issues

## Planned Future Features
- Read/Write json functionality to edit already written valid voting.json files (the save and reload feature lays the majority of the groundwork for this)
- Advanced map options (custom map thumbnails, player count requirements and random chance weight)

## Recommended IDE Setup For New Forks

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Pre-requisites

Requires Node.js version 20+

## Project Setup

### Download Locally

Git Clone the repo using the git url from your repo with your CLI e.g.
```bash
git clone https://github.com/The-Nightman/EDResurgence-VotingJSON-Builder.git
```

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# You can locally only build the executable for the os that the app is built on
$ npm run build
```