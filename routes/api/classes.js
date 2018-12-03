const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
//const fileUpload = require('express-fileupload');

// Load Input Validation
const validateEnrollInput = require('../../validation/enroll');
const validateDropInput = require('../../validation/drop');
const validateInfoInput = require('../../validation/info');
const validateCreateClassInput = require('../../validation/create_class');
const validateClassDeleteInput = require('../../validation/delete_class');
const validateCreateAssignmentInput = require('../../validation/create_assignment');
const validateAssignmentSubmissionInput = require('../../validation/submit_assignment');
const validateGetDocumentInput = require('../../validation/get_document');
const validateUpdateCommentsInput = require('../../validation/update_comments');

// Load Class model
const Class = require('../../models/Class');
const User = require('../../models/User');
const Doc = require('../../models/Doc');

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

                for (var i = 0; i < req.user.profile.enrolled_classes.length; i++) {
                    if (req.user.profile.enrolled_classes[i].code === req.body.code) {
                        errors.code = 'Already enrolled in the class for the code given';
                        return res.status(400).json(errors);
                    }
                }

                for (var i = 0; i < req.user.profile.teaching_classes.length; i++) {
                    if (req.user.profile.teaching_classes[i].code === req.body.code) {
                        errors.code = 'You can not enroll as a student in a class that you are teaching';
                        return res.status(400).json(errors);
                    }
                }

                course.enrolled_students.push({ name: req.user.name, id: req.user.id });
                req.user.profile.enrolled_classes.push({ name: course.name, code: course.code });

                course.save();
                req.user.save();

                res.json({
                    enrolled_classes: req.user.profile.enrolled_classes,
                    course_name: course.name,
                    course_code: course.code
                });

            } else {
                errors.code = 'Class for given course code does not exist';
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
                    if (course.enrolled_students[i].id === req.user.id) {
                        course.enrolled_students.splice(i, 1);
                        break;
                    }
                }

                for (var i = 0; i < req.user.profile.enrolled_classes.length; i++) {
                    if (req.user.profile.enrolled_classes[i].code === course.code) {
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

// @route   POST api/classes/info
// @desc    class code / Returning queried class object of exists
// @access  Private
router.post('/info',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateInfoInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Class.findOne({ code: req.body.code }).then(course => {
            if (course) {
                res.json(course);

            } else {
                errors.code = 'Class for given course code does not exist';
                return res.status(400).json(errors);
            }
        });
    });


//TODO:Fix this fucnction because it crashes every time
// @route   POST api/classes/delete
// @desc    delete class and drop all students from said class / return current list of created classes
// @access  Private
router.post('/delete',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateClassDeleteInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Class.findOne({ code: req.body.code }).then(course => {

            if (course && (req.user.id === course.owner)) {

                for (var i = 0; i < course.enrolled_students.length; i++) {
                    User.findOne({ _id: course.enrolled_students[i].id }).then(student => {
                        if (student) {
                            for (var i = 0; i < student.profile.enrolled_classes.length; i++) {
                                if (student.profile.enrolled_classes[i].code === course.code) {
                                    student.profile.enrolled_classes.splice(i, 1);
                                    break;
                                }
                            }
                            student.save();
                        }
                    });
                }

                for (var i = 0; i < course.teachers.length; i++) {

                    User.findOne({ _id: course.teachers[i].id }).then(teacher => {
                        if (teacher) {
                            for (var i = 0; i < teacher.profile.teaching_classes.length; i++) {
                                if (teacher.profile.teaching_classes[i].code === course.code) {
                                    teacher.profile.teaching_classes.splice(i, 1);
                                    break;
                                }
                            }
                            teacher.save();
                        }
                    });
                }

                Class.deleteOne({ code: course.code }, function (err) {
                    if (err) return handleError(err);
                });

                res.json(course);

            } else if (!(req.user.id === course.owner)) {
                errors.code = 'User id and course owner id do not match';
                errors.user_id = req.user.id;
                errors.owner_id = course.owner;
                return res.status(400).json(errors);
            } else {
                errors.code = 'Course code does not exist';
                return res.status(400).json(errors);
            }

        });

        return res.status(200);

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
            teachers: [{ name: req.user.name, id: req.user.id }],
            assignments: []
        });

        req.user.profile.teaching_classes.push({ name: newClass.name, code: newClass.code });

        req.user.save();

        newClass
            .save()
            .then(course => res.json(course))
            .catch(err => console.log(err));
    });

// @route   POST api/classes/create_assignment
// @desc    Create a new assignment
// @access  Private
router.post('/create_assignment',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateCreateAssignmentInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Class.findOne({ code: req.body.code }).then(course => {
            if (course) {
                course.assignments.push({
                    assignment_name: req.body.assignment_name,
                    description: req.body.description,
                    max_grade: req.body.max_grade,
                    date_assigned: req.body.date_assigned,
                    date_due: req.body.date_due,
                    submitted_docs: [],
                    peer_grading_assignment: []
                });

                course.save();

                res.json(course);
            }
            else {
                errors.code = 'Course code does not exist';
                return res.status(400).json(errors);
            }
        });

        res.status(200);
    });

// @route   POST api/classes/upload_assignment
// @desc    Upload a document for an assignment
// @access  Private
router.post('/submit_assignment',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateAssignmentSubmissionInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Class.findOne({ code: req.body.code }).then(course => {
            if (course) {

                var assignment = null;
                var current_time = (new Date()).getTime();

                for (var i = 0; i < course.assignments.length; i++) {
                    if (course.assignments[i].assignment_name === req.body.assignment_name) {
                        assignment = course.assignments[i];
                        break;
                    }
                }

                if (assignment === null) {
                    errors.assignment_name = 'Could not find assignment ' + req.body.assignment_name + ' for the course given';
                    return res.status(400).json(errors);
                }

                if (Date.parse(assignment.date_due) < current_time) {
                    errors.late_submission = "Can not submit after the due date";
                    return res.status(400).json(errors);
                }


                // make a new document
                const newDoc = new Doc({
                    name: req.body.doc_name,
                    contents: req.body.doc_contents,
                    owner: req.user.id,
                    assignment_name: assignment.assignment_name,
                    course_code: req.body.code,
                    date_submited: current_time.toString(),
                    max_grade: parseInt(assignment.max_grade, 10),
                    comments: [],
                    grades: []
                });

                // this is slopy but i dont know the reference vs deep copy rules of js
                for (var i = 0; i < course.assignments.length; i++) {
                    if (course.assignments[i].assignment_name === req.body.assignment_name) {
                        course.assignments[i].submitted_docs.push({ doc_id: newDoc._id });
                    }
                }

                req.user.profile.uploaded_document_ids.push({
                    doc_id: newDoc._id,
                    doc_name: newDoc.name,
                    class_name: course.name,
                    class_code: course.code
                });

                req.user.save();
                newDoc.save();
                course.save();

                res.json({
                    name: req.body.doc_name,
                    owner: req.user.id,
                    assignment_name: assignment.assignment_name,
                    course_code: req.body.code,
                    date_submited: current_time.toString(),
                    comments: [],
                    grades: []
                });
            }
            else {
                errors.code = 'Course code does not exist';
                return res.status(400).json(errors);
            }
        });

        res.status(200);
    });

// @route   POST api/classes/get_document
// @desc    Get the document given the doc id
// @access  Private
router.post('/get_document',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateGetDocumentInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Doc.findOne({ _id: req.body.doc_id }).then(doc => {
            if (doc) {

                res.json(doc);
            }
            else {
                errors.code = 'Doc code does not exist';
                return res.status(400).json(errors);
            }
        });

        res.status(200);
    });

// @route   POST api/classes/update_comments
// @desc    Update the comments and grade of the document
// @access  Private
router.post('/update_comments',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateUpdateCommentsInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }



        Doc.findOne({ _id: req.body.doc_id }).then(doc => {
            if (doc) {

                if (parseInt(req.body.grade, 10) > doc.max_grade) {
                    errors.grade = 'Grade exceeds maximum';
                    return res.status(400).json(errors);
                }

                doc.comments = req.body.comments;
                var grader_exists = false;

                for (var i = 0; i < doc.grades.length; i++) {
                    if (doc.grades[i].grader === req.user.id) {
                        doc.grades[i].grade = parseInt(req.body.grade, 10);
                        grader_exists = true;
                        break;
                    }
                }

                if (!grader_exists) {
                    doc.grades.push({ grader: req.user.id, grade: parseInt(req.body.grade, 10) });

                    req.user.profile.commented_document_ids.push({
                        doc_id: doc._id,
                        class_code: doc.course_code,
                        assign_name: doc.assignment_name,
                        submitted: true
                    });

                    req.user.save();
                }

                doc.save();
                res.json(doc);
            }
            else {
                errors.code = 'Doc code does not exist';
                return res.status(400).json(errors);
            }
        });

        res.status(200);
    });

module.exports = router;