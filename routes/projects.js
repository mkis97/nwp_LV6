var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const auth = require('../auth')

router.get('/', async function (req, res, next) {
    const user = auth.getUser(req)
    if (!user) return res.send('Please login to proceed')
    const item = {}
    if (req.query.leader === 'true') item.leader = user
    else item.participants = user
    if (req.query.archive === 'true') item.archived = true
    else item.archived = null
    const list = await mongoose.model('Project').find(item)
    res.render('list', {projects: list, isLeader: item.leader || false});
});

router.get('/member-addition/:id', async function (req, res, next) {
    const users = await mongoose.model('User').find()
    res.render('member-addition', { project: {id: req.params.id}, users });
});

router.post('/member-addition', async function (req, res, next) {
    const project = await mongoose.model('Project').findById(req.body.id)
    project.participants = req.body.member
    await project.save()
    res.redirect('/projects?leader=true&archive=false');
});

router.get('/create', function (req, res, next) {
    res.render('project', { project: {members: []} });
});

router.get('/edit/:id', async function (req, res, next) {
    const user = auth.getUser(req)
    if (!user) return res.send('Please login to proceed')
    const singleForEdit = await mongoose.model('Project').findById(req.params.id).populate('members').populate('leader').exec()
    const isLeader = singleForEdit.leader.id === user
    res.render('project', {project: singleForEdit, isLeader});
});

router.get('/delete/:id', async function (req, res, next) {
    await mongoose.model('Project').deleteOne({_id: req.params.id})
    res.redirect('/projects?leader=true&archive=false');
});

router.get('/archive/:id', async function(req, res, next) {
    const single = await mongoose.model('Project').findById(req.params.id)
    single.archived = true
    await single.save()
    res.redirect('/projects?leader=true&archive=false');
});

router.post('/', async function (req, res, next) {
    const user = auth.getUser(req)
    if (!user) return res.send('Please login to proceed')
    delete req.body.leader

    if (req.body.id) {
        const project = await mongoose.model('Project').findById(req.body.id)
        if (project.leader && project.leader.id === user) Object.assign(project, req.body)
        else project.workdone = req.body.workdone
        await project.save()
    } else {
        await mongoose.model('Project').create({
            ...req.body,
            leader: user
        })
    }

    res.redirect('/projects?leader=true&archive=false')
});

module.exports = router;
