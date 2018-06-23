module.exports =
{    
    url: {
        
        HOME: "https://www.facebook.com",
        
        MESSENGER: "https://www.messenger.com",
        
        DEV: "https://developers.facebook.com",

    },
    
    credentials: {
        
        password: String(),

        email: String(),

        load(path = String())
        {
            const fs = require('fs');
            
            if (!fs.existsSync(path))
            {
                throw "Config not found in specified path";
            }
            
            const config = JSON.parse(fs.readFileSync(path));
            
            if (config.email && config.password)
            {
                this.email = config.email;
                this.password = config.password;
            }
            else
            {
                throw "No credentials found";
            }
        }
    }
}