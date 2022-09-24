function response(res, status, result, message){
    var result = {
        status: status,
        result: result,
        message: message
    }
    res.setHeader("Content-Type", "application/json");
    res.writeHead(status);
    res.end(JSON.stringify(result));  
}

module.exports = response