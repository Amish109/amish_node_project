CREATE TABLE IF NOT EXISTS users (

	id SERIAL PRIMARY KEY,

	user_name varchar(255) NOT NULL,
	mobile varchar(20),
	email varchar(255),
	role varchar(255),
	password varchar(1024),
	otp_value varchar(255) DEFAULT NULL,
	otp_expiry TIMESTAMP DEFAULT NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS documents (

	id SERIAL PRIMARY KEY,

	original_file_name varchar(1024),
	file_name varchar(255),
	file_path varchar(2048),
	file_type varchar(255) DEFAULT NULL, -- aadhaar, pan, profile_pic, etc
	file_size varchar(255) DEFAULT 0,
	document_no varchar(255) DEFAULT NULL,

	misc json DEFAULT '{}',
	
	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS client (

	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	client_logo_id INTEGER DEFAULT NULL,

	corporate_name varchar(255) NOT NULL,
	client_code varchar(20) NOT NULL,
	mobile varchar(20),
	mobile_2 varchar(20) DEFAULT NULL,
	landline varchar(20) DEFAULT NULL,
	email varchar(255),
	secondary_email varchar(255) DEFAULT NULL,

	distributors_count INTEGER DEFAULT 0,
	operators_count INTEGER DEFAULT 0,
	remarks varchar(255) DEFAULT NULL,

	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY(client_logo_id) REFERENCES documents(id) ON DELETE SET NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS distributor (

	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	client_id INTEGER,
	aadhaar_doc_id INTEGER DEFAULT NULL,
	pan_doc_id INTEGER DEFAULT NULL,

	name varchar(255) NOT NULL,
	mobile varchar(20),
	mobile_2 varchar(20) DEFAULT NULL,
	landline varchar(20) DEFAULT NULL,
	email varchar(255),
	secondary_email varchar(255) DEFAULT NULL,

	address varchar(255),
	city varchar(128),
	district varchar(128),
	state varchar(128),
	pincode varchar(10),

	operators_count INTEGER DEFAULT 0,
	remarks varchar(255) DEFAULT NULL,

	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY(client_id) REFERENCES client(id) ON DELETE SET NULL,
	FOREIGN KEY(aadhaar_doc_id) REFERENCES documents(id) ON DELETE SET NULL,
	FOREIGN KEY(pan_doc_id) REFERENCES documents(id) ON DELETE SET NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS operator (

	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	client_id INTEGER,
	distributor_id INTEGER,
	ko_id varchar(255),
	aadhaar_doc_id INTEGER DEFAULT NULL,
	pan_doc_id INTEGER DEFAULT NULL,
	bank_doc_id INTEGER DEFAULT NULL,

	operator_id INTEGER,

	name varchar(255) NOT NULL,
	mobile varchar(20),
	mobile_2 varchar(20) DEFAULT NULL,
	landline varchar(20) DEFAULT NULL,
	email varchar(255),

	address varchar(255),
	city varchar(128),
	district varchar(128),
	state varchar(128),
	pincode varchar(10),

	designation varchar(255),
	is_active INTEGER DEFAULT 1,
	remarks varchar(255) DEFAULT NULL,

	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY(client_id) REFERENCES client(id) ON DELETE SET NULL,
	FOREIGN KEY(distributor_id) REFERENCES distributor(id) ON DELETE SET NULL,
	FOREIGN KEY(aadhaar_doc_id) REFERENCES documents(id) ON DELETE SET NULL,
	FOREIGN KEY(pan_doc_id) REFERENCES documents(id) ON DELETE SET NULL,
	FOREIGN KEY(bank_doc_id) REFERENCES documents(id) ON DELETE SET NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS insurance_company (

	id SERIAL PRIMARY KEY ,

	name varchar(255) NOT NULL,
	description TEXT DEFAULT NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS product (

	id SERIAL PRIMARY KEY,
	insurance_company_id INTEGER,
	line_of_business varchar(255) DEFAULT NULL,

	name varchar(255) NOT NULL,
	description TEXT DEFAULT NULL,
	amount DECIMAL,

	FOREIGN KEY(insurance_company_id) REFERENCES insurance_company(id) ON DELETE SET NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS package (

	id SERIAL PRIMARY KEY,

	name varchar(255) NOT NULL,
	description TEXT,
	amount DECIMAL,
	inception_date date DEFAULT NULL,
	expiry_date date DEFAULT NULL,
	package_code varchar(255),
	template_code varchar(255) DEFAULT NULL,
	rules json DEFAULT '{}',

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS package_products (

	id SERIAL PRIMARY KEY,
	package_id INTEGER,
	product_id INTEGER,

	FOREIGN KEY(package_id) REFERENCES package(id) ON DELETE SET NULL,
	FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL,

	UNIQUE(package_id, product_id),

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);


CREATE TABLE IF NOT EXISTS policy (

	id SERIAL PRIMARY KEY,
	policy_no varchar(255),
	policy_date date DEFAULT CURRENT_DATE,
	premium_amount DECIMAL,
	commission_amount DECIMAL,
	txn_amount DECIMAL,
	txn_id varchar(255),
	payment_mode varchar(255),
	policy_status varchar(255) DEFAULT 'pending', -- 'failed' | 'success' | 'pending'

	user_id INTEGER DEFAULT NULL,
	package_id INTEGER,
	product_id INTEGER DEFAULT NULL,
	operator_id INTEGER DEFAULT NULL,
	distributor_id INTEGER DEFAULT NULL,
	client_id INTEGER DEFAULT NULL,
	aadhaar_doc_id INTEGER DEFAULT NULL,
	pan_doc_id INTEGER DEFAULT NULL,			
	first_name varchar(255),
	middle_name varchar(255),
	last_name varchar(255),
	dob date,
	mobile varchar(20),
	email varchar(255),
	document_type varchar(255),
	document_no varchar(255),
	height DECIMAL,
	weight DECIMAL,
	marital_status varchar(255),
	occupation varchar(1024),

	address varchar(255),
	city varchar(128),
	district varchar(128),
	state varchar(128),
	pincode varchar(10),

	nominee_name varchar(255),
	nominee_dob date DEFAULT NULL,
	nominee_relation varchar(255),

	remarks TEXT DEFAULT NULL,
	misc json DEFAULT '{}',

	FOREIGN KEY(package_id) REFERENCES package(id) ON DELETE SET NULL,
	FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL,
	FOREIGN KEY(operator_id) REFERENCES operator(id) ON DELETE SET NULL,
	FOREIGN KEY(distributor_id) REFERENCES distributor(id) ON DELETE SET NULL,
	FOREIGN KEY(client_id) REFERENCES client(id) ON DELETE SET NULL,
	FOREIGN KEY(aadhaar_doc_id) REFERENCES documents(id) ON DELETE SET NULL,
	FOREIGN KEY(pan_doc_id) REFERENCES documents(id) ON DELETE SET NULL,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,

	is_obsolete INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(255),
	updated_by varchar(255)
);
