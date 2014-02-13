// Keeps track of unique users.
var Users = [];

/**
 * Defines the User object that tracks a user and it's mentors/mentees.
 *
 * @param id
 *   a unique ID for this user.
 */
var User = function (id, visual) {
  // We keep track of both directions so that searching is easier.
  // This doubles the storage requirements, but performance matters more.
  this.mentors = [];
  this.mentees = [];
  // If ID was not supplied, use the index after pushing the user to Users.
  if (!id) {
    Users.push(this);
    id = Users.indexOf(this);
  }
  else if (id in Users) {
    throw "ID already in use.";
  }
  else {
    Users[id] = this; 
  }
  this.id = id;
  this.visual = visual;
  if (visual && visual.draw) {
    visual.draw(this);
  }
};


/**
 * Returns whether this user mentors given user.
 */
User.prototype.hasMentee = function(mentee) {
  return mentee.id in this.mentees;
};

/**
 * returns whether this user is mentored by given user.
 */
User.prototype.hasMentor = function(mentor) {
  return mentor.id in this.mentors;
};


/**
 * Add a mentor to this user.
 */
User.prototype.addMentor = function(mentor) {
  if (mentor == this) {
    throw "self mentoring not allowed.";
  }
  this.mentors[mentor.id] = mentor;
  if (!mentor.hasMentee(this)) {
    mentor.addMentee(this);
  }
};

/**
 * Add a mentee to this user.
 */
User.prototype.addMentee = function(mentee) {
  if (mentee == this) {
    throw "self mentoring not allowed.";
  }
  this.mentees[mentee.id] = mentee;
  if (!mentee.hasMentor(this)) {
    mentee.addMentor(this);
  }
  if (this.visual && this.visual.drawBetween && mentee.visual) {
    this.visual.drawBetween(mentee.visual);
  }
};

/**
 * Remove a mentor from this user.
 */
User.prototype.removeMentor = function(mentor) {
  delete this.mentors[mentor.id];
  if (mentor.hasMentee(this)) {
    mentor.removeMentee(this);
  }
};

/**
 * Remove a mentee from this user.
 */
User.prototype.removeMentee = function(mentee) {
  delete this.mentees[mentee.id];
  if (mentee.hasMentor(this)) {
    mentee.removeMentor(this);
  }
};


/**
 * Finds all mentees
 */
User.prototype.findConnected = function(connected) {
  if (connected === undefined) {
    connected = [];
  }
  for (k in this.mentees) {
    if (!(k in connected)) {
      connected[k] = this.mentees[k];
      this.mentees[k].findConnected(connected)
    }
  }
  for (k in this.mentors) {
    if (!(k in connected)) {
      connected[k] = this.mentors[k];
      this.mentors[k].findConnected(connected)
    }
  }
  return connected;
};
