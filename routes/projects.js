var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

router.get('/', async function (req, res, next) {
    const list = await mongoose.model('Project').find()
    res.render('list', {projects: list});
});

router.get('/member-addition/:id', function (req, res, next) {
    res.render('member-addition', {project: {id: req.params.id}});
});

router.post('/member-addition', async function (req, res, next) {
    const single = await mongoose.model('Project').findById(req.body.id)
    const added = single.members || []
    added.push(req.body.member)
    single.members = added
    await single.save()
    res.redirect('/projects');
});

router.get('/create', function (req, res, next) {
    res.render('project', {project: {}});
});

router.get('/edit/:id', async function (req, res, next) {
    const singleForEdit = await mongoose.model('Project').findById(req.params.id)
    res.render('project', {project: singleForEdit});
});

router.get('/delete/:id', async function (req, res, next) {
    await mongoose.model('Project').deleteOne({_id: req.params.id})
    res.redirect('/projects');
});

router.post('/', async function (req, res, next) {
    if (req.body.id) {
        const project = await mongoose.model('Project').findById(req.body.id)
        Object.assign(project, req.body)
        await project.save()
    } else {
        await mongoose.model('Project').create(req.body)
    }

    res.redirect('/projects')
});

module.exports = router;
