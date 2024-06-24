// htmx.logAll();
const getTootId = (url) => new URL(url).pathname.split('/').pop()
const getStatusUrl = (id) => `/api/v1/statuses/${id}`;

function prefillForm(evt) {
  const url = new URL(window.location);
  if (url.searchParams.has('toot')) {
    evt.detail.elt.elements.toot.value = url.searchParams.get('toot');
  }
}

function updateHistory(evt) {
  const { toot } = htmx.values(evt.detail.elt);
  if (toot) {
    const url = new URL(window.location)
    url.searchParams.set('toot', toot);
    window.history.pushState({}, "", url);
  }
}

function remapRequest(evt) {
  const toot = new URL(evt.detail.parameters.toot);
  evt.detail.parameters = {};
  
  const id = getTootId(toot);
  toot.pathname = getStatusUrl(id);
  evt.detail.path = toot.toString();
}

function handleMastodonApiResponse(evt) {
  const { serverResponse } = evt.detail;
  const { in_reply_to_id, content } = JSON.parse(serverResponse);

  const requestUrl = new URL(evt.detail.requestConfig.path);
  requestUrl.pathname = getStatusUrl(in_reply_to_id);

  const parent = in_reply_to_id ? `<div
    hx-get="${ requestUrl.toString() }"
    hx-swap="outerHTML"
    hx-on="htmx:beforeSwap: handleMastodonApiResponse(event)"
    hx-trigger="load delay:0.5s">Loading parent toot...</div>` : '';

  evt.detail.serverResponse = `${ parent }<section>${ content }</section>`;
}
