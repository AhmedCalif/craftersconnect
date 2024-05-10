const express = require('express');
const { User, Project, Step, Image, Avatar } = require('../database/schema/schemaModel');
const router = express.Router();

// View projects created by the logged-in user
router.get("/", async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) {
      return res.status(401).send("Unauthorized: No session available");
    }

    const user = await User.findOne({ where: { username: username }, include: Avatar });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const avatarUrl = user.Avatar ? user.Avatar.imageUrl : 'https://i.pravatar.cc/150?img=3';
    const projects = await Project.findAll({ 
      where: { userId: user.userId }, 
      include: [
        { model: Step, as: 'Steps' },
        { model: User, include: Avatar }  // Include the User model
      ] 
    });

    res.render('userProjects/list', { projects, user, avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error while fetching user's projects");
  }
});

module.exports = router;
