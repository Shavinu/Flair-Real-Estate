import { HOST_URL } from "../config-global";
import { api } from "../paths";
import utils from "../utils";

const getImageUrl = (imageId) => {
  if (imageId) {
    return `${HOST_URL}${utils.url.replaceId(api.files.stream, imageId)}`;
  } else {
    return null;
  }
};

const FileService = {
  getImageUrl
}

export default FileService
