# hayosha_crm_node

# Install Packages
	- npm install

# Create database in pgadmin
    - Run all queries in db_scripts/schema_prototype.sql

# Create folders
	- server_config
    	- create server_config folder from server_config_example
			<!-- mkdir server_config -->
		- Create app_start_params.yaml file and set appropriate environment
			<!-- vim server_config/app_start_params.yaml -->
		- Add valid credentials in all the files as per need
	- event_push_logs
		<!-- mkdir event_push_logs -->
	- env_config.yaml
		<!-- mkdir production -->
		<!-- vim appconfig/production/env_config.yaml -->
