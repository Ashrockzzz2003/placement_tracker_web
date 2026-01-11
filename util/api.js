/**
 * Fetches a resource with a retry mechanism.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @param {number} retries - The number of retries to attempt. Default is 3.
 * @param {number} backoff - The backoff time in milliseconds. Default is 300ms.
 * @returns {Promise<Response>} - The response from the fetch request.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
    try {
        const response = await fetch(url, options);

        // Retry on server errors (5xx)
        if (response.status >= 500 && retries > 0) {
            console.warn(`Fetch failed with status ${response.status}. Retrying in ${backoff}ms... (${retries} retries left)`);
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2); // Exponential backoff
        }

        return response;
    } catch (error) {
        // Retry on network errors
        if (retries > 0) {
            console.warn(`Fetch failed with error ${error.message}. Retrying in ${backoff}ms... (${retries} retries left)`);
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}
