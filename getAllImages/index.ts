import { AzureFunction, Context, HttpRequest } from "@azure/functions";

type Image = {
  id: string;
  uri: string;
};

const getAllImages: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  inputDocument: Image[]
): Promise<any> {
  const content = inputDocument.map((element) => {
    return { id: element.id, uri: element.uri };
  });
  return {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
    body: content,
  };
};
export default getAllImages;
