const cache = require('node-file-cache')

let cache = 0;
if (cache == 0) {
    try {
        cache = Cache.create();
    }
    catch (err) {
        try {
            fs.unlinkSync('./store.json');
        }
        catch (err) {

        }
        cache = Cache.create();

    }
}