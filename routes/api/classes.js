const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateEnrollInput = require('../../validation/enroll');
const validateDropInput = require('../../validation/drop');
const validateCreateClassInput = require('../../validation/create_class');

// Load Class model
const Class = require('../../models/Class');
const User = require('../../models/User');

// @route   GET api/classes/test
// @desc    Tests classes route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Classes Works' }));

// @route   POST api/classes/enroll
// @desc    enroll student / Returning updated user enrolled class list
// @access  Private
router.post('/enroll',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    const { errors, isValid } = validateEnrollInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Class.findOne({ code: req.body.code }).then(course => {
        if (course) {
            course.enrolled_students.push({name: req.user.name, id: req.user.id});
            req.user.profile.enrolled_classes.push({name: course.name, code: course.code});

            course.save();
            req.user.save();

            res.json({
                enrolled_classes: req.user.profile.enrolled_classes,
                course_name: course.name,
                course_code: course.code
            });

        } else {
            errors.code = 'Course code does not exist';
            return res.status(400).json(errors);
        }
    });
});

// @route   POST api/classes/drop
// @desc    drop student / Returning updated user enrolled class list
// @access  Private
router.post('/drop',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    const { errors, isValid } = validateDropInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Class.findOne({ code: req.body.code }).then(course => {
        if (course) {
            for (var i = 0; i < course.enrolled_students.length; i++) {
                if (course.enrolled_students[i].id.equals(req.user.id) == true) {
                    course.enrolled_students.splice(i, 1);
                    break;
                }
        }

        for (var i = 0; i < req.user.profile.enrolled_classes.length; i++) {
                if (req.user.profile.enrolled_classes[i].code.equals(course.code) == true) {
                    req.user.profile.enrolled_classes.splice(i, 1);
                    break;
                }
        }

        course.save();
        req.user.save();

        res.json({
            enrolled_classes: req.user.profile.enrolled_classes,
            course_name: course.name,
            course_code: course.code
        });

        } else {
            errors.code = 'Course code does not exist';
            return res.status(400).json(errors);
        }
    });
});

// @route   POST api/classes/create
// @desc    Create class
// @access  Private
router.post('/create',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    const { errors, isValid } = validateCreateClassInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newClass = new Class({
        name: req.body.name,
        owner: req.user.id,
        code: Math.random().toString().replace('0.', ''),
        enrolled_students: [],
        teachers: [],
        assignments: []
    });

    newClass
        .save()
        .then(course => res.json(course))
        .catch(err => console.log(err));
});

module.exports = router;
