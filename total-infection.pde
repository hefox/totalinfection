var UserDrawable = function (id, x, y) {
  User.call(this, id);
  this.x  = x;
  this.y = y;
  this.draw();
};
UserDrawable.prototype = Object.create(User.prototype);

/**
 * Returns whether this user mentors given user.
 */
UserDrawable.prototype.draw = function() {
  fill(0);
  rect(this.x, this.y, 10, 10);
  if (this.id) {
    fill(18, 230, 67);
    text(this.id, this.x, this.y);
  }
};

UserDrawable.prototype.drawBetween = function(neighbor) {
  fill(20, 20, 20);
  line(this.x, this.y, neighbor.x, neighbor.y);
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
  fill(0);
  frameRate(60);
  var x = 100, y = 100;
  for (var i = 1; i < 26; i++) {
    new UserDrawable("u" + i.toString(), x, y);
    x += 100;
    if (x >= 600) {
      x = 100;
      y += 100;
    }
  }
}

void draw() {
  Users['u1'].addMentee(Users['u2']);
  Users['u1'].addMentee(Users['u6']);
  Users['u2'].addMentee(Users['u7']);
  Users['u2'].addMentee(Users['u8']);
}