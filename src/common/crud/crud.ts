import { HydratedDocument, Model, Types } from 'mongoose';

type FindOptionsType = {
  selectFields?: string | string[];
  populate?: string | string[];
  populateSelectFields?: string | string[];
};

type FindAndCountAllType = {
  model: Model<HydratedDocument<any>>;
  query: any;
  limit: number;
  offset: number;
  options?: FindOptionsType;
  displayScore?: boolean;
};

/**
 * Insert data into a document
 * @param model
 * @param fields
 */
export const create = async (
  model: Model<HydratedDocument<any>>,
  fields: object,
) => model.create({ ...fields });

export const upsert = async (
  model: Model<HydratedDocument<any>>,
  query: any,
  update: object,
) =>
  model.findOneAndUpdate({ ...query }, update, {
    upsert: true,
    returnDocument: 'after',
  });

/**
 * Find one document that matches filter
 * @param model
 * @param query
 * @param options
 */
export const findOne = async (
  model: Model<HydratedDocument<any>>,
  query: any,
  options?: FindOptionsType,
) =>
  model
    .findOne({ ...query })
    .select(options?.selectFields)
    .populate(<string>options?.populate, options?.populateSelectFields)
    .exec();

/**
 * Find document that matches ID
 * @param model
 * @param id
 * @param options
 */
export const findById = async (
  model: Model<HydratedDocument<any>>,
  id: Types.ObjectId,
  options?: object | string | [string],
) => model.findById(id, options).exec();

/**
 * Find all documents that matches filter
 * @param model
 * @param query
 * @param options
 */
export const find = async (
  model: Model<HydratedDocument<any>>,
  query: any,
  options?: FindOptionsType,
) =>
  model
    .find({ ...query })
    .select(options?.selectFields)
    .populate(<string>options?.populate, options?.populateSelectFields)
    .exec();

/**
 * Delete one document that matches filter
 * @param model
 * @param query
 */
export const deleteOne = async (
  model: Model<HydratedDocument<any>>,
  query: any,
) => model.deleteOne({ ...query });

/**
 * Delete many documents that matches filter
 * @param model
 * @param query
 */
export const deleteMany = async (
  model: Model<HydratedDocument<any>>,
  query: any,
) => model.deleteMany({ ...query });
/**
 * Update many documents that matches filter
 * @param model
 * @param query
 * @param fieldsToUpdate
 */
export const updateMany = async (
  model: Model<HydratedDocument<any>>,
  query: object,
  fieldsToUpdate: object,
) => model.updateMany({ ...query }, { $set: fieldsToUpdate });

/**
 * Update one document that matches filter
 * @param model
 * @param query
 * @param fieldsToUpdate
 */
export const updateOne = async (
  model: Model<HydratedDocument<any>>,
  query: object,
  fieldsToUpdate: object,
) => model.updateOne({ ...query }, { $set: fieldsToUpdate });

/**
 * Find all documents that matches filter and limits
 * @param model
 * @param query
 * @param limit
 * @param offset
 * @param options
 * @param displayScore
 */
export const findAndCountAll = async ({
  model,
  query,
  limit,
  offset,
  options,
  displayScore = false,
}: FindAndCountAllType) =>
  model
    .find(
      { ...query },
      { ...(displayScore && { score: { $meta: 'textScore' } }) },
    )
    .select(options?.selectFields)
    .populate(<string>options?.populate, options?.populateSelectFields)
    .limit(limit)
    .skip(offset)
    .sort({ ...(displayScore && { score: { $meta: 'textScore' } }) })
    .exec();

export const countDocuments = async (
  model: Model<HydratedDocument<any>>,
  filter = {},
) => model.countDocuments({ ...filter }).exec();

export const updateOneAndReturn = async (
  model: Model<HydratedDocument<any>>,
  query: any,
  fields: object,
) =>
  model.findOneAndUpdate(
    { ...query },
    { $set: { ...fields } },
    { returnDocument: 'after' },
  );

export const aggregateDataPerYear = async (
  model: Model<HydratedDocument<any>>,
  query: object,
) =>
  model.aggregate([
    // Filter documents
    {
      $match: {
        ...query,
      },
    },
    // Group documents by year and calculate the count
    {
      $group: {
        _id: { $year: '$created_at' },
        count: { $sum: 1 },
      },
    },
    // Project the results to the desired format
    {
      $project: {
        _id: 0,
        year: '$_id',
        count: 1,
      },
    },
    // Sort documents by year in ascending order
    {
      $sort: { year: 1 },
    },
  ]);

export const aggregateDataPerMonth = async (
  model: Model<HydratedDocument<any>>,
  query: object,
) =>
  model.aggregate([
    // Filter documents from the last 6 months
    {
      $match: {
        ...query,
      },
    },
    // Group documents by month and calculate the count
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    // Project the results to the desired format
    {
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: '%Y-%m',
            date: {
              $dateFromString: {
                dateString: {
                  $concat: [
                    { $toString: '$_id.year' },
                    '-',
                    { $toString: '$_id.month' },
                    '-01',
                  ],
                },
                format: '%Y-%m-%d',
              },
            },
          },
        },
        count: 1,
      },
    },
    // Sort documents by month in ascending order
    {
      $sort: { month: 1 },
    },
  ]);

export const aggregateDataPerWeek = (
  model: Model<HydratedDocument<any>>,
  query: object,
) =>
  model.aggregate([
    // Filter documents from the last 3 months
    {
      $match: {
        ...query,
      },
    },
    // Group documents by week and calculate the count
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          week: { $week: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    // Project the results to the desired format
    {
      $project: {
        _id: 0,
        week: { $concat: ['Week ', { $toString: '$_id.week' }] },
        year: '$_id.year',
        count: 1,
      },
    },
    // Sort documents by year and week in ascending order
    {
      $sort: { year: 1, week: 1 },
    },
  ]);

export const aggregateDataPerDay = (model, query) =>
  model.aggregate([
    {
      $match: {
        ...query,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$created_at',
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
