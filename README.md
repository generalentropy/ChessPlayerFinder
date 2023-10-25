# ChessPlayerFinder 🔎

[View demo](https://chessplayerfinder.netlify.app/)

An application for searching, viewing, and creating a database of chess player profiles

![](https://i.imgur.com/hn6VeqN.jpg)
![](https://i.imgur.com/U5F0JKo.jpg)

## Description

This is a simple web application for searching, viewing, and creating a database of chess player profiles. The application is written in vanilla JavaScript ES6 and CSS3, with no external libraries.

## Features

- This app allows you to fetch profiles from Chess.com and Lichess using their public API
- Search for chess player profiles by name
- View detailed profiles including statistics
- Works on mobile

![](https://i.imgur.com/VOVPAUD.jpg)
![](https://i.imgur.com/EGOzDEe.jpgs)

## Installation

1. Clone this repository to your local machine.
   ```bash
   git clone https://github.com/generalentropy/ChessPlayerFinder.git
   ```
2. Navigate to the project folder.
   ```bash
   cd ChessPlayerFinder
   ```
3. Start the development server
   ```bash
   npm run dev
   ```

## Usage

- To create you own "database" edit the players.js file

```JavaScript
 {
    joueur: "Magnus Carlsen",
    chesscom: "magnuscarlsen",
    lichess: "DrNykterstein",
  }
```

- If the player does not have an account, leave the quotes empty

```JavaScript
 {
    joueur: "Ian Nepomniachtchi",
    chesscom: "lachesisQ",
    lichess: "",
  }
```

## Contributing

The code is far from perfect, contributions and suggestions are welcome !

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
