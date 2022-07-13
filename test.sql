INSERT INTO times
SET name = '${data.name}'
   , time = '${data.time}'
ON DUPLICATE KEY UPDATE
   time = IF (time < '${data.time}', '${data.time}', ti);




     let sql = `INSERT INTO times (name,time) VALUES ("${data.name}",${data.time});`



SELECT
    name,
    time,
    CASE
        WHEN time > ${data.time} THEN
            'short'
        WHEN milliseconds > 60000 AND milliseconds < 300000 THEN 'medium'
        ELSE
            'long'
        END category
FROM
    tracks;

    //let sql = `INSERT INTO times (name,time) VALUES ("${data.name}",${data.time});`
    //let sql = `INSERT INTO times(name,time) VALUES("${data.name}",${data.time}) ON CONFLICT(name) DO select * from times where name = "${data.name}" case when time>${data.time} then ;`


     //let sql = `INSERT INTO times(name,time) VALUES("${data.name}",${data.time}) ON CONFLICT(name) DO  case when time > ${data.time} then update times set time = ${data.time} where name = '${data.name}' ; `

    //let sql = `INSERT INTO times (name,time) values '${data.name}', ${data.time} ON DUPLICATE KEY UPDATE time = IF (time < ${data.time}, ${data.time}, time);`
    //let sql = `select * from times where name = '${data.name}' `

    //let sql = `update times set time = ${data.time} where name = '${data.name}' and time < ${data.time};`
    //let sql = `DECLARE @sname text, @time integer , @currentHightime integer SET @sname = '${data.name}' SET @time = ${data.time} set @currentHightime = (SELECT time FROM times WHERE [name]=@sname) IF @currentHightime is Null INSERT INTO times([name], time) VALUES(@sname, @time) ELSE IF @currentHightime < @time Update times Set time = @times where [name] = @sname;`
    //let sql = `if exists (select * from times where name = "${data.name}") update times set time = ${data.time} where name = "${data.name}" and time > ${data.time} else insert into times (name, time) values ("${data.name}", ${data.time});`


    // let sql = `select case when exists (select * from times where name = "${data.name}") then update times set time = ${data.time} where name = "${data.name}" and time > ${data.time} else insert into times (name, time) values ("${data.name}", ${data.time}) end;`


