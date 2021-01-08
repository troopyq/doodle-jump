let cnv = document.createElement('canvas');
let ctx = cnv.getContext(`2d`);
cnv.width = document.body.offsetWidth;
cnv.height = document.body.offsetHeight;
document.body.appendChild(cnv);

let game = {
  state: `play`,
  score: 0,
  time: 0,
};
let settings = {
  gravityUp: 100,
  gravityDown: 2,
  dmax: 10,
  platformCount: 15,
  dropCount: 10,
};
let player = {
  x: Math.floor(cnv.width / 2),
  y: cnv.height - 70,
  width: 20,
  height: 50,
  speed: 5,
  moving: false,
  jumping: false,
  fall: false,
  dy: 0,
  dd: 1,
  maxHeightJumping: 180,
  heightJumping: 0,
};
let keys = [];
let drops = [];
let platforms = [
  {
    id: 0,
    width: 70,
    height: 10,
    x: Math.floor(player.x - 35),
    y: Math.floor(player.y + player.height),
  },
];

function startGame() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  drawBackground();
  drawPlatforms();
  drawDrop();
  drawPlayer();
  drawLayer();
  requestAnimationFrame(startGame);
}
startGame();

function drawBackground() {
  ctx.fillStyle = `#ccf`;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
}

function score() {
  for (let d of drops) {
    // console.log(player.x >= d.x && player.x + player.width <= d.x);

    if (
      player.x >= d.x &&
      player.x + player.width <= d.x &&
      player.y + player.height >= d.y &&
      player.y <= d.y
    ) {
      game.score += d.score;
      console.log('score:' + game.score);
    }
  }
}

function drawLayer() {
  ctx.fillStyle = `#000`;
  ctx.font = `bold 30px sans-serif`;
  if (game.state == `play`) {
    ctx.save();
    score();
    ctx.fillText(`Score: ${game.score}`, 10, 40);
  } else if (game.state == `end`) {
    ctx.fillText(`Score: ${game.score}`, 10, 40);
    ctx.fillText(`Dead`, cnv.width / 2 - 50, cnv.height / 2 + 30);
    ctx.restore();
  }
}

function drawPlayer() {
  movePlayer();
  ctx.fillStyle = `#4a5`;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
  gravity();
  if (keys[37] && player.x >= 0) {
    player.moving = true;
    player.x -= player.speed;
  }
  if (keys[39] && player.x <= cnv.width - player.width) {
    player.moving = true;
    player.x += player.speed;
  }
  if (keys[38] && !player.jumping) {
    player.jumping = true;
    // player.y -= settings.gravityUp;
  }
}

window.addEventListener(`keydown`, (e) => {
  keys[e.keyCode] = true;
});
window.addEventListener(`keyup`, (e) => {
  keys[e.keyCode] = false;
});
window.addEventListener(`touchstart`, (e) => {
  if (e.target.classList.contains('left')) {
    keys[37] = true;
  }
  if (e.target.classList.contains('right')) {
    keys[39] = true;
  }
  if (e.target.classList.contains('jump')) {
    keys[38] = true;
  }
});
window.addEventListener(`touchend`, (e) => {
  if (e.target.classList.contains('left')) {
    keys[37] = false;
  }
  if (e.target.classList.contains('right')) {
    keys[39] = false;
  }
  if (e.target.classList.contains('jump')) {
    keys[38] = false;
  }
});

function collision(subj) {
  for (let pl of subj) {
    if (
      player.y + player.height >= pl.y && //top
      player.y <= pl.y + pl.height && //bottom
      player.x + player.width > pl.x &&
      player.x < pl.x + pl.width
    ) {
      return {
        is: true,
        id: pl.id,
        down: player.y <= pl.y + pl.height && player.y >= pl.y,
        up: player.y + player.height >= pl.y,
      };
    }
  }
  return { is: false };
}

function gravity() {
  // console.log(collision());
  if (player.y > cnv.height) {
    game.state = 'end';
  }

  if (collision(platforms).is) {
    player.fall = false;
    if (collision(platforms).down) {
      player.fall = true;
    }
    player.dy = 0;
    // player.jumping = false;
    for (let pl of platforms) {
      if (pl.id == collision(platforms).id && !collision(platforms).down) {
        // player.y = pl.y - player.height;
      }
    }
  } else {
    if (!player.jumping) {
      player.fall = true;
    }
  }

  if (player.jumping) {
    player.dy += player.dy < settings.dmax ? player.dd : 0;
    player.heightJumping += player.dy;
    if (player.heightJumping >= player.maxHeightJumping) {
      player.dy = 0;
      player.heightJumping = 0;
      player.jumping = false;
      player.fall = true;
    }
    player.y -= player.dy;
    if (collision(platforms).down) {
      player.dy = 0;
      player.heightJumping = 0;
      player.jumping = false;
      player.fall = true;
    }
    // console.log('up:' + player.dy);
  }

  if (player.fall) {
    player.dy += player.dy < settings.dmax ? player.dd : 0;
    player.y += player.dy;
    // console.log('down:' + player.dy);
  }
}

function drawPlatforms() {
  if (platforms.length <= settings.platformCount) {
    let platform = {
      id: platforms.length,
      width: 70,
      height: 10,
      x: Math.floor(Math.random() * (cnv.width - 70)),
      y: Math.floor(Math.random() * cnv.height),
    };
    platforms.push(platform);
  }
  platforms.forEach((platform) => {
    ctx.fillStyle = `#45a`;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawDrop() {
  if (drops.length <= settings.dropCount) {
    let drop = {
      id: drops.length,
      score: 10,
      width: 8,
      height: 8,
      x: platforms[drops.length].x + platforms[drops.length].width / 2 || Math.random() * cnv.width,
      y: platforms[drops.length].y - 15 || Math.random() * cnv.height,
    };
    drops.push(drop);
  }
  drops.forEach((drop) => {
    ctx.fillStyle = `#b22`;
    ctx.beginPath();
    ctx.arc(drop.x, drop.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  });
}
