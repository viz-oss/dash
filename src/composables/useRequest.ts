import { ref, shallowRef, type Ref } from 'vue'

type RequestError<T> = Error & {
  status: number
  statusText: string
  data: T | null
  response: Response
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

function parseResponseBody<T>(response: Response): Promise<T | null> {
  if (response.status === 204 || response.status === 205) {
    return Promise.resolve(null)
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''

  if (contentType.includes('application/json') || contentType.includes('+json')) {
    return response.json() as Promise<T>
  }

  if (contentType.startsWith('text/')) {
    return response.text() as Promise<T>
  }

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    return response.formData() as Promise<T>
  }

  if (
    contentType.includes('application/octet-stream')
    || contentType.startsWith('image/')
    || contentType.startsWith('audio/')
    || contentType.startsWith('video/')
    || contentType.includes('application/pdf')
  ) {
    return response.blob() as Promise<T>
  }

  return response.text().then((body) => {
    const trimmedBody = body.trim()

    if (!trimmedBody) {
      return null
    }

    if (trimmedBody.startsWith('{') || trimmedBody.startsWith('[')) {
      return JSON.parse(trimmedBody) as T
    }

    return body as T
  })
}

function createRequestError<T>(response: Response, data: T | null): RequestError<T> {
  const message = response.statusText
    ? `Request failed with status ${response.status} ${response.statusText}`
    : `Request failed with status ${response.status}`

  return Object.assign(new Error(message), {
    status: response.status,
    statusText: response.statusText,
    data,
    response,
  })
}

export function useRequest<T>(url: string, options?: RequestInit): { data: Ref<T | null>; error: Ref<any>; isFetching: Ref<boolean> } {
  if (!isValidUrl(url)) {
    return {
      data: shallowRef<T | null>(null),
      error: ref(new Error(`Invalid URL: ${url}`)),
      isFetching: ref(false),
    }
  }

  const data: Ref<T | null> = ref(null)
  const error = ref<any>(null)
  const isFetching = ref(true)

  fetch(url, options)
    .then((res) => parseResponseBody<T>(res).then((responseData) => {
      if (!res.ok) {
        throw createRequestError(res, responseData)
      }

      return responseData
    }))
    .then((responseData) => (data.value = responseData))
    .catch((err) => (error.value = err))
    .finally(() => (isFetching.value = false))

  return { data, error, isFetching }
}