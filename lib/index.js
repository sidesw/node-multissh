var readline = require('readline');
var spawn = require('child_process').spawn;

var MultiSsh = {
  command: null,
  singleCmd: false,
  ui: null,
  servers: [],
  connections: {},

  init: function(args) {
    var myArgv = args;
    myArgv.shift();
    myArgv.shift();

    var idx = myArgv.indexOf('-c');
    if(idx > -1 && idx < myArgv.length - 1) {
      var cmdArr = myArgv.slice(idx+1);
      MultiSsh.command = cmdArr.join(" ");
      MultiSsh.singleCmd = true;
      myArgv.splice(idx, myArgv.length-idx);
    }

    if(myArgv.length === 0) {
      console.log("usage: node lib/index.js tom dick harry [ -c cmd ]");
      return;
    }

    MultiSsh.servers = myArgv;
    MultiSsh.connect(MultiSsh.start);
  },

  start: function() {
    var ui = MultiSsh.ui = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    ui.setPrompt("node-multissh $ ");

    ui.on('line', function(line) {
      if(line.length > 0) {
        if(line === "exit") {
          MultiSsh.close();
        } else {
          ui.pause();
          MultiSsh.write(line);
        }
      } else {
        ui.prompt();
      }
    });

    ui.on('close', MultiSsh.close);

    ui.on('SIGINT', function() {
      ui.question('Are you sure you want to exit? ', function(answer) {
        if(answer.match(/^y(es)?$/i)) {
          ui.close();
        }
      });
    });

    ui.prompt();
  },

  connect: function(callback) {
    var i = 0;
    var len = MultiSsh.servers.length;
    MultiSsh.servers.forEach(function(server) {
      var args = [ server ];
      if(MultiSsh.singleCmd) {
        args.push(" \"" + MultiSsh.command + "\"");
      }
      var child = MultiSsh.connections[server] = spawn('ssh', args, {
        detached: true
      });
      child.on('error', function(e) {
        console.log(e.message);
        child.kill();
      });
      child.on('close', function(code) {
        console.log("ssh to " + server + " exited with code " + code);
        delete MultiSsh.connections[server];
        var idx = MultiSsh.servers.indexOf(server);
        MultiSsh.servers.splice(idx,1);
        if(MultiSsh.servers.length === 0) {
          MultiSsh.ui.close();
        }
      });
      i++;
      if(i === len) {
        setTimeout(callback, 10000);
      }
    });
  },

  write: function(line) {
    var i=0;
    var len = MultiSsh.servers.length;
    MultiSsh.servers.forEach(function(server) {
      var child = MultiSsh.connections[server];
      child.stdin.write(line + "\n");
      child.stdout.removeAllListeners('data');
      child.stdout.on('data', function(data) {
        console.log(server + ": begin>\n" + data + "<end " + server);
        i++;
        if(i === len) {
          MultiSsh.ui.prompt();
        } 
      });
    });
    setTimeout(function() {
      if(i < len) {
        MultiSsh.ui.prompt();
      }
    }, 5000);
  },

  close: function() {
    MultiSsh.servers.forEach(function(server) {
      var child = MultiSsh.connections[server];
      child.stdin.write("exit\n");
    });
  }
};

MultiSsh.init(process.argv);