export class ApiResponse {
    constructor(statusCode, data, message = "success") {
        this.status = statusCode;
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.success = statusCode < 400;
    }

    send(res) {
        res.status(this.status).json({
            status: this.status,
            data: this.data,
            message: this.message,
            timestamp: this.timestamp,
            success: this.success
        });
    }
};