import { Logger } from "@playwright/test";

export class APILogger {
  private recentLogs: any[] = [];

  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any,
  ) {
    const logEnrty = { method, url, headers, body };
    this.recentLogs.push({ type: "Request Details", data: logEnrty });
  }

  logResponse(statusCode: number, body?: any) {
    const logEnrty = { statusCode, body };
    this.recentLogs.push({ type: "Response Details", data: logEnrty });
  }

  getRecentLogs() {
    return this.recentLogs
      .map(
        (log) =>
          `=====${log.type}=====\n${JSON.stringify(log.data, null, 4)}\n`,
      )
      .join("");
  }

  /** Attaches recent request/response logs to the Playwright report. Call after the test (e.g. in fixture teardown). */
  async attachRecentLogsToReport(
    testInfo: { attach: (name: string, options: { body: string; contentType: string }) => Promise<void> },
  ) {
    const logs = this.getRecentLogs();
    if (logs) {
      await testInfo.attach("API request/response", {
        body: logs,
        contentType: "text/plain",
      });
    }
  }
}
