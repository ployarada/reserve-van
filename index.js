import app from 'express';
import oracledb from('oracledb');
import dbConfig from('./dbconfig.js');

const port = process.env.PORT || 7777;
 
oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      connection.execute(
        // The statement to execute
        `SELECT department_id, department_name
         FROM departments
         WHERE department_id = :id`,
        [180],
        { maxRows: 1
        },
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
          console.log(result.rows);     // [ [ 180, 'Construction' ] ]
          doRelease(connection);
        });
});

const doRelease = (connection) => {
    connection.close(
      function(err) {
        if (err) {
          console.error(err.message);
        }
      });
}

/* Routing */
app.get('/', function (req, res) {
    res.send('<h1>Hello Node.js</h1>');
});
app.get('/index', function (req, res) {
    res.send('<h1>This is index page</h1>');
});
 
/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});