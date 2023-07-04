const express = require('express')
const router = express.Router()
const {
    getPages,
    getaPage,
    createPage,
    deletePage,
    updatePage,
} = require('../controllers/cmsController')

//Get all Pages
router.get('', getPages)

//Get single Page
router.get('/:page', getaPage)

//register a new Page
router.post('/create', createPage)

//delete a Page
router.delete('/:id', deletePage)

//UPDATE a Page
router.patch('/:id', updatePage)

module.exports = router;