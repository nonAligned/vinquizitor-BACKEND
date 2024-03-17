const Glass = require('../models/Glass');
const mongoose = require('mongoose');


const getByType = async (req, res) => {
    try {
        const glass = await Glass.findOne({type: req.params.type});
        if(!glass) throw Error (`No glass of type: ${req.params.type} found in database`);

        res.status(200).json(glass);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    getByType
}