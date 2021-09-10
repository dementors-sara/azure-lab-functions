import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const funcHttpGetJoke: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  interface Response {
    status: number;
    headers?: { [name: string]: string };
    body?: unknown;
  }

  const res: Response = {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
    body: {
      text: "What did the cat say to the dog? Mjau",
    },
  };
  context.log("Hello from joke function");
  context.res = res;
};

export default funcHttpGetJoke;
