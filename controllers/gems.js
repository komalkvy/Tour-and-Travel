const Hiddengems = require('../models/gem');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const gems = await Hiddengems.find({});
    res.render('gems/index', { gems })
}

module.exports.renderNewForm = (req, res) => {
    res.render('gems/new');
}

module.exports.createHiddengems = async (req, res, next) => {
    const gem = new Hiddengems(req.body.gem);
    gem.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gem.author = req.user._id;
    await gem.save();
    console.log(gem);
    req.flash('success', 'Successfully made a new gem!');
    res.redirect(`/gems/${gem._id}`)
}

module.exports.showHiddengems = async (req, res,) => {
    const gem = await Hiddengems.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!gem) {
        req.flash('error', 'Cannot find that gem!');
        return res.redirect('/gems');
    }
    res.render('gems/show', { gem });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const gem = await Hiddengems.findById(id)
    if (!gem) {
        req.flash('error', 'Cannot find that gem!');
        return res.redirect('/gems');
    }
    res.render('gems/edit', { gem });
}

module.exports.updateHiddengems = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const gem = await Hiddengems.findByIdAndUpdate(id, { ...req.body.gem });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gem.images.push(...imgs);
    await gem.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gem.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated gem!');
    res.redirect(`/gems/${gem._id}`)
}

module.exports.deleteHiddengems = async (req, res) => {
    const { id } = req.params;
    await Hiddengems.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted gem')
    res.redirect('/gems');
}