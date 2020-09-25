const advancedResults = (model, populate) => async (req, res, next) => {
  try {
    let query;
    // copy req.query
    const reqQuery = { ...req.query };

    console.log(reqQuery);
    // remove fields
    const removeFields = ["filter", "select", "sort", "page", "limit"];
    removeFields.forEach(param => delete reqQuery[param]);

    // convert query to string
    let queryStr = JSON.stringify(reqQuery);

    // attach for quering
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    // run query
    query = model.find(JSON.parse(queryStr));

    // select query
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    // pagination query
    query = query.skip(startIndex).limit(limit);

    // check if populate exists
    if (populate) {
      query = query.populate(populate);
    }

    // get all results
    results = await query;

    // pagination links
    pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = advancedResults;
