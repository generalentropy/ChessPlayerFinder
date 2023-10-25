import { players } from "./players.js";

const appVersion = "1.0.0";
const displayVersion = document.querySelector(".app-version");
const cardWrapper = document.querySelector(".cardWrapper");
const SUGGESTION_ITEM_CLASS = "suggestion-item";
const selectionSwitch = document.querySelector("#toggle-switch");
const searchBox = document.getElementById("searchBox");

// https://medium.com/@andrewmasonmedia/how-to-use-images-with-vite-and-vue-937307a150c0
function getImageUrl(name, ext) {
  return new URL(`/img/${name}.${ext}`, import.meta.url).href;
}

const searchPlayer = function () {
  if (!searchBox.value) return;

  const realName = searchBox.value;
  const [playerId] = players.filter((obj) => obj.joueur === realName);
  const site = selectionSwitch.checked ? "chess.com" : "lichess";
  const siteKey = selectionSwitch.checked ? "chesscom" : "lichess";

  if (!playerId) return noAccountFound(site);

  const chessComId = playerId.chesscom.toLowerCase();
  const lichessId = playerId.lichess.toLowerCase();

  if (!playerId || !playerId[siteKey]) {
    noAccountFound(site);
    return;
  }

  if (!selectionSwitch.checked) {
    cleanCardWrapperContent();
    cardWrapper.innerHTML = '<div class="custom-loader"></div>';
    fetchPlayerDataFromLichessAPI(lichessId, realName, generateChessCardHTML);
  }

  if (selectionSwitch.checked) {
    cleanCardWrapperContent();
    cardWrapper.innerHTML = '<div class="custom-loader"></div>';
    fetchPlayerDataFromChessComAPI(chessComId, realName, generateChessCardHTML);
  }
};

selectionSwitch.addEventListener("click", searchPlayer);

const cleanCardWrapperContent = () => (cardWrapper.innerHTML = "");

const playerNotFound = function () {
  cleanCardWrapperContent();
  cardWrapper.insertAdjacentHTML(
    "afterbegin",
    `<div class="error">❌ The player's profile could not be retrieved</div>`
  );
};

const noAccountFound = function (site) {
  cleanCardWrapperContent();
  cardWrapper.insertAdjacentHTML(
    "afterbegin",
    `<div class="error">ℹ️ The player is not in the database or does not have a ${site} account.</div>`
  );
};

const failedToFetch = function (error) {
  cleanCardWrapperContent();
  cardWrapper.insertAdjacentHTML(
    "afterbegin",
    `<div class="error">ℹ️ Error : (${error})</div>`
  );
};

const fetchPlayerDataFromChessComAPI = async (user, realName, callback) => {
  try {
    // fetch player data
    const fetchPlayerData = await fetch(
      `https://api.chess.com/pub/player/${user}`
    );

    // fetch player stats
    const fetchPlayerStats = await fetch(
      `https://api.chess.com/pub/player/${user}/stats`
    );

    if (fetchPlayerData.status === 404 || fetchPlayerStats.status === 404) {
      playerNotFound();
      return;
    }

    const source = "chess.com";
    const infosPlayer = await fetchPlayerData.json();
    const stats = await fetchPlayerStats.json();
    const avatar = infosPlayer.avatar || `${getImageUrl("user-image", "svg")}`;
    const lastOnline = new Date(
      infosPlayer.last_online * 1000
    ).toLocaleDateString();
    const memberSince = new Date(
      infosPlayer.joined * 1000
    ).toLocaleDateString();
    const username = infosPlayer.username;
    const bulletRating = stats?.chess_bullet?.last?.rating ?? "N/A";
    const blitzRating = stats?.chess_blitz?.last?.rating ?? "N/A";
    const rapidRating = stats?.chess_rapid?.last?.rating ?? "N/A";
    const tacticRating = stats?.tactics?.highest?.rating ?? "N/A";
    const bestBlitzRating = stats?.chess_blitz?.best?.rating ?? "N/A";
    const bestRapidRating = stats?.chess_rapid?.best?.rating ?? "N/A";
    const bestBulletRating = stats?.chess_bullet?.best?.rating ?? "N/A";
    const linkToProfil = infosPlayer.url;

    const data = {
      source,
      infosPlayer,
      stats,
      avatar,
      lastOnline,
      memberSince,
      username,
      blitzRating,
      rapidRating,
      tacticRating,
      bestBlitzRating,
      bestRapidRating,
      linkToProfil,
      bulletRating,
      bestBulletRating,
    };

    console.log(stats);
    console.log(infosPlayer);
    callback(data, realName); // Appeler la fonction de callback avec les données récupérées
  } catch (error) {
    failedToFetch(error);
    console.error("An error occurred:", error);
  }
};

const fetchPlayerDataFromLichessAPI = async (user, realName, callback) => {
  try {
    // fetch player data
    const fetchPlayerInfo = await fetch(`https://lichess.org/api/user/${user}`);

    // fetch stats bullet  // stat -> highest -> int
    const fetchBulletStats = await fetch(
      `https://lichess.org/api/user/${user}/perf/bullet`
    );

    // fetch stats blitz  // stat -> highest -> int
    const fetchBlitzStats = await fetch(
      `https://lichess.org/api/user/${user}/perf/blitz`
    );

    // fetch stats rapide  // stat -> highest -> int
    const fetchRapidStats = await fetch(
      `https://lichess.org/api/user/${user}/perf/rapid`
    );

    // Check response
    if (fetchPlayerInfo.status === 404) {
      playerNotFound();
      return;
    }

    const source = "lichess";
    const infosPlayer = await fetchPlayerInfo.json();
    const statsBullet = await fetchBulletStats.json();
    const statsBlitz = await fetchBlitzStats.json();
    const statsRapide = await fetchRapidStats.json();
    const avatar = `${getImageUrl("user-image", "svg")}`;
    const lastOnline = new Date(infosPlayer.seenAt).toLocaleDateString();
    const memberSince = new Date(infosPlayer.createdAt).toLocaleDateString();
    const username = infosPlayer?.username;
    const bulletRating = infosPlayer?.perfs?.bullet?.rating ?? "N/A";
    const blitzRating = infosPlayer?.perfs?.blitz?.rating ?? "N/A";
    const rapidRating = infosPlayer?.perfs?.rapid?.rating ?? "N/A";
    const tacticRating = infosPlayer?.perfs?.puzzle?.rating ?? "N/A";
    const bestBlitzRating = statsBlitz?.stat?.highest?.int ?? "N/A";
    const bestRapidRating = statsRapide?.stat?.highest?.int ?? "N/A";
    const bestBulletRating = statsBullet?.stat?.highest?.int ?? "N/A";
    const linkToProfil = infosPlayer?.url;

    console.log(bestBulletRating);

    const data = {
      source,
      infosPlayer,
      avatar,
      lastOnline,
      memberSince,
      username,
      blitzRating,
      rapidRating,
      tacticRating,
      bestBlitzRating,
      bestRapidRating,
      bestBulletRating,
      linkToProfil,
      bulletRating,
    };
    callback(data, realName); // Appeler la fonction de callback avec les données récupérées
  } catch (error) {
    failedToFetch(error);
    console.error("An error occurred:", error);
  }
};

const generateChessCardHTML = (data, realName) => {
  const {
    source,
    infosPlayer,
    stats,
    avatar,
    lastOnline,
    memberSince,
    username,
    blitzRating,
    rapidRating,
    tacticRating,
    bestBlitzRating,
    bestRapidRating,
    linkToProfil,
    bulletRating,
    bestBulletRating,
  } = data;

  const html = `
   <div class="card">
   <div class="picture"><img src="${avatar}" class="fit-image" /></div>
   <div class="name">${realName}</div>
   <div class="pseudo"><i>@${username}</i></div>

   <div class="infoDetails">
     <div class="online item">Last active : ${lastOnline}</div>
     <div class="puzzleRush item">Member since : ${memberSince}</div>
   </div>

   
   <div class="stats">
   <div class="blitz item">
   <div class="icon"><img id="bullet-icon" src="${getImageUrl(
     "bullet",
     "svg"
   )}"></div>
   <div class="label">Bullet</div>
   <div class="value">${bulletRating}</div>
 </div>

   <div class="blitz item">
   <div class="icon"><img id="blitz-icon" src="${getImageUrl(
     "lightning-fill",
     "svg"
   )}"></div>
   <div class="label">Blitz</div>
   <div class="value">${blitzRating}</div>
 </div>
     <div class="rapid item">
     <div class="icon"><img id="rapid-icon" src="${getImageUrl(
       "timer",
       "svg"
     )}"></div>
       <div class="label">Rapid</div>
       <div class="value">${rapidRating}</div>
     </div>

    
     <div class="tactic item">
     <div class="icon"><img id="puzzle-icon" src="${getImageUrl(
       "puzzle-piece-solid",
       "svg"
     )}"></div>
       <div class="label">Puzzles</div>
       <div class="value">${tacticRating}</div>
     </div>
   </div>
   

   <div class="stats2">
     <div class="best-stats item">Highest Blitz Rating : ${bestBlitzRating}</div>
     <div class="best-stats item">Highest Rapid Rating : ${bestRapidRating}</div>
     <div class="best-stats item">Highest Bullet Rating : ${bestBulletRating}</div>
   </div>
   
<div class="profil">
<div class="profilLink"><a href="${linkToProfil}" target="_blank">Go to ${source} profil</a></div>
</div>

 </div>
   `;

  cardWrapper.innerHTML = "";
  cardWrapper.insertAdjacentHTML("afterbegin", html);
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("searchForm");
  const suggestions = document.getElementById("suggestions");

  suggestions.style.display = "none";

  const names = players.map((obj) => obj.joueur);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    searchPlayer();
    suggestions.style.display = "none";
    console.log("Submitting form");

    console.log("Form submission prevented");
    console.log(searchBox.value.trim());
  });

  searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    // delete suggestion div content and player card
    suggestions.innerHTML = "";
    cardWrapper.innerHTML = "";

    if (!query) {
      suggestions.style.display = "none";
      return;
    }

    const filteredData = names.filter((item) =>
      item.toLowerCase().includes(query)
    );

    if (filteredData.length === 0) {
      suggestions.style.display = "none";
      return;
    }

    filteredData.forEach((item) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.textContent = item;
      suggestionItem.className = SUGGESTION_ITEM_CLASS;
      suggestionItem.addEventListener("click", function () {
        searchBox.value = this.textContent;
        suggestions.style.display = "none";
      });
      suggestions.appendChild(suggestionItem);
    });

    suggestions.style.display = "block";
  });

  // Add event on matching items
  suggestions.addEventListener("click", function (event) {
    if (event.target.classList.contains(SUGGESTION_ITEM_CLASS)) {
      const realName = event.target.textContent;

      const [playerId] = players.filter((obj) => obj.joueur === realName);

      const site = selectionSwitch.checked ? "chess.com" : "lichess";
      const siteKey = selectionSwitch.checked ? "chesscom" : "lichess";

      if (!playerId || !playerId[siteKey]) {
        noAccountFound(site);
        return;
      }

      cardWrapper.innerHTML = '<div class="custom-loader"></div>';

      const chessComId = playerId.chesscom.toLowerCase();
      const lichessId = playerId.lichess.toLowerCase();

      if (!selectionSwitch.checked) {
        fetchPlayerDataFromLichessAPI(
          lichessId,
          realName,
          generateChessCardHTML
        );
      }

      if (selectionSwitch.checked) {
        fetchPlayerDataFromChessComAPI(
          chessComId,
          realName,
          generateChessCardHTML
        );
      }
    }
  });
});

displayVersion.textContent = `Version : ${appVersion}`;
