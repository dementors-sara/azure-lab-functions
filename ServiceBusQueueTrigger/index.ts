import { AzureFunction, Context } from "@azure/functions";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import resizeImg from "resize-img";

const streamToBuffer = async (
  readableStream: NodeJS.ReadableStream
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
};
const serviceBusQueueTrigger: AzureFunction = async function (
  context: Context,
  mySbMsg: any
): Promise<void> {
  context.log("----------------------");
  // Read the image from storage, this assumes
  let blockBlobClient = new BlockBlobClient(mySbMsg.uri);
  const download = await blockBlobClient.download();
  const buffer = await streamToBuffer(download.readableStreamBody);

  // resize image
  const resizedImage = await resizeImg(buffer, { width: 128, height: 128 });

  const blobContent = BlobServiceClient.fromConnectionString(
    process.env.STORAGE_CONNECTION_STRING
  );
  const client = blobContent
    .getContainerClient("thumbnails")
    .getBlockBlobClient(mySbMsg.id + ".jpg");

  await client.uploadData(resizedImage);

  const document = {
    id: mySbMsg.id,
    uri: mySbMsg.uri,
    thumbnail: client.url,
    bla: "HEJ",
  };
  context.bindings.outputDocument = document;
};

export default serviceBusQueueTrigger;
