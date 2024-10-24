import {
  IsIn,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadImageMediasInputConstructorProps = {
  video_id: string;
  field: 'banner' | 'thumbnail' | 'thumbnail_half';
  file: FileMediaInput;
};

export class UploadImageMediasInput {
  // @IsUUID('4', { each: true })
  @IsString()
  @IsOptional()
  video_id: string;

  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field: 'banner' | 'thumbnail' | 'thumbnail_half';

  @ValidateNested()
  @IsInstance(FileMediaInput)
  file: FileMediaInput;

  constructor(props: UploadImageMediasInputConstructorProps) {
    if (!props) return;

    this.video_id = props.video_id;
    this.field = props.field;
    this.file = new FileMediaInput(props.file);
  }
}

export class ValidateUploadImageMediasInput {
  static validate(input: UploadImageMediasInput) {
    return validateSync(input);
  }
}
