import { type EntryContext } from '@react-router/node';
import { renderToPipeableStream } from 'react-dom/server';
import { ServerRouter } from '@react-router/react';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} />,
      {
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html');
          resolve(
            new Response(pipe, {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
      }
    );

    setTimeout(abort, 5_000);
  });
}
