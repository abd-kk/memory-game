let difficulty = Array.from(document.querySelectorAll(".difficulty span"));

let blockContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blockContainer.children);
blocks.forEach((e) => e.classList.add("prevented"));

let wrongTriesInfo = document.querySelector(".tries span");
// Name container
let name = document.querySelector(".name span");

// Success sounds
let successSounds = Array.from(document.querySelectorAll(".success"));
wrongTriesInfo.append("0");

// Get the difficulty and the name of the user
difficulty.forEach((e) => {
  e.addEventListener("click", () => {
    let userName = document.querySelector(".userName").value;
    let diff = e.getAttribute("difficulty");
    document.querySelector(".starting-popUp").style.display = "none";
    startGame(userName, diff);
  });
});

function startGame(Username, diff) {
  blocks.forEach((e) => e.classList.remove("prevented"));
  blockContainer.classList.remove("prevent-clicking");
  name.append(Username || "Uknown");
  // Flipped Boxes by the User
  let flippedBoxes = [];
  // Duration of the flipping process
  let duration;
  if (diff === "easy") duration = 1000;
  else if (diff === "moderate") duration = 750;
  else if (diff === "hard") duration = 400;

  function shuffleItems() {
    blocks.forEach((item) => {
      const randomOrder = Math.floor(Math.random() * blocks.length);
      item.style.order = randomOrder;
    });
  }

  shuffleItems();

  blocks.forEach((e) => {
    e.addEventListener("click", function () {
      e.classList.add("flipped");
      flippedBoxes.push(e);
      // If the user flipped two boxes to test them
      if (flippedBoxes.length === 2) {
        preventClicking();
        checkWin();
        setTimeout(function () {
          if (
            flippedBoxes[0].getAttribute("data-technology") !==
            flippedBoxes[1].getAttribute("data-technology")
          ) {
            document.getElementById("fail").play();
            flippedBoxes[0].classList.remove("flipped");
            flippedBoxes[1].classList.remove("flipped");
            wrongTriesInfo.innerHTML++;
          } else {
            successSounds[
              Math.floor(Math.random() * (successSounds.length - 0.2))
            ].play();
          }
          flippedBoxes.length = 0;
        }, duration);
      }
    });
  });

  // Make all blocks flipped to the user to let him take a quick look then reflip them
  setTimeout(function () {
    blocks.forEach((e) => {
      e.classList.add("flipped");
    });
    setTimeout(() => {
      blocks.forEach((e) => {
        e.classList.remove("flipped");
      });
    }, duration);
  }, duration);

  function preventClicking() {
    blockContainer.classList.add("prevent-clicking");
    // Allow clicking
    setTimeout(() => {
      blockContainer.classList.remove("prevent-clicking");
    }, duration);
  }

  function checkWin() {
    for (let i = 0; i < blocks.length; i++)
      if (!blocks[i].classList.contains("flipped")) return; // If all the cards are not flipped so game is not finished
    // Else the game is finished and we should set the ending popup
    blocks.forEach((e) => e.classList.add("prevented"));
    let endingPopUp = document.createElement("div");
    endingPopUp.classList.add("popUp", "ending-popUp");
    let content = document.createElement("div");
    content.classList.add("content");
    let text = document.createElement("p");
    text.append("Congrats You Won!");
    let restart = document.createElement("div");
    restart.classList.add("restart");
    restart.append("Play again");
    content.append(text);
    content.append(restart);
    endingPopUp.append(content);
    document.body.prepend(endingPopUp);
    restart.addEventListener("click", function () {
      name.innerHTML = "";
      wrongTriesInfo.innerHTML = "";
      wrongTriesInfo.append("0");
      blocks.forEach((e) => e.classList.remove("flipped"));
      endingPopUp.remove();
      document.querySelector(".starting-popUp").style.display = "block";
    });
  }
}
