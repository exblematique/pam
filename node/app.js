const express = require('express')
const app = express()


app.use('/node', express.static('www'));
/*app.get('/node', function (req, res) {
    res.send('Hello World!')
})
*/

app.listen(process.env.PORT, process.env.IP, function () {
    console.log('Example app started!')
})
