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
    const pageName = req.params.page;

    const page = await Cms.findOne({ page: pageName })

    if (!page) {
        console.log(pageName);
        return res.status(404).json({ error: 'No pages found' });
    }

    res.status(200).json(page);
};

//attempts to create a new page if it doesnt already exist
const createPage = async (req, res) => {
    try {
        const existingPage = await Cms.findOne({ page: req.body.page });
        if (existingPage) {
            res.status(400).json({ error: 'cannot create page, already exist' });
        } else {
            const page = new Cms(req.body);
            const savedPage = await page.save();
            res.status(200).json(savedPage);
        }

    } catch (error) {
        res.status(400).json({ error: 'cannot create page' });
        console.log(error);
    }
};

//update page
const updatePage = async (req, res) => {
    try {
        const updatedPage = await Cms.findOneAndUpdate(
            { page: req.body.page },
            {
                ...req.body,
            });
        res.status(200).json(updatedPage);
    } catch (error) {
        res.status(400).json({ error: 'cannot update page' });
        console.log(error);
    }

}


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