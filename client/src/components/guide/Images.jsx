import React from "react";

function Images({ game }) {
  return game.images.map((image) => (
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
  ));
}

export { Images };
