const Hiddengems = require('../models/gem');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const gem = await Hiddengems.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    gem.reviews.push(review);
    await review.save();
    await gem.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/gems/${gem._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Hiddengems.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/gems/${id}`);
}
