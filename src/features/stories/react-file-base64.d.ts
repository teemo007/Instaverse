declare module "react-file-base64" {
  import type { ComponentType } from "react";

  interface FileBase64Result {
    base64: string;
  }

  interface FileBase64Props {
    type: "file";
    multiple: false;
    onDone: (result: FileBase64Result) => void;
  }

  const FileBase64: ComponentType<FileBase64Props>;

  export default FileBase64;
}
