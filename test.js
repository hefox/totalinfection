var Users_save;
function user_test_setup() {
  Users_save = Users;
  Users = new UsersContainer();
}
function user_test_tear() {
  Users = Users_save;
}

test("user test", function() {
  user_test_setup();
  ok(Users.size() == 0, "Size of users correct.");
  var user = new User('unique id');

  // Test that user was added to Users array correctly.
  ok('unique id' in Users, "Key for new user in Users array.");
  ok(Users['unique id'] === user, "Object in Users array matches.");
  ok(user.id === 'unique id', "ID of user is correct.");
  // Make sure user cannot be added with same id.
  throws(function() {new User('unique id')}, "ID already in use.", "Throws an error when already used ID is used.");

  // Test that new user given a id if not supplied.
  var user2 = new User();
  ok(Users.findId(user2) === user2.id, "User given new ID " + user2.id + " and added.");
  var user3 = new User();
  ok(Users.findId(user3) === user3.id, "User given new ID " + user3.id + " and added.");
  ok(Users.size() == 3, "Size of users correct.");
  user_test_tear();
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
  user_test_tear();

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
  user_test_tear();
});


test("connected functions", function() {
  user_test_setup();
  var user = new User('unique id');
  var user2 = new User('unique id 2');
  var user3 = new User('unique id 3');
  var user4 = new User('unique id 4');
  var user5 = new User('unique id 5');
  var user6 = new User('unique id 6');
  var user7 = new User('unique id 7');
  var user8 = new User('unique id 8');

  user.addMentee(user2);
  ok(user.hasMentee(user2), "User has mentee.");
  user2.addMentee(user3);
  ok(user2.hasMentee(user3), "User has mentee.");
  user.addMentee(user4);
  ok(user.hasMentee(user4), "User has mentee.");
  user3.addMentee(user5);
  ok(user3.hasMentee(user5), "User has mentee.");
  // Add a connection that not part of above.
  user6.addMentee(user7);
  ok(user3.hasMentee(user5), "User has mentee.");

  function testUserConnected() {
    var user_connected = user.findConnected();
    ok(user.id in user_connected, "User is connected.");
    ok(user2.id in user_connected, "User is connected.");
    ok(user3.id in user_connected, "User is connected.");
    ok(user4.id in user_connected, "User is connected.");
    ok(user5.id in user_connected, "User is connected.");
  }

  // Make sure the single connection is just with itself.
  var user6_connected = user6.findConnected();
  var user_connected = user.findConnected();
  ok(user6.id in user6_connected, "User is connected.");
  ok(user7.id in user6_connected, "User is connected.");
  ok(!(user6.id in user_connected), "User is not connected.");
  ok(!(user7.id in user_connected), "User is not connected.");
  ok(!(user.id in user6_connected), "User is not connected.");

  // Check for cycles.
  user7.addMentee(user6);
  var user6_connected = user6.findConnected();
  ok(user6.id in user6_connected, "User is connected.");
  ok(user7.id in user6_connected, "User is connected.");

  // More complex cycles
  user5.addMentee(user);
  user4.addMentee(user5);
  user.addMentor(user2);
  testUserConnected();

  // Verify that a lonely user is connected with themselves.
  var user8_connected = user8.findConnected();
  ok(user8.id in user8_connected, "User is connected.");
  user_test_tear();
});


test("infected functions", function() {
  user_test_setup();
  var user = new User('unique id');
  var user2 = new User('unique id 2');
  var user3 = new User('unique id 3');
  var user4 = new User('unique id 4');
  var user5 = new User('unique id 5');
  var user6 = new User('unique id 6');
  var user7 = new User('unique id 7');

  user.infect();
  ok(user.infected, "User is infected.");

  user.cure();
  ok(!user.infected, "User is cured.");

  user.addMentee(user2);

  user2.infect();
  ok(user2.infected, "User2 is infected.");
  ok(!user.infected, "User is not infected.");
  ok(user.infectedCount == 1, "User infected student count correct.");

  user3.infect();
  ok(user3.infected, "User3 is infected.");

  // Verify adding an infected student increass count.
  user.addMentee(user3);
  ok(user.infectedCount == 2, "User infected student count correct.");

  // Verify removing infection decreases count.
  user3.cure();
  ok(user.infectedCount == 1, "User infected student count correct.");

  // Make sure removing an infected student decreased the count.
  user.removeMentee(user2);
  ok(user.infectedCount == 0, "User infected student count correct.");

  user_test_tear();
});
