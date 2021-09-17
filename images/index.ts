import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

const funcHttpPostImages: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const document = {
    id: "hej2",
    uri:
      "https://sarabaimagestore101.blob.core.windows.net/images/download.png",
  };

  const blob = BlobServiceClient.fromConnectionString(
    process.env.STORAGE_CONNECTION_STRING
  );
  const client = blob
    .getContainerClient("images")
    .getBlockBlobClient(document.id + ".jpg");

  await client.uploadData(req.body);
  
  context.res = {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
    body: document,
  };
  context.bindings.outputDocument = document;
};

export default funcHttpPostImages;
