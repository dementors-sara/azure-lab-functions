import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 } from "uuid";

const funcHttpPostImages: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = v4();
  const document = {
    id: id,
    uri: `https://sarabaimagestore101.blob.core.windows.net/images/${id}.jpg`,
  };

  const blob = BlobServiceClient.fromConnectionString(
    process.env.STORAGE_CONNECTION_STRING
  );
  const client = blob
    .getContainerClient("images")
    .getBlockBlobClient(document.id + ".jpg");

  try {
    await client.uploadData(req.body);
  } catch (err) {
    context.log.error("Internal server error when storing image");
    context.res.status = 500;
  }

  context.res = {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
    body: document,
  };
  context.bindings.outputDocument = document;
  context.bindings.outputSbMsg = document;
};

export default funcHttpPostImages;
