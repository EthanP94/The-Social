const { Thought, User } = require("../models");
const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getThoughtById({ params }, res) {
    Thought.findOne({
      _id: params.id,
    })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createThought({ body }, res) {
    console.log(body);
    Thought.create(body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          {
            _id: body.userId,
          },
          {
            $push: {
              thoughts: dbThoughtData._id,
            },
          },
          {
            new: true,
          }
        ).select("-__v");
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id.",
          });
          return;
        }
        console.log(dbUserData);
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      {
        _id: params.id,
      },
      body,
      {
        new: true,
      }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "No thought found with this id.",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({
      _id: params.id,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "No thought found with that id.",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      {
        _id: params.thoughtId,
      },
      {
        $push: {
          reactions: body,
        },
      },
      {
        new: true,
      }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "No thought found with this id.",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  deleteReaction({ params }, res) {
    console.log(params);
    Thought.findOneAndUpdate(
      {
        _id: params.thoughtId,
      },
      {
        $pull: {
          reactions: {
            reactionId: params.reactionId,
          },
        },
      },
      {
        new: true,
      }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "No thought found with this id.",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
