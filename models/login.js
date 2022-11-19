 
 const Users = require("../models/user" );
 
 userSchema.static.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to find the user");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("uncorect password");
  }

  return user;
};