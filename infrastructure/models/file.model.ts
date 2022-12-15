import { Schema, model, models, Model } from 'mongoose';
import { ILodgeFile } from '../../types/file.type';

const fileSchema = new Schema<ILodgeFile>({
    original_name: {
        type: String,
        default: '',
    },
    custom_name: {
        type: String,
        default: '',
    },
    mimetype: {
        type: String,
        default: '',
    },
    extension: {
        type: String,
        default: '',
    },
    encoding: {
        type: String,
        default: '',
    },
    size: {
        type: Number,
        default: 0,
    },
    file_name: {
        type: String,
        default: '',
        unique: true,
        required: true,
        trim: true,
    },
    path: {
        type: String,
        default: '',
        index: true,
        unique: true,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        default: '',
    },
    created_on: {
        type: Date,
        default: Date.now(),
    },
    created_by: {
        type: Schema.Types.ObjectId,
        default: null,
    },
});

const File: Model<ILodgeFile, unknown, unknown, unknown, typeof fileSchema> = models.File || model<ILodgeFile>('File', fileSchema);

export default File;
