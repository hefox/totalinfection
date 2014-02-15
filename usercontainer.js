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
 * Add a new user to the container, generating a new key.
 */
Object.defineProperty(UsersContainer.prototype, 'findId', {
  enumerable: false,
  value: function(user) {
    for (var k in this) {
      if (this[k] === user) return k;
    }
  }
});

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
 * Add a new user to the container, generating a new key.
 */
Object.defineProperty(UsersContainer.prototype, 'infect', {
  enumerable: false,
  value: function(user, mode) {
    if (this.findId(user) === undefined) {
      throw "User must be part of this container.";
    }
    if (mode == 'connected') {
      var infect_users = user.findConnected();
      for (k in infect_users) {
        infect_users[k].infect();
      }
    }
    else {
      if (typeof mode !== 'number' || mode % 1 != 0) {
        console.log(typeof mode);
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
        user.mentees[i].infect();
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
          // is still students to infect.
          if (this[i].infectedCount && this[i].infectedCount > max_infected_count && this[i].infectedCount < this[i].mentees.size()) {
            max_infected_count = this[i].infectedCount;
            infected_user = this[i];
          }
        }

        // Infect the max infected if exists.
        if (!infected_user) {
          do {
            infected_user = this.randomUser();
          }
          while(infected_user.infected);
          infected_user.infect();
          infection_count++;
        }

        // Infect all this users students.
        for (i in infected_user.mentees) {
          infected_user.mentees[i].infect();
          infection_count++;
        }

      }
    }
  }
});

/**
 * Add a new user to the container, generating a new key.
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
