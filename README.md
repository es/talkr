Talkr - chat with visitors now
=====================
Talkr is a drop-in chatbox that allows you to chat with visitors to your site. Talkr uses [Socket.io](https://github.com/LearnBoost/socket.io), [Redis](https://github.com/antirez/redis), and [Express](https://github.com/visionmedia/express) allowing it to scale to any size whilst maintaining it's speed and responsiveness.


Getting Started
---------
Talkr needs the following applications to run:

 - Redis 
 - Node.js

This is the build script used when setting up a talkr server:
```shell
apt-get update
apt-get install -y make g++

# Setting up Node.js
wget http://nodejs.org/dist/v0.10.25/node-v0.10.25.tar.gz
tar -xvf node-v0.10.25.tar.gz
rm node-v0.10.25.tar.gz
cd node-v0.10.25/
./configure
make
make install
cd ..

#Setting up Redis
# Setup Redis
apt-get install -y redis-server
redis-server

# Install dependencies
cd /{Directory in which talkr is located}
npm install
```

Once the server is setup, add a script tag loading talkr (talkr will load its own CSS files). Make sure talkr's css files and html files are all in the same talkr folder.
```html
<script src="talkr/talkr.js"></script>
```

If socket.io isn't present, add a script tag loading it as well.
```html
<script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
```

*You know have a talkr chatbox on your website!*

License
---------

MIT © [Emil Stolarsky](http://stolarsky.com/)