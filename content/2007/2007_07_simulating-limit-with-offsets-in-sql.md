Title: Simulating LIMIT with offsets in SQL
Date: 2007-07-29
Author: Seppe "Macuyiko" vanden Broucke

How can you do this (x is number of rows to fetch, y is offset) (Mysql):

    SELECT * FROM my_table LIMIT x, y

or this (PostgreSQL) :

    SELECT * FROM my_table LIMIT x OFFSET y

in a DBMS that doesn't support LIMIT statements (take Oracle for example).

In Oracle, you can use ROWNUM, which holds the current row number:

    SELECT * FROM
      (SELECT ROWNUM limit, * FROM my_table ORDER BY order_field)
    WHERE limit BETWEEN x AND y

In SQL Server (>2005), you can use a similar trick, using the ROW_NUMBER function:

    WITH ordered AS (
      SELECT ROW_NUMBER() OVER (ORDER BY order_field) AS limit, *
      FROM my_table)
    SELECT *
    FROM ordered
    WHERE limit BETWEEN x AND y

When using another database (Access for example), you can use TOP when available:

    SELECT * FROM
      (SELECT TOP x * FROM
      (SELECT TOP x+y * FROM my_table ORDER BY order_field)
    AS innerT
    ORDER BY order_field DESC) AS outerT
    ORDER BY order_field

Or, another option:

    SELECT TOP x * FROM my_table
    WHERE order_field NOT IN
    (SELECT TOP y * FROM my_table ORDER BY order_field)

Some databases don't allow TOP in subselects, so we have to use yet another method:

    SELECT * FROM my_table outerT
    WHERE
    (SELECT COUNT(*)
    FROM my_table innerT
    WHERE innerT.order_field order_field)
    BETWEEN y+1 AND x+y
    ORDER BY outerT.order_field ASC;

Should that fail too, you can always do:

    SELECT TOP x * FROM my_table WHERE order_field > z

With z the last fetched order_field value from the previous page.

You can also find a handy article on the IBM site describing how you can [simulate row numbers](http://www-1.ibm.com/support/docview.wss?rs=64&uid=swg27005359).


