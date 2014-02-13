var UserVisual = function (x, y) {
  this.x  = x;
  this.y = y;
};

/**
 * Returns whether this user mentors given user.
 */
UserVisual.prototype.draw = function(object) {
  fill(0);
  rect(this.x, this.y, 10, 10);
  if (object && object.id) {
    fill(18, 230, 67);
    text(object.id, this.x, this.y);
  }
};

UserVisual.prototype.drawBetween = function(neighborVisual) {
  fill(20, 20, 20);
  line(this.x, this.y, neighborVisual.x, neighborVisual.y);
};
var user, user2, user3, user4, user5;
void setup() {
  size(600, 600);
  fill(0);
  frameRate(60);
  var x = 100, y = 100;
  for (var i = 1; i < 26; i++) {
    new User("u" + i.toString(), new UserVisual(x, y));
    x += 100;
    if (x >= 600) {
      x = 100;
      y += 100;
    }
  }
  console.log(Users);
}

void draw() {
  Users['u1'].addMentee(Users['u2']);
  Users['u1'].addMentee(Users['u6']);
  Users['u2'].addMentee(Users['u7']);
  Users['u2'].addMentee(Users['u8']);
}