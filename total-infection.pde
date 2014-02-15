PImage student, teacher, infected, alone;

var UserDrawable = function (id, x, y) {
  User.call(this, id);
  this.x  = x;
  this.y = y;
};
UserDrawable.prototype = Object.create(User.prototype);

/**
 * Returns whether this user mentors given user.
 */
UserDrawable.prototype.draw = function() {
  // Place the user graphic based on status.
  if (this.infected) {
    image(infected, this.x, this.y);
  }
  else if (this.mentees.size()) {
    image(teacher, this.x, this.y);
  }
  else if (this.mentors.size()) {
    image(student, this.x, this.y);
  }
  else {
    image(alone, this.x, this.y);
  }

  if (this.id) {
    text(this.id, this.x, this.y);
  }
};

UserDrawable.prototype.drawBetween = function(neighbor) {
  stroke(20, 20, 20);
  line(this.x, this.y, neighbor.x, neighbor.y);
  stroke(18, 230, 67);
  line(round((neighbor.x +(neighbor.x + this.x) / 2)) / 2, (neighbor.y + (neighbor.y + this.y) /2) / 2, neighbor.x, neighbor.y);
};

UserDrawable.prototype.clicked = function(x, y) {
  return x >= this.x && x <= this.x + 20 && y >= this.y && y <= this.y + 20;
};

/**
 * Add a mentee to this user.
 */
UserDrawable.prototype.addMentee = function(mentee) {
  User.prototype.addMentee.call(this, mentee);
  this.drawBetween(mentee);
};

void setup() {
  size(600, 600);
  frameRate(10);
  // Initialize these hear so not repeated.
  student = loadImage("images/student.png");
  teacher = loadImage("images/teacher.png");
  infected = loadImage("images/infected.png");
  alone = loadImage("images/alone.png");
  var x = 100, y = 100;
  for (var i = 1; i < 26; i++) {
    new UserDrawable("u" + i.toString(), x, y);
    x += 100;
    if (x >= 600) {
      x = 100;
      y += 100;
    }
  }
  Users['u1'].addMentee(Users['u2']);
  Users['u1'].addMentee(Users['u6']);
    Users['u2'].addMentee(Users['u7']);
    Users['u2'].addMentee(Users['u8']);
      Users['u3'].addMentee(Users['u8']);
      Users['u3'].addMentee(Users['u4']);

  Users['u25'].addMentee(Users['u24']);
    Users['u24'].addMentee(Users['u18']);
    Users['u24'].addMentee(Users['u19']);
    Users['u24'].addMentee(Users['u20']);
      Users['u19'].addMentee(Users['u14']);
      Users['u19'].addMentee(Users['u15']);


  Users['u11'].addMentee(Users['u12']);
  Users['u11'].addMentee(Users['u17']);
  Users['u11'].addMentee(Users['u22']);
    Users['u12'].addMentee(Users['u9']);
    Users['u12'].addMentee(Users['u10']);
      Users['u10'].addMentee(Users['u5']);
      Users['u10'].addMentee(Users['u4']);
}

void draw() {
  var mode = document.getElementById("infect-amount").value;
  if (mode != "connected") {
    mode = parseInt(mode);
  }
  for (x in Users) {
    if(mousePressed) {
      if (Users[x].clicked(mouseX, mouseY)) {
        Users.infect(Users[x], mode);
        break;
      }
    }
    Users[x].draw();
  }
}
