// Base URL for the API
const API_URL = "http://localhost:8080";

/**
 * Makes an HTTP request to the given URL using the specified request options.
 * Throws an error if the response is not successful.
 *
 * @param {string} url - The endpoint to send the request to.
 * @param {object} requestOptions - The configuration object for the request.
 * @returns {Promise<object | undefined>} - A promise that resolves to the response data as JSON, or undefined for DELETE requests.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
const fetchData = async (url, requestOptions) => {
    const apiUrl = `${API_URL}${url}`;

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        if (requestOptions.method !== 'DELETE') {
            return response.json();
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Sends a GET request to the specified URL with the given query parameters.
 *
 * @param {string} url - The endpoint to send the GET request to.
 * @param {object} [params={}] - An optional object representing query parameters.
 * @returns {Promise<object>} - A promise that resolves to the response data as JSON.
 */
export const apiGet = (url, params = {}) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value != null)
    );

    const apiUrl = `${url}${new URLSearchParams(filteredParams).toString()}`;
    const requestOptions = {
        method: "GET",
    };

    return fetchData(apiUrl, requestOptions);
};

/**
 * Sends a POST request to the specified URL with the given data.
 *
 * @param {string} url - The endpoint to send the POST request to.
 * @param {object} data - The data to include in the body of the POST request.
 * @returns {Promise<object>} - A promise that resolves to the response data as JSON.
 */
export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

/**
 * Sends a PUT request to the specified URL with the given data.
 *
 * @param {string} url - The endpoint to send the PUT request to.
 * @param {object} data - The data to include in the body of the PUT request.
 * @returns {Promise<object>} - A promise that resolves to the response data as JSON.
 */
export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

/**
 * Sends a DELETE request to the specified URL.
 *
 * @param {string} url - The endpoint to send the DELETE request to.
 * @returns {Promise<void>} - A promise that resolves when the DELETE request is complete.
 */
export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};