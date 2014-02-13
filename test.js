function user_test_setup() {
  Users = [];
}

test("user test", function() {
  user_test_setup();
  var user = new User('unique id');

  // Test that user was added to Users array correctly.
  ok('unique id' in Users, "Key for new user in Users array.");
  ok(Users['unique id'] === user, "Object in Users array matches.");
  ok(user.id === 'unique id', "ID of user is correct.");
  // Make sure user cannot be added with same id.
  throws(function() {new User('unique id')}, "ID already in use.", "Throws an error when already used ID is used.");

  // Test that new user given a id if not supplied.
  var user2 = new User();
  ok(Users.indexOf(user2) === user2.id && user2.id === 0, "User given new ID " + user2.id + " and added.");
  var user3 = new User();
  ok(Users.indexOf(user3) === user3.id && user3.id === 1, "User given new ID " + user3.id + " and added.");
});

test("mentor functions", function() {
  user_test_setup();
  var user = new User('unique id');
  var user2 = new User('unique id 2');
  user.addMentor(user2);

  // Test that user2 was successfully added as mantee.
  ok(user.hasMentor(user2), "user2 is mentor of user.");
  ok(user2.id in user.mentors, "user2 is mentor of user.");
  ok(user2.hasMentee(user), "user is mentee of user2.");
  ok(user.id in user2.mentees, "user is mentee of user2.");

  // Test removal of mentor.
  user.removeMentor(user2);
  ok(!user.hasMentor(user2), "user2 is NOT mentor of user.");
  ok(!(user2.id in user.mentors), "user2 is NOT mentor of user.");
  ok(!user2.hasMentee(user), "user is NOT mentee of user2.");
  ok(!(user.id in user2.mentees), "user is NOT mentee of user2.");

  // Make sure self mentoring is not allowed.
  throws(function() {user.addMentor(user);}, "self mentoring not allowed.", "Throws an error when self mentoring.");

});

test("mentee functions", function() {
  user_test_setup();
  var user = new User('unique id');
  var user2 = new User('unique id 2');
  user2.addMentee(user);

  // Test that user2 was successfully added as mantee.
  ok(user.hasMentor(user2), "user2 is mentor of user.");
  ok(user2.id in user.mentors, "user2 is mentor of user.");
  ok(user2.hasMentee(user), "user is mentee of user2.");
  ok(user.id in user2.mentees, "user is mentee of user2.");

  // Test removal of mentor.
  user2.removeMentee(user);
  ok(!user.hasMentor(user2), "user2 is NOT mentor of user.");
  ok(!(user2.id in user.mentors), "user2 is NOT mentor of user.");
  ok(!user2.hasMentee(user), "user is NOT mentee of user2.");
  ok(!(user.id in user2.mentees), "user is NOT mentee of user2.");

  // Make sure self mentoring is not allowed.
  throws(function() {user.addMentee(user);}, "self mentoring not allowed.", "Throws an error when self mentoring.");
});
