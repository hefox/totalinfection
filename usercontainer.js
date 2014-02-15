/**
 * A container of several users. Made for helper functions like size.
 */
var UsersContainer = function () {};

/**
 * Returns how many users are in this container.
 */
Object.defineProperty(UsersContainer.prototype, 'size', {
  enumerable: false,
  value: function() {
    var size = 0, key;
    for (key in this) {
      if (this.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  }
});

/**
 * Add a new user to the container, generating a new key.
 */
Object.defineProperty(UsersContainer.prototype, 'add', {
  enumerable: false,
  value: function(user) {
    var i = 0;
    while (i in this) {
      i++;
    }
    this[i] = user;
    return i;
  }
});

/**
 * Find the id/key of a user in container.
 */
Object.defineProperty(UsersContainer.prototype, 'findId', {
  enumerable: false,
  value: function(user) {
    for (var k in this) {
      if (this[k] === user) return k;
    }
  }
});

/**
 * Return a random user.
 */
Object.defineProperty(UsersContainer.prototype, 'randomUser', {
  enumerable: false,
  value: function(user) {
    // @see http://stackoverflow.com/questions/8995503/randomly-select-enumerable-property-of-object-in-javascript
    var tmpList = Object.keys(this);
    var randomUserId = tmpList[ Math.floor(Math.random()*tmpList.length) ];
    return this[randomUserId];
  }
});


/**
 * Infect a user
 *
 * @param user
 *  The user to infect
 * @param mode
 *   The mode to run into -- use "connected" for all connected, specificy a
 *   number for running a partial infection.
 */
Object.defineProperty(UsersContainer.prototype, 'infect', {
  enumerable: false,
  value: function(user, mode) {
    if (this.findId(user) === undefined) {
      throw "User must be part of this container.";
    }
    if (!mode || mode == 'connected') {
      var infect_users = user.findConnected();
      for (k in infect_users) {
        if (!infect_users[k].infected) infect_users[k].infect();
      }
    }
    else {
      if (typeof mode !== 'number' || mode % 1 != 0) {
        throw "We were given a non-int for infected count. That sucks.";
      }
      else if (mode < 0) {
        throw "We were given a infected count less than 1.";
      }
      else if (mode > this.size()) {
        throw "There is not enough users to infect.";
      }
      // Cure all users.
      this.cure();
      // Infect the first user then students, as that is forced infection.
      user.infect();
      var infection_count = 1;
      for (i in user.mentees) {
        if (!user.mentees[i].infected) user.mentees[i].infect();
        infection_count++;
      }

      // Infect users till reach count.
      while (infection_count < mode) {
        // Search for user with greatest infectedCount.
        var max_infected_count = 0;
        var infected_user;

        // First the couch with the greatest infected users.
        for (i in this) {
          // Test if infected count less then current max found and that there
          // is still students or mentor itself to infect.
          if (this[i].infectedCount && this[i].infectedCount > max_infected_count && (this[i].infectedCount < this[i].mentees.size() || !this[i].infected)) {
            max_infected_count = this[i].infectedCount;
            infected_user = this[i];
          }
        }

        // Infect the max infected if exists.
        if (!max_infected_count) {
          do {
            infected_user = this.randomUser();
          }
          while(infected_user.infected);
        }

        // Infect the teacher, who may or may not be infected at this stage.
        if (!infected_user.infected) {
          infected_user.infect();
          infection_count++;
        }

        // Infect all this teacher's students if not infected yet..
        for (i in infected_user.mentees) {
          if (!infected_user.mentees[i].infected) {
            infected_user.mentees[i].infect();
            infection_count++;
          }
        }

      }
    }
  }
});

/**
 * Remove infections from all users.
 */
Object.defineProperty(UsersContainer.prototype, 'cure', {
  enumerable: false,
  value: function(user) {
    for (k in this) {
      if (this[k].infected) {
        this[k].cure();
      }
    }
  }
});
