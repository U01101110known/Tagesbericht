function loadHighScore() {
  var f = require("Storage").open("jump.score", "r");
  return f.readLine() || 0;
}

function saveHighScore(score) {
  var f = require("Storage").open("jump.score", "w");
  f.write(score + "\n");
}


  var i = 0;
  var j = 0;
  var max = 170;
  var min = 150;
  var Times = 0;
  var btnp = false;
  var framern = 0;
  var stop = false;
  var blockname = [1];
  var interval = 0;
  var timeout = 0;
  var timeoutt = false;


function startendmenu() {
  j = 0;
  timeout = 0;
  interval = 0;
  framern = 0;
  timeoutt = false;
  blockname = [];
  g.clear();
  stop = false;
}

function endmenu() {
  if (loadHighScore() < framern) {
    saveHighScore(framern);
  }
  g.clear();
  g.setFont("4x6", 2);
  g.drawString("You died!", 50, 50);
  g.drawString("Score: ", 45, 63);
  g.drawString(framern, 100, 63);
  g.drawString("Your Best is: ", 20, 76);
  g.drawString(loadHighScore(), 130, 76);
  var framern = 0;
  setWatch(startendmenu, BTN1, {
    repeat: false,
    edge: "rising"
  });
}

function spawn(randn) {
  if (j == 10) {
    j = 0;
  }
  g.drawLine(170, 155, 170, 170);
  blockname[j] = framern;
  print(blockname[j]," ", j);
  j++;
}

function drawplayer() {
  g.drawLine(33, 150, 33, 170);
}

function buildbase() {
  g.clear();
  g.drawLine(0, 170, 200, 170);
}

function fall(input) {
  max = max + input;
  min = min + input;
  g.drawLine(33, min, 33, max);
  if (Times > 21) {
    Times = 0;
    btnp = false;
  }
}

function jumpup() {
  input = 2;
  if (Times <= 10) {
    Times++;
    max = max - input;
    min = min - input;
    g.drawLine(33, min, 33, max);
  } else {
    Times++;
    fall(input);
  }
}

function BTN0() {
  btnp = true;
}

function spawnmove() {
  for (let m = 1; m < blockname.length; m++) {
    if (stop == false) {
      var minus = framern - blockname[m];
      g.drawLine(170 - minus, 155, 170 - minus, 170);
      /*if (framern - blockname[m] > 180) {
        g.clear();
      }*/
      if (framern - blockname[m] == 137) {
        if (Times >= 8 && Times <= 14) {} else {
          stop = true;
          g.clear();
          endmenu();
        }
      }
    }
  }
}

function onframe() {
  framern++;
  if(timeoutt == true) {
    timeout--;
  }
  g.clear();
  buildbase();
  g.drawString(framern, 10, 10);
  if (btnp == false) {
    drawplayer();
  } else {
    jumpup();
  }
  spawnmove();
  if (timeout == 0) {
    timeoutt = false;
    var random = Math.random() * 100;
    if (random >= 95) {
      spawn(random);
      timeout = 60;
      timeoutt = true;
    }
  }
}

function main() {
  if (stop == false) {
    g.clear();
    onframe();
  }
}


function startmenu() {
  interval = 0;
  framern = 0;
  timeout = 0;
  stop = false;
  g.clear();
  g.setFont("4x6", 2);
  g.drawString("Press Button to Start", 5, 50);
  setWatch(menu, BTN1, {
    repeat: false,
    edge: "rising"
  });
}

function menu() {
  setWatch(BTN0, BTN1, {
    repeat: true,
    edge: "rising"
  });
  if (stop == false) {
    interval = setInterval(main, 40);
  }
}

  startmenu();