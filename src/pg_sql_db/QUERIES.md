## SELECT more_data->'array_of_objects'->0->'name' name FROM public.students WHERE more_data->>'name' IS NOT NULL;

## CREATE TABLE course (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(255),
    course_duration INT,
    -- subject_id INT,?
    subject_foreign_key INT,
    FOREIGN KEY (subject_foreign_key) REFERENCES public.subject_table (id)
);


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













## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 INNER JOIN department_table t2 ON t1.department_id = t2.id;
-- ==========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 JOIN department_table t2 ON t1.department_id = t2.id; -- JOIN == INNER JOIN
-- ==========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 LEFT JOIN department_table t2 ON t1.department_id = t2.id; --LEFT JOIN ==LEFT OUTER JOIN
-- ==========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 LEFT OUTER JOIN department_table t2 ON t1.department_id = t2.id; --LEFT JOIN ==LEFT OUTER JOIN
-- =========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 RIGHT JOIN department_table t2 ON t1.department_id = t2.id;		--RIGHT JOIN ==RIGHT OUTER JOIN
-- ==========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 RIGHT OUTER JOIN department_table t2 ON t1.department_id = t2.id;	--RIGHT JOIN ==RIGHT OUTER JOIN
-- ==========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 FULL JOIN department_table t2 ON t1.department_id = t2.id;			--FULL JOIN ==FULL OUTER JOIN
-- ===========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 FULL OUTER JOIN department_table t2 ON t1.department_id = t2.id; 	--FULL JOIN ==FULL OUTER JOIN
-- =========================================================================
## SELECT t1.name,t1.designation,t2.department_name,t2.years
FROM
employee t1 CROSS JOIN department_table t2;







## Highest n SALARY FROM TABLE
 if n=3 (n-1)=2
SELECT * FROM employee t1 WHERE (n-1)= (SELECT COUNT(DISTINCT salary) FROM employee t2 WHERE t2.salary > t1.salary);


SELECT * FROM employee