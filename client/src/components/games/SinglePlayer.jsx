import React, { useEffect, useState } from "react";
import { getGameComponent } from "../../services/GameService";
import { getOne } from "../../services/HttpService";

function SinglePlayer({ gameName }) {
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getNewGame = async () => {
      setIsLoading(true);
      try {
        const response = await getOne(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/game`,
          gameName
        );
        setGameData(response.parsedBody);
      } catch (err) {
        setHasError(true);
      }
      setIsLoading(false);
    };

    getNewGame();
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {hasError && <p>Error</p>}
      {gameData && getGameComponent(gameName, { gameData })}
    </>
  );
}

export { SinglePlayer };
