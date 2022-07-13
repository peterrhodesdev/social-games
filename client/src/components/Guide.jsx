import React from "react";
import { useParams } from "react-router-dom";
import { getGameByName } from "../GameList";

function Guide() {
  const { gameName } = useParams();
  const game = getGameByName(gameName);
  return (
    <>
      <h1>Guide: {game.displayName}</h1>
      <div className="grid grid-cols-2">
        <div>
          {game.images.map((image) => (
            <>
              <p>
                <strong>
                  <u>{image.label}</u>
                </strong>
              </p>
              <img
                key={image.src}
                className="mb-4"
                src={`/assets/img/guide/${image.src}`}
                alt={image.alt}
              />
            </>
          ))}
        </div>
        <div>
          <p>{game.description}</p>
          <h2>Rules</h2>
          <ul>
            {game.rules.map((rule) => (
              <li key="rule">{rule}</li>
            ))}
          </ul>
          <h2>Controls</h2>
          <ul>
            {game.controls.map((control) => (
              <li key={control}>{control}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export { Guide };
