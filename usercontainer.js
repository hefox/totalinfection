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
