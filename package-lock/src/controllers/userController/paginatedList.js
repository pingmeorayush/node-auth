const mongoose = require('mongoose');

const paginatedList = async (userModel, req, res) => {
    const User = mongoose.model(userModel);

    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page * limit) - limit;

    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

    let fields;

    fields = fieldsArray.length === 0 ? {} : {$or:[]};
    
    for(const field of fieldsArray) {
        fields.$or.push({[field] : {$regex: new RegExp(req.query.q,'i')}})
    }

    const resultPromise = User.find({
       removed: false,
       [filter]: equal,
       ...fields 
    })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

    // counting the total documents
    const countPromise = User.countDocuments({
        removed: false,
        [filter]: equal,
        ...fields,
    })
    const [result, count] = await Promise.all([resultPromise, countPromise]);

    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    
    if (count > 0) {
        return res.status(200).json({
          success: true,
          result,
          pagination,
          message: 'Successfully found all documents',
        });
      } else {
        return res.status(203).json({
          success: true,
          result: [],
          pagination,
          message: 'Collection is Empty',
        });
      }
};

module.exports = paginatedList;