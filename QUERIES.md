## SELECT more_data->'array_of_objects'->0->'name' name FROM public.students WHERE more_data->>'name' IS NOT NULL;

## CREATE TABLE new_table(
id SERIAL PRIMARY KEY,
test_data VARCHAR(255),
test_foreign_key INT  REFERENCES public.department_table(id)
)

## DROP TABLE new_table;
## ALTER TABLE public.employee ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES public.department_table(id);

## INSERT INTO students(id,"roll no","name","city") VALUES(6,35,'Tiwari Amish','Lower Parel');


## ALTER TABLE department_table RENAME COLUMN city TO YEARS;
## ALTER TABLE department_table DROP COLUMN pin_code;
## TRUNCATE TABLE  department_table CASCADE;
## SELECT* FROM department_table;


Inserting a value in fk which does not exist in table returns error