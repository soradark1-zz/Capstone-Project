# Peer-Grading-System

## Setup a Development Environment

- Install the latest [Node.js]
- If running Windows, install [GitBash] and open it. Else if on Mac, open the terminal.
- `git clone git@github.com:soradark1/Capstone-Project.git` Clone the directory
- `cd Capstone-Project` Navigate to cloned directory 
- `npm install` Install required dependencies for the back-end server 
- `cd client` Navigate to client folder
- `npm install`install dependencies for the front-end server
- `cd ..` Navigate back to cloned directory 
- In the `/config` folder, create `keys_dev.js` file
- Open `keys_dev.js` and add the following code:
```sh
module.exports = {
  mongoURI: 'mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:12345/my-mlab-database'
  secretOrKey: 'secert'
};
```
- `mongoURI` value should be replaced with your [mLab] database URI. `secretOrKey` value can be whatever string you want.
- Start the development server by running `npm run dev` and stop the server using `Ctrl-C`


[Node.js]: http://nodejs.org/
[GitBash]: https://git-scm.com/downloads
[mLab]: https://mlab.com/login/
