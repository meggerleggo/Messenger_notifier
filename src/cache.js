const fs = require('fs');

module.exports = 
{

    responses: [
        {
            url: String(),
            body: String(), 
            sender: String()
        }
    ],
    
    userinfo: {

        current: {},
        
        save(path = String())
        {
            if (fs.existsSync(path))
            {
                if (fs.existsSync(path + '.old'))
                {
                    fs.unlinkSync(path + '.old');
                }
                
                fs.renameSync(path, path + '.old');
            }

            fs.writeFileSync(path, JSON.stringify(this.current));
        },

        load(path = String())
        {
            if (!fs.existsSync(path))
            {
                console.log('Specified path does not exist');

                if (fs.existsSync(path + '.old'))
                {
                    fs.renameSync(path + '.old', path);
                }
                else
                {
                    this.save(path);
                }
            }

            let content = JSON.parse(fs.readFileSync(path)); 

            if (content)
            {
                for (const key in content)
                {
                    this.current[key] = content[key];
                }
            }
            else
            {
                throw "Could not load cache";
            }
        },

        // DEBUG
        logAll()
        {
            for (const key in this.current)
            {
                console.log(key + ':' + this.current[key]);
            }
        },
    }
}