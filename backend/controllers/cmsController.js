const mongoose = require('mongoose');
const Cms = require('../models/cmsModel');
const createError = require('http-errors');

//get all pages
const getPages = async (req, res) => {
    const pages = await Cms.find().sort({ CreateAt: -1 });

    res.status(200).json(pages);
};

//get single page
const getaPage = async (req, res) => {
    const { pageName } = req.params;

    const page = await Cms.find({ page: pageName })

    if (!page) {
        return res.status(404).json({ error: 'No pages found' });
    }

    res.status(200).json(page);
};

//create a new page
const createPage = async (req, res) => {
    try {
        const existingPage = await Cms.findOne({ page: req.body.page });

        if (existingPage)
            throw createError.BadRequest(
                `${req.body.page} already exist! try update instead`
            );

        const page = new Cms(req.body);
        const savedPage = await page.save();
        res.status(200).json(savedPage);
    } catch (error) {
        res.status(400).json({ error: 'cannot create page' });
        console.log(error);
    }
};

//update page
const updatePage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid id' });
    }

    const page = await Cms.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!page) {
        return res.status(404).json({ error: 'page not found' });
    }

    res.status(200).json(page);
};

//delete page
const deletePage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'NoT a Vaild id' });
    }

    const page = await Cms.findOneAndDelete({ _id: id });

    if (!page) {
        return res.status(404).json({ error: 'page not found' });
    }

    res.status(200).json(page);
};

module.exports = {
    getPages,
    getaPage,
    createPage,
    updatePage,
    deletePage
}