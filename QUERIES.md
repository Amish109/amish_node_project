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


## SUB QUERIES
-- SELECT COUNT(*) FROM(
SELECT a.name, a.designation,a.salary ,b.department_name ,b.years FROM public.employee a JOIN public.department_table b ON a.department_id = b.id
) data_1 GROUP BY data_1.department_name;

-- WITH data_1 AS (
    SELECT a.name, a.designation, a.salary, b.department_name, b.years 
    FROM public.employee a 
    JOIN public.department_table b ON a.department_id = b.id
)
SELECT data_1.department_name, COUNT(*) AS employee_count 
FROM data_1 
GROUP BY data_1.department_name;



WITH test_data AS(
    SELECT MIN(id) AS min_id FROM location_table
)
SELECT area , id FROM location_table WHERE id = (SELECT min_id FROM test_data)






## JOINS
SELECT a.name , b.department_name , c.area
FROM
public.employee a INNER JOIN public.department_table b ON a.department_id = b.id INNER JOIN public.location_table c
ON b.location_id = c.id; 