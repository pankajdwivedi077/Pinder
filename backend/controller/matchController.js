import User from "../models/User.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;

    const currentUser = await User.findById(req.user.id);
    const linkedUser = await User.findById(likedUserId);

    if (!linkedUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // if the other user already liked us, it's a match, so updated both
      if (linkedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        linkedUser.matches.push(currentUser.id);
        await Promise.all([await currentUser.save(), await linkedUser.save()]);

        

      }
    }

    res.status(200).json({
      success: true,
      user: currentUser
    })

  } catch (e) {
    console.log("error in swiperight function ", e);
    res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;

    const currentUser = await User.findById(req.user.id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (e) {
    console.log("error in swipeleft ", e);
    res.status(500).json({
      success: false,
      message: "interbal server error",
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );

    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (e) {
    console.log("error in getMatches ", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        {
          genderPreference: { $in: [currentUser.gender, "both"] },
        },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    console.log("error in getUserProfiel ", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
