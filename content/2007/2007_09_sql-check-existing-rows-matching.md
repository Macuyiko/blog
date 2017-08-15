Title: SQL: Check Existing Rows Matching A Condition
Date: 2007-09-15
Author: Seppe "Macuyiko" vanden Broucke

Instead of this:

    IF (SELECT COUNT(*) FROM Table1 WHERE ... ) > 0

use this:

    IF EXISTS(SELECT * FROM Table1 WHERE ...)

Great tip provided [by this article](http://weblogs.sqlteam.com/mladenp/archive/2007/09/13/SQL-Server-The-proper-and-fastest-way-to-check-if.aspx).

