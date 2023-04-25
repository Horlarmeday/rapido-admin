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
