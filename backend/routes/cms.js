const express = require('express')
const router = express.Router()
const {
    getPages,
    getaPage,
    createPage,
    updatePage,
    deletePage
} = require('../controllers/cmsController')

//Get all Pages
router.get('', getPages)

//Get single Page
router.get('/:page', getaPage)

//create a new Page or update existing
router.post('/create', createPage)

//create a new Page or update existing
router.patch('/:page', updatePage)

//delete a Page
router.delete('/:id', deletePage)


module.exports = router;