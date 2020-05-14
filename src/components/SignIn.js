import React from 'react'
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faSpotify as Spotify } from '@fortawesome/fontawesome-free-brands';

export default function SignIn() {
  const FavIcon = (
    <span className="favIcon">
      <FAIcon size="7x" icon={Spotify} style={{ color: 'green' }} />
    </span>
  );

  return (
  <div>
    <center id="spotifyLogin">
      <a className="black" href="/authorize">
        {FavIcon}
        <br></br>
        <br></br>
        LOGIN WITH SPOTIFY
      </a>
    </center>
  </div>
  )
}
