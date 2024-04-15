// React
import React from "react";
// Styles
import * as styles from "../../pages/styles/leaderboards.module.css";


const games = {
  "mission01": "Mission 01: Paint Bomb",
  "mission02": "Mission 02: Foam Bomb",
};

export default function mappedGames({ _handleClick, selected }) {
  return (
    <div className={styles.gameContainer}>
      {Object.keys(games).map( index =>{
        const active = selected === games[index]
        return(
          <button key={index} className={[!active && styles.opaque].join(" ")} onClick={_handleClick} value={games[index]}>
            {games[index]}
          </button>
        )
      })}
    </div>
  );
} 