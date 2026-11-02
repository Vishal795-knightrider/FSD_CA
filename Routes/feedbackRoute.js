const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Feed = require('../Models/feedbackSchema');

router.post('/api/feedback',async(req, res) =>{
    try{
      const {studentName,courseName,message,rating } =req.body;
      if(!studentName||!courseName || !message || rating === undefined) {
          return res.status(400).json({
              message: "all fileds required"
          });
        }

      if (Number(rating) < 1||Number(rating)> 5 || !Number.isInteger(Number(rating))) {
          return res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
        }

        const newFeedback = new Feedback({
            studentName,
            courseName,
            message,
            rating
        });

        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: savedFeedback
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error submitting feedback',
            error: error.message
        });
    }
});

router.get('/api/feedback', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 5);

        const skip = (page - 1) * limit;
        const totalRecords = await Feedback.countDocuments();
        const feedbacks = await Feedback.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            currentPage: page,
            totalRecords: totalRecords,
            feedback: feedbacks
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching feedback',
            error: error.message
        });
    }
});



router.patch('/api/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid feedback ID'
            });
        }

        if (!['Pending', 'Reviewed'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be Pending or Reviewed'
            });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            message: 'Feedback status updated successfully',
            feedback: updatedFeedback
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating feedback',
            error: error.message
        });
    }
});

module.exports = router;
