// Keeps track of unique users.
var Users = [];

/**
 * Defines the User object that tracks a user and it's mentors/mentees.
 *
 * @param id
 *   a unique ID for this user.
 */
var User = function (id) {
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
};


/**
 * Returns whether this user mentors given user.
 */
User.prototype.hasMantee = function(mentee) {
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
  this.mentors[mentor.id] = mentor;
  if (!mentor.hasMantee(this)) {
    mentor.addMentee(this);
  }
};

/**
 * Add a mentee to this user.
 */
User.prototype.addMentee = function(mentee) {
  this.mentees[mentee.id] = mentee;
  if (!mentee.hasMentor(this)) {
    mentee.addMentor(this);
  }
};

/**
 * Remove a mentor from this user.
 */
User.prototype.removeMentor = function(mentor) {
  delete this.mentors[mentor.id];
  if (mentor.hasMantee(this)) {
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