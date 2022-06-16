function getMessageForStatusCode(code) {
  switch (code) {
    case 400:
      return "Bad Request";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Service Error";
    default:
      if (code >= 400 && code <= 499) {
        return "Client Error";
      }
      if (code >= 500 && code <= 599) {
        return "Server Error";
      }
      return "Unknown Error";
  }
}

class HttpError extends Error {
  constructor(statusCode, message = null) {
    super(message || getMessageForStatusCode(statusCode));
    this.status = statusCode;
  }
}

async function performRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (err) {
    console.error(`There was a problem performing the request: ${err}`);
    throw new HttpError(400);
  }
}

function checkResponse(response) {
  if (!response.ok) {
    console.error(
      `Request not successful: status = ${response.status}, statusText = ${response.statusText}`
    );
    throw new HttpError(response.status);
  }
}

async function parseResponse(response) {
  try {
    const parsedBody = await response.json();
    return parsedBody;
  } catch (err) {
    console.error(
      `Couldn't extract JSON body content from the response, error = ${err}`
    );
    throw new HttpError(null, "Unable to process the response from the server");
  }
}

async function getOne(url, id) {
  const request = new Request(`${url}/${id}`, { method: "GET" });
  const response = await performRequest(request);
  checkResponse(response);
  response.parsedBody = await parseResponse(response);
  console.log(`Parsed response: ${JSON.stringify(response.parsedBody)}`);
  return response;
}

export { getOne };
