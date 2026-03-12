import { APIRequestContext } from "@playwright/test";
import { APILogger } from "./logger";
import { expect, test } from "@playwright/test";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl: string | undefined;
  private defaultBaseUrl: string;
  private apiPath: string = "";
  private queryParams: Record<string, unknown> = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: Record<string, unknown> = {};
  private defaultAuthToken: string = "";
  private clearAuthFlag: boolean = false;

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    authToken: string = "",
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
    this.defaultAuthToken = authToken;
  }

  url(url: string) {
    this.baseUrl = url;
    return this;
  }

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  params(params: Record<string, unknown>) {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }

  body(body: Record<string, unknown>) {
    this.apiBody = body;
    return this;
  }

  clearAuth() {
    this.clearAuthFlag = true;
    return this;
  }

  /**
   * Sends a GET request using the configured URL (base + path + query), headers, and params.
   * Asserts response status equals statusCode, then returns the response body as parsed JSON.
   */
  async getRequest(statusCode: number) {
    let responseJSON: any;

    const url = this.getUrl();
    await test.step(`GET request to ${url}`, async () => {
      this.logger.logRequest("GET", url, this.getHeaders());
      const response = await this.request.get(url, {
        headers: this.getHeaders(),
      });
      this.cleanupFields();

      const actualStatus = response.status();
      responseJSON = await response.json();

      this.logger.logResponse(actualStatus, responseJSON);
      this.statusCodeValidator(actualStatus, statusCode, this.getRequest);
      expect(actualStatus).toEqual(statusCode);
    });

    return responseJSON;
  }

  async postRequest(statusCode: number) {
    let responseJSON: any;

    await test.step(`POST request to ${this.getUrl()}`, async () => {
      const url = this.getUrl();
      this.logger.logRequest("POST", url, this.getHeaders(), this.apiBody);
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: this.apiBody,
      });
      this.cleanupFields();

      const actualStatus = response.status();
      responseJSON = await response.json();

      this.logger.logResponse(actualStatus, responseJSON);
      this.statusCodeValidator(actualStatus, statusCode, this.postRequest);
      expect(actualStatus).toEqual(statusCode);
    });

    return responseJSON;
  }

  async putRequest(statusCode: number) {
    let responseJSON: any;

    await test.step(`PUT request to ${this.getUrl()}`, async () => {
      const url = this.getUrl();
      this.logger.logRequest("PUT", url, this.getHeaders(), this.apiBody);
      const response = await this.request.put(url, {
        headers: this.getHeaders(),
        data: this.apiBody,
      });
      this.cleanupFields();

      const actualStatus = response.status();
      responseJSON = await response.json();

      this.logger.logResponse(actualStatus, responseJSON);
      this.statusCodeValidator(actualStatus, statusCode, this.putRequest);
      expect(actualStatus).toEqual(statusCode);
    });

    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    await test.step(`DELETE request to ${this.getUrl()}`, async () => {
      const url = this.getUrl();
      this.logger.logRequest("DELETE", url, this.getHeaders());
      const response = await this.request.delete(url, {
        headers: this.getHeaders(),
      });
      this.cleanupFields();

      const actualStatus = response.status();

      this.logger.logResponse(actualStatus);
      this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest);
      expect(actualStatus).toEqual(statusCode);
    });
  }

  /**
   * Builds the full request URL: base (or default) + path + query string.
   * Query string comes from .params() (e.g. for GET: ?limit=20&tag=react).
   * Uses defaultUrl when .url() was never called (baseUrl is null/undefined).
   */
  private getUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`,
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, String(value));
    }
    return url.toString();
  }

  private statusCodeValidator(
    actualStatus: number,
    expectedStatus: number,
    callingMethod: Function,
  ) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}\n\n${logs}`,
      );
      Error.captureStackTrace(error, callingMethod);
      throw error;
    }
    return true;
  }

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.apiHeaders["Authorization"] =
        this.apiHeaders["Authorization"] || this.defaultAuthToken;
    }
    return this.apiHeaders;
  }

  private cleanupFields() {
    this.apiPath = "";
    this.queryParams = {};
    this.apiHeaders = {};
    this.apiBody = {};
    this.baseUrl = undefined;
    this.clearAuthFlag = false;
  }

  /** Returns recent request/response logs for attaching to the report (e.g. test.info().attach(..., { body: api.getRecentLogs() })). */
  getRecentLogs(): string {
    return this.logger.getRecentLogs();
  }
}
