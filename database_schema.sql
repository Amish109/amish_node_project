CREATE TABLE email_stats(
	email_from VARCHAR(255),
	email_to VARCHAR(255),
	subject VARCHAR(255),
	body VARCHAR(255),
	email_status VARCHAR(255),
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	email_response_id VARCHAR(255),
	attachment VARCHAR(255)
)

DROP TABLE email_stats
SELECT * FROM email_stats