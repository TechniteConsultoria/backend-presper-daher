import PermissionChecker from '../../services/user/permissionChecker';
import Storage from '../../security/storage';
import FileStorage from '../../services/file/fileStorage';
import ApiResponseHandler from '../apiResponseHandler';
import Error403 from '../../errors/Error403';
require('dotenv').config();




export default async (req, res) => {
  try {
    let tenantId = process.env.TENANT_ID || ''; 
    const filename = req.params.filename;
    const storageId = "clienteFoto";

    // The config storage has the information on where
    // to store the file and the max size
    const config = Storage.values[storageId];

    const tenant = tenantId.toString();

    if (!config) {
      throw new Error403();
    }

    // The private URL is the path related to the bucket/file system folder
    let privateUrl = `${config.folder}/${filename}`;
    privateUrl = privateUrl.replace(
      ':tenantId',
      tenant,
    );

    const maxSizeInBytes = config.maxSizeInBytes;

    const downloadUrl = await FileStorage.downloadUrl(
      privateUrl
    );

    /**
     * Upload Credentials has the URL and the fields to be sent
     * to the upload server.
     */
    const uploadCredentials = await FileStorage.uploadCredentials(
      privateUrl,
      maxSizeInBytes
    );

    await ApiResponseHandler.success(req, res, {
      privateUrl,
      downloadUrl,
      uploadCredentials,
    });
    
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
