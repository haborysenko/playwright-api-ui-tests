export class APILogger {
  private recentLogs: Record<string, unknown>[] = [];

  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: Record<string, unknown>,
  ) {
    const logEntry = { method, url, headers, body };
    this.recentLogs.push({ type: "Request Details", data: logEntry });
  }

  logResponse(statusCode: number, body?: Record<string, unknown>) {
    const logEntry = { statusCode, body };
    this.recentLogs.push({ type: "Response Details", data: logEntry });
  }

  getRecentLogs() {
    return this.recentLogs
      .map(
        (log) =>
          `=====${log.type}=====\n${JSON.stringify(log.data, null, 4)}\n`,
      )
      .join("");
  }
}
