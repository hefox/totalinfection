// Keeps track of unique users.
var Users = new UsersContainer();

/**
 * Defines the User object that tracks a user and it's mentors/mentees.
 *
 * @param id
 *   a unique ID for this user.
 */
var User = function (id) {
  // We keep track of both directions so that searching is easier.
  // This doubles the storage requirements, but performance matters more.
  this.mentors = new UsersContainer();
  this.mentees = new UsersContainer();
  // If ID was not supplied, use the index after adding the user to Users.
  if (!id) {
    Users.add(this);
    id = Users.findId(this);
  }
  else if (id in Users) {
    throw "ID already in use.";
  }
  else {
    Users[id] = this; 
  }
  this.id = id;
  // Track infection status.
  this.infected = false;
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
  if (mentee.infected) {
    this.increaseInfectedCount();
  }
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
  if (mentor.hasMentee(this)) {
    mentor.removeMentee(this);
  }
};

/**
 * Remove a mentee from this user.
 */
User.prototype.removeMentee = function(mentee) {
  if (mentee.infected) {
    this.decreaseInfectedCount();
  }
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
    connected = new UsersContainer();
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


/**
 * Mark that a student of this teacher was infected.
 */
User.prototype.increaseInfectedCount = function() {
  this.infectedCount = this.infectedCount || 0;
  this.infectedCount++;
}
/**
 * Marks that a student cured for this teacher
 */
User.prototype.decreaseInfectedCount = function() {
  if (!this.infectedCount) {
    throw "Called infected decrease before any mentees were infected";
  }
  this.infectedCount--;
}

/**
 * Marks that a this user was infected.
 */
User.prototype.infect = function() {
  this.infected = true;
  // Cache how many students are infected for easier calculations later.
  for (k in this.mentors) {
    this.mentors[k].increaseInfectedCount();
  }
};

/**
 * Marks that this user was cured.
 */
User.prototype.cure = function() {
  this.infected = false;
  // Cache how many students are infected for easier calculations later.
  for (k in this.mentors) {
    this.mentors[k].decreaseInfectedCount();
  }
};

