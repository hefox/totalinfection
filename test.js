test( "user test", function() {
  var user = new User('unique id');

  // Test that user was added to Users array correctly
  ok('unique id' in Users, "Key for new user in Users array.");
  ok(Users['unique id'] === user, "Object in Users array matches.");
  ok(user.id === 'unique id', "ID of user is correct.");
  throws(function() {new User('unique id')}, "ID already in use.", "Throws an error when already used ID is used.");
});