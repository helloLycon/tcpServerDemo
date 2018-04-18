
/* stdin */
function termInit(clients){
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk == null) {
            return;
        }
        //process.stdout.write(`data: ${chunk}`);
        /*
        if( chunk.match('show') ){
            console.log(`clients.size = ${clients.size}`);
            clients.forEach( c =>{
                console.log(JSON.stringify(c));
            });
            //console.log(JSON.stringify(clients));
            return;
        }*/
        clients.forEach(cli => {
            cli.write(`${chunk}`);
        });
    });
}

module.exports = {
    termInit: termInit,
};