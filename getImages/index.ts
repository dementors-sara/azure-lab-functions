import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const getImages: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  inputDocument
): Promise<unknown> {
  if (!inputDocument) {
    context.log("Inputdocument not found");
    return;
  }

  return {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
    body: inputDocument,
  };
};

export default getImages;
