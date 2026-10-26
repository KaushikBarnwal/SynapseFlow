---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 480
---

# 🗄️ SQL & Databases Learning Roadmap & Interview Prep

## 1. SQL Sub-Languages (DDL vs DML vs DQL vs DCL vs TCL)
### DDL (Data Definition Language)
- Defines and modifies database schema structure (Auto-commits immediately in most engines!)
- Commands: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`
- **`DELETE` vs `TRUNCATE` vs `DROP` Comparison**:
  | Feature | `DELETE` | `TRUNCATE` | `DROP` |
  | :--- | :--- | :--- | :--- |
  | **SQL Category** | DML | DDL | DDL |
  | **Scope** | Specified rows (`WHERE`) | All rows in table | Entire table & schema |
  | **Execution Speed** | 🐢 Slow (row-by-row logging) | ⚡ Fast (deallocates pages) | ⚡ Fast (removes catalog object) |
  | **Rollback Support** | ✅ Yes (recorded in Undo log) | ❌ No (auto-commit in most DBs) | ❌ No (irreversible) |
  | **Triggers Fired** | ✅ Fires row-level triggers | ❌ Does not fire triggers | ❌ Does not fire triggers |
  | **Identity Reset** | ❌ Retains current counter | ✅ Resets auto-increment to 1 | ❌ Table destroyed |
### DQL, DCL & TCL
- **DQL (Data Query Language)**: `SELECT` (pure data retrieval without state mutation)
- **DCL (Data Control Language)**: Manages permissions & privileges:
  ```sql
  GRANT SELECT, INSERT
  ON emp
  TO analyst_role;
  ```
  ```sql
  REVOKE DELETE
  ON emp
  FROM intern_role;
  ```
- **TCL (Transaction Control Language)**: Manages transaction boundaries:
  ```sql
  SAVEPOINT sp1;
  ROLLBACK TO sp1;
  COMMIT;
  ```

## 2. Logical Query Execution Order
### Order of Clauses
- **1. `FROM` & `JOIN`**: Identifies source tables, evaluates `ON` conditions, and creates cartesian/joined sets
- **2. `WHERE`**: Row-level filtering **before** grouping (cannot use aggregates)
- **3. `GROUP BY`**: Partitions filtered rows into distinct aggregated buckets
- **4. `HAVING`**: Filters groups based on aggregate results (`HAVING COUNT(*) > 5`)
- **5. `SELECT`**: Computes expressions, handles column aliases, and window functions
- **6. `DISTINCT`**: Eliminates duplicate rows from the projected columns
- **7. `ORDER BY`**: Sorts the output rows (can use `SELECT` aliases!)
- **8. `LIMIT` / `OFFSET`**: Paginates and restricts total returned rows
### Common Alias Trap
- You **cannot** use a `SELECT` alias inside a `WHERE` clause because `WHERE` runs at Step 2 while `SELECT` runs at Step 5!

## 3. Joins & Set Operations (With Syntax Examples)
### `INNER JOIN` (Matching Intersection)
- Syntax:
  ```sql
  SELECT e.name, d.dept_name
  FROM emp e
  INNER JOIN dept d
    ON e.dept_id = d.id;
  ```
- *Key Difference*: Retains **only** rows where the join predicate matches in **both** tables. Unmatched rows on either side are omitted.
### `LEFT JOIN` (All Left + Matching Right)
- Syntax:
  ```sql
  SELECT e.name, d.dept_name
  FROM emp e
  LEFT JOIN dept d
    ON e.dept_id = d.id;
  ```
- *Key Difference*: Preserves **every** row from the left table (`emp`). If no corresponding record exists in `dept`, right columns populate with `NULL`.
### Anti-Join Pattern (Exclusion Search)
- Syntax:
  ```sql
  -- [KEY IDEA] Anti-join via LEFT JOIN + IS NULL pinpoints records with zero matches:
  SELECT [hl]e.name[/hl]
  FROM emp e
  LEFT JOIN dept d
    ON [hl]e.dept_id = d.id[/hl]
  WHERE [hl]d.id IS NULL[/hl];
  ```
- *Key Difference*: Pinpoints records in the left table that have **zero matches** in the right table (significantly faster and safer than `NOT IN`).
### `RIGHT JOIN` (Matching Left + All Right)
- Syntax:
  ```sql
  SELECT e.name, d.dept_name
  FROM emp e
  RIGHT JOIN dept d
    ON e.dept_id = d.id;
  ```
- *Key Difference*: Preserves **every** row from the right table (`dept`), filling unmatched left columns with `NULL`.
### `FULL OUTER JOIN` (Union of Both Tables)
- Syntax:
  ```sql
  SELECT e.name, d.dept_name
  FROM emp e
  FULL OUTER JOIN dept d
    ON e.dept_id = d.id;
  ```
- *Key Difference*: Preserves all rows from both tables, filling missing counterparts with `NULL`. (In MySQL: emulate via `LEFT JOIN UNION RIGHT JOIN`).
### `CROSS JOIN` (Cartesian Product)
- Syntax:
  ```sql
  SELECT p.color, s.size
  FROM products p
  CROSS JOIN sizes s;
  ```
- *Key Difference*: Pairs every row in table $A$ with every row in table $B$ ($M \times N$ total rows). **No `ON` clause**.
### `SELF JOIN` (Hierarchical Relationships)
- Syntax:
  ```sql
  -- [KEY IDEA] Self-join pairs two distinct aliases of the same table to resolve hierarchies:
  SELECT [hl]e.name AS emp[/hl],
         [hl]m.name AS manager[/hl]
  FROM emp e
  LEFT JOIN emp m
    ON [hl]e.manager_id = m.id[/hl];
  ```
- *Key Difference*: Joins a table to itself using two distinct table aliases (`e` and `m`) to resolve parent-child relationships.
### Set Operations (`UNION` vs `UNION ALL`)
- **`UNION`**: Combines result sets vertically and runs an implicit deduplication sort (slower).
- **`UNION ALL`**: Appends result sets vertically **without deduplication** (fast, $\mathcal{O}(N)$).
- **`INTERSECT`**: Returns only rows present in both queries.
- **`EXCEPT` / `MINUS`**: Returns rows from the first query that do not exist in the second.

## 4. Database Normalization & Forms
### Purpose of Normalization
- Eliminates **Insertion, Update, and Deletion Anomalies** and minimizes data redundancy.
- Golden Rule: *"Every attribute must depend on the key, the whole key, and nothing but the key (so help me Codd)."*
### 1NF (First Normal Form) - Atomicity
- Values in each cell must be **atomic** (no multi-valued columns, CSV lists, or JSON blobs).
- Table must have a defined Primary Key and no duplicate rows.
### 2NF (Second Normal Form) - No Partial Dependency
- Must satisfy 1NF.
- **No Partial Dependencies**: Non-key attributes must depend on the **entire** composite Primary Key, not just a subset of it.
- *Fix*: Move partially-dependent columns to a separate dedicated table with the subset key.
### 3NF (Third Normal Form) - No Transitive Dependency
- Must satisfy 2NF.
- **No Transitive Dependencies**: Non-key attributes must NOT depend on other non-key attributes ($X \rightarrow Y \rightarrow Z$).
- *Example*: In `(EmpID, DeptID, DeptName)`, `DeptName` depends on `DeptID` which depends on `EmpID`. Move `(DeptID, DeptName)` to a separate `Department` table.
### BCNF (Boyce-Codd Normal Form)
- Strict variant of 3NF: For every functional dependency $X \rightarrow Y$, the determinant $X$ **must be a Super Key**.
### OLTP vs OLAP Denormalization Tradeoff
- **OLTP (Online Transaction Processing)**: Highly normalized (3NF) to maximize write throughput and eliminate data anomalies during rapid updates.
- **OLAP (Online Analytical Processing)**: Denormalized (Star / Snowflake Schema with Fact & Dimension tables) to eliminate costly joins during read-heavy reporting aggregations.

## 5. PL/SQL & Procedural SQL
### Block Structure
- Syntax:
  ```sql
  DECLARE
    v_bonus NUMBER := 500;
  BEGIN
    UPDATE emp
    SET salary = salary + v_bonus
    WHERE dept_id = 10;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
  END;
  ```
- *Core Blocks*: `DECLARE` (variables, cursors), `BEGIN` (executable logic), `EXCEPTION` (error handling), `END;`
### Stored Procedures vs Functions
- **Stored Procedure**:
  - Syntax:
    ```sql
    -- [KEY IDEA] Stored procedures execute transactional DML and commit/rollback changes:
    CREATE OR REPLACE PROCEDURE give_raise(
      p_id IN INT,
      p_amt IN DECIMAL
    ) AS
    BEGIN
      [hl]UPDATE emp[/hl]
      SET salary = salary + p_amt
      WHERE id = p_id;
      [hl]COMMIT;[/hl]
    END;
    ```
  - *Key Differences*: Invoked via `CALL` or `EXEC`; can execute DML and commit/rollback transactions; outputs values via `OUT` parameters; **cannot** be called inside `SELECT`.
- **Stored Function**:
  - Syntax:
    ```sql
    -- [KEY IDEA] Stored functions must return a single deterministic value and can be embedded in SELECT:
    CREATE OR REPLACE FUNCTION get_annual_sal(
      p_id IN INT
    ) [hl]RETURN DECIMAL[/hl] AS
      v_sal DECIMAL;
    BEGIN
      SELECT salary * 12 INTO v_sal
      FROM emp
      WHERE id = p_id;
      [hl]RETURN v_sal;[/hl]
    END;
    ```
  - *Key Differences*: **Must return** a single value via `RETURN`; **can** be used directly in SQL queries; cannot execute transaction commits inside SQL queries.
### Triggers
- Automatic routines triggered by database events (`INSERT`, `UPDATE`, `DELETE`).
- Syntax:
  ```sql
  -- [KEY IDEA] Row-level triggers intercept mutations via :OLD and :NEW pseudorecords:
  CREATE OR REPLACE TRIGGER trg_audit_emp
  AFTER UPDATE OF salary ON emp
  [hl]FOR EACH ROW[/hl]
  BEGIN
    INSERT INTO emp_audit(emp_id, old_sal, new_sal, changed_at)
    VALUES ([hl]:OLD.id[/hl], [hl]:OLD.salary[/hl], [hl]:NEW.salary[/hl], SYSDATE);
  END;
  ```
- **Timing**: `BEFORE` (data sanitization, validation) vs `AFTER` (audit logging, downstream sync) vs `INSTEAD OF` (updating views).
- **Scope**: Statement-level vs Row-level (`FOR EACH ROW` with `:OLD` and `:NEW`).
### Cursors (Row-by-Row Evaluation)
- Programmer-managed query result set pointer:
- Syntax:
  ```sql
  -- [KEY IDEA] Explicit cursors iterate over active query rows one at a time:
  DECLARE
    CURSOR c_emp IS
      SELECT id, salary FROM emp;
    v_id emp.id%TYPE;
    v_sal emp.salary%TYPE;
  BEGIN
    [hl]OPEN c_emp;[/hl]
    LOOP
      [hl]FETCH c_emp INTO v_id, v_sal;[/hl]
      [hl]EXIT WHEN c_emp%NOTFOUND;[/hl]
    END LOOP;
    [hl]CLOSE c_emp;[/hl]
  END;
  ```
- **Implicit Cursor**: Created automatically for DML (`SQL%FOUND`, `SQL%NOTFOUND`, `SQL%ROWCOUNT`).
- **Explicit Cursor Lifecycle**: `OPEN` $\rightarrow$ `FETCH` in a loop $\rightarrow$ `CLOSE`.
### Autonomous Transactions
- `PRAGMA AUTONOMOUS_TRANSACTION`: Executes an independent sub-transaction that commits or rolls back without affecting the outer parent transaction (essential for error audit logging tables).

## 6. Indexing & Query Optimization
### B+ Tree Indexes
- Balanced multi-way search tree; default in PostgreSQL, MySQL (InnoDB), and Oracle
- All data pointers live in **leaf nodes** connected as a doubly linked list
- High fanout $\rightarrow$ small depth ($\approx 3\text{--}4$ disk seeks for millions of rows)
- Range queries (`BETWEEN`, `>`, `<`) perform fast sequential leaf walks
### Clustered vs Non-Clustered Indexes
- **Clustered vs Non-Clustered Comparison**:
  | Dimension | Clustered Index | Non-Clustered (Secondary) Index |
  | :--- | :--- | :--- |
  | **Physical Ordering** | Dictates physical on-disk row order | Separate structure; does not reorder physical table |
  | **Quantity per Table** | Exactly **1** per table (usually Primary Key) | Multiple allowed (typically 1–10 per table) |
  | **Leaf Node Content** | Actual complete table row data pages | Indexed column values + pointer to clustered key |
  | **Lookup Performance** | Fast direct seek; no secondary step | Requires **Bookmark Lookup** unless query is covered |
### SARGable Queries & Prefix Rule
- **SARGable (Search Argument Able)**: Query conditions that can use index seeks
  - Avoid wrapping indexed columns in functions (e.g., `WHERE YEAR(date) = 2026` forces a Full Table Scan)
  - Rewrite as range:
    ```sql
    -- [KEY IDEA] SARGable range predicates enable fast B+ Tree index seeks instead of full table scans:
    WHERE [hl]date >= '2026-01-01'[/hl]
      AND [hl]date < '2027-01-01'[/hl]
    ```
- **Leftmost Prefix Rule**: Composite index on `(A, B, C)` can only be used by queries filtering `A`, `(A, B)`, or `(A, B, C)`

## 7. Transactions & ACID Properties
### ACID Principles
- **Atomicity**: All operations commit successfully or all rollback ("All-or-Nothing")
- **Consistency**: Database transitions from one valid state to another, obeying all integrity constraints
- **Isolation**: Concurrent transactions execute without cross-interference
- **Durability**: Once committed, writes survive server crashes via Write-Ahead Log (WAL)
### Concurrency Read Phenomena
- **Dirty Read**: Transaction reads uncommitted modifications made by another transaction
- **Non-Repeatable Read**: Re-reading the same row within a transaction returns different values due to another committed update
- **Phantom Read**: Re-running a range query returns newly inserted rows committed by another transaction
### Isolation Levels Matrix
- **Transaction Isolation vs Concurrency Anomalies**:
  | Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Default In |
  | :--- | :--- | :--- | :--- | :--- |
  | **Read Uncommitted** | ⚠️ Allowed | ⚠️ Allowed | ⚠️ Allowed | Rare / Custom |
  | **Read Committed** | 🛡️ Prevented | ⚠️ Allowed | ⚠️ Allowed | PostgreSQL, Oracle, SQL Server |
  | **Repeatable Read** | 🛡️ Prevented | 🛡️ Prevented | ⚠️ Allowed | MySQL InnoDB |
  | **Serializable** | 🛡️ Prevented | 🛡️ Prevented | 🛡️ Prevented | Strict Financial Engines |

## 8. Window Functions & CTEs
### Ranking Functions Syntax
- **Ranking Functions Comparison**:
  | Function | Tie Handling | Post-Tie Gap | Example Sequence ($100, 100, 90, 80$) |
  | :--- | :--- | :--- | :--- |
  | **`ROW_NUMBER()`** | Arbitrary sequential numbering | No gaps | $1, 2, 3, 4$ |
  | **`RANK()`** | Same rank assigned to equal values | Leaves gaps equal to tied count | $1, 1, 3, 4$ (skips $2$) |
  | **`DENSE_RANK()`** | Same rank assigned to equal values | Never leaves gaps | $1, 1, 2, 3$ (no skipping) |
  ```sql
  -- [KEY IDEA] DENSE_RANK assigns consecutive rankings across partition frames without skipping numbers:
  SELECT name, salary,
    [hl]DENSE_RANK() OVER ([/hl]
      PARTITION BY dept_id
      ORDER BY salary DESC
    [hl])[/hl] AS sal_rank
  FROM emp;
  ```
### Value Functions
- **`LEAD(col, 1)` / `LAG(col, 1)`**: Accesses subsequent or previous row without a self-join:
  ```sql
  -- [KEY IDEA] LAG accesses preceding row values within the ordered partition without self-joins:
  SELECT name, salary,
    [hl]LAG(salary, 1) OVER ([/hl]
      ORDER BY hire_date
    [hl])[/hl] AS prev_emp_sal
  FROM emp;
  ```
- **`OVER (PARTITION BY ... ORDER BY ...)`**: Defines the evaluation window partition frame
### Common Table Expressions (CTEs)
- Syntax:
  ```sql
  -- [KEY IDEA] CTE creates a clean named temporary result set to avoid redundant subqueries:
  WITH [hl]DeptAvg AS[/hl] (
    SELECT dept_id,
           AVG(salary) AS avg_sal
    FROM emp
    GROUP BY dept_id
  )
  SELECT e.name, e.salary, d.avg_sal
  FROM emp e
  JOIN [hl]DeptAvg d[/hl]
    ON [hl]e.dept_id = d.dept_id[/hl]
  WHERE [hl]e.salary > d.avg_sal[/hl];
  ```
- Can be **Recursive CTEs** (ideal for organizational hierarchies, trees, and graphs)

## 9. ⚠️ Tricky MCQ Traps & Edge Cases
### 🚨 Three-Valued Logic of NULL Trap
- **Trap**: `SELECT * FROM emp WHERE salary = NULL;`
- **Correct**: Returns **0 rows**! NULL represents `UNKNOWN`; any comparison with `= NULL` evaluates to UNKNOWN. Always use `IS NULL`.
### 🚨 `NOT IN` with NULL Subquery Trap
- **Trap**: `WHERE id NOT IN (1, 2, NULL)`
- **Correct**: Returns **0 rows**! Expands to `id != 1 AND id != 2 AND id != NULL`. Since `id != NULL` is UNKNOWN, the entire condition fails. Use `NOT EXISTS` instead.
### 🚨 `COUNT(*)` vs `COUNT(col)` Trap
- **Trap**: "Does `COUNT(salary)` return the same count as `COUNT(*)`?"
- **Correct**: **NO!** `COUNT(*)` counts all rows; `COUNT(col)` ignores rows where `col` is `NULL`.
### 🚨 `DELETE` vs `TRUNCATE` Trap
- **Trap**: "Can TRUNCATE be rolled back in standard MySQL?"
- **Correct**: **NO!** `TRUNCATE` is DDL (deallocates storage pages and resets auto-increment). `DELETE` is DML (row-by-row logged).

## 10. 🏆 Top 5 Must-Remember Rules
- **1. Remember Query Execution Order**: `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY`
- **2. Safe Subquery Filtering**: Always favor `NOT EXISTS` over `NOT IN` to prevent NULL-induced zero-result bugs
- **3. B+ Tree Covering Index**: Include queried columns in secondary indexes to eliminate expensive bookmark lookups
- **4. DENSE_RANK for Top-N**: Use `DENSE_RANK()` when finding the Nth highest value with ties
- **5. Write SARGable Filters**: Never apply functions to indexed columns in `WHERE` clauses
