WITH TotalCount AS (
    SELECT COUNT(*) AS total FROM public.employee
)
SELECT *, (SELECT total FROM TotalCount) AS total_count
FROM public.employee
LIMIT 2 OFFSET 3;




SELECT * FROM public.employee;

SELECT min(id) FROM public.employee;
-- SELECT min(id),min(name) AS min_id FROM public.employee;

-- SELECT * FROM employee WHERE id=(SELECT min(id) FROM public.employee); 
-- With Clause (CTE :- common table expression )

-- WITH minimum_id AS (SELECT MIN(id) as min_id FROM employee)
-- SELECT * FROM employee WHERE id=(SELECT min_id FROM minimum_id);

-- SELECT name,designation ,COUNT(salary) AS count_of_salary FROM employee GROUP BY employee.name,employee.designation