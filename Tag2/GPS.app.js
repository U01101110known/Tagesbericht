
function val1r(preset) {
  var f = require("Storage").open("val1.score", "r");
  return f.readLine(preset) || 0;
}

function val1w(value) {
  var f = require("Storage").open("val1.score", "w");
  for (let i = 0; i < value.length; i++) {
    f.write(value[i] + "\n");
  }
}

function val2r(preset) {
  var f = require("Storage").open("val2.score", "r");
  return f.readLine(preset) || 0;
}

function val2w(value) {
  var f = require("Storage").open("val2.score", "w");
  for (let i = 0; i < value.length; i++) {
    f.write(value[i] + "\n");
  }
}

function Defaultr() {
  var f = require("Storage").open("def.score", "r");
  return f.readLine() || 0;
}

function Defaultw(value) {
  var f = require("Storage").open("def.score", "w");
  f.write(value + "\n");
}

var menu = require("graphical_menu");
var m;
var arr1 = [];
var arr2 = [];
var lat = NaN;
var lon = NaN;
var rlat = 0;
var rlon = 0;
var setv = false;
var x = ".";
var Times = 1;
var submenuv = Defaultr();
submenuv++;
var submenu;
var inmenu = false;
var change = false;

function radians(n) {
  return n * (Math.PI / 180);
}
function degrees(n) {
  return n * (180 / Math.PI);
}

function getBearing(startLat,startLong,endLat,endLong){
  startLat = radians(startLat);
  startLong = radians(startLong);
  endLat = radians(endLat);
  endLong = radians(endLong);

  var dLong = endLong - startLong;

  var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}




// function calc d = ?[(x? - x?)� + (y? - y?)�+ (z? - z?)�]
function dis(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const deltaP = p2 - p1;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) * Math.cos(p2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
  return d;

}





Bangle.setGPSPower(1);
Bangle.on('GPS', function(gps) {
  if (setv == false) {
    g.setFont6x15(3);
    lat = gps.lat;
    lon = gps.lon;
    if(change == false){
    submenuv--;
    rlat = val1r(submenuv);
    rlon = val2r(submenuv);
    submenuv++;}
    print(gps.time);
    if (isNaN(lat) == true || isNaN(lon) == true || lat == "undefined" || lon == "undefined") {
      if (inmenu == false) {
        g.clear();
        ERROR();
      }
    } else {
      print("LAT = ", lat, "LON = ", lon, "Distace from Ofice = ", Math.round(dis(lat, lon, rlat, rlon)));
      if (inmenu == false) {
        g.clear();
        g.drawString(Math.round(getBearing(lat,lon,rlat,rlon),50,20));
        g.drawString(Math.round(dis(lat, lon, rlat, rlon)) + "m", 50, 70);
        g.drawString("Preset " + submenuv, 20,120);
      }
    }
  }
});

function ERROR() {
  if (Times == 3) {
    Times = 1;
    x = ".";
  } else {
    x = x + ".";
    Times++;
  }
  g.setFont6x15(1);
  g.clear();
  g.drawString("Error 404  NO GPS SIGNAL", 20, 50);
  g.drawString("Please Wait", 50, 70);
  g.drawString(x, 115, 70);
}

function init() {
  inmenu = false;
  setWatch(function(d) {
    setv = true;
    inmenu = true;
    E.showMenu(mainmenu);
  }, BTN, {
    repeat: false,
    edge: 'rising',
    debounce: 50
  });
}

init();

function loadsubmenu() {
  submenu = {
    "": {
      "title": "-- Preset " + submenuv + " --"
    },
    "Load": function() {
      rlat = val1r(submenuv);
      rlon = val2r(submenuv);
      inmenu = false;
      setv = false;
      change = true;
      init();
    },
    "Save": function() {
      g.clear();
      g.setFont6x15(1);
      g.drawString("Press BTN to Save your CORDS", 0, 50);
      setWatch(function(e) {
        console.log("Button pressed");
        if (isNaN(lat) == true || isNaN(lon) == true || lat == "undefined" || lon == "undefined") {
          print("error");
          setv = false;
          inmenu = false;
          print(setv);
          init();
        } else {
          g.clear();
          g.drawString("Saved", 70, 50);
          --submenuv;
          print(submenuv);
          arr1[submenuv] = lat;
          arr2[submenuv] = lon;
          print(arr1[submenuv],"   ",arr2[submenuv]);
          rlat = arr1[submenuv];
          rlon = arr2[submenuv];
          val1w(arr1);
          val2w(arr2);
          ++submenuv;
          setv = false;
          change = true;
          print("GPS Saved");
          init();
        }
      }, BTN, {
        repeat: false,
        edge: 'rising',
        debounce: 50
      });
    },
    "Default": function() {
      --submenuv;
      Defaultw(submenuv);
      setv = false;
      inmenu = false;
      print("Default is set to: ",Defaultr());
      submenuv++;
      init();
    }
  };
}






var mainmenu = {
  "": {
    "title": "-- Menu --"
  },
  "Preset 1": function() {
    submenuv = 1;
    loadsubmenu();
    E.showMenu(submenu);
  },
  "Preset 2": function() {
    submenuv = 2;
    loadsubmenu();
    E.showMenu(submenu);
  },
  "Preset 3": function() {
    submenuv = 3;
    loadsubmenu();
    E.showMenu(submenu);
  },
  "Preset 4": function() {
    submenuv = 4;
    loadsubmenu();
    E.showMenu(submenu);
  },
  "Preset 5": function() {
    submenuv = 5;
    loadsubmenu();
    E.showMenu(submenu);
  },
};