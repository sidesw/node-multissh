node-multissh
============

A multi-server SSH utility similar to cap shell.

###To install:
```zsh
  git clone https://github.com/sidesw/node-multissh.git
  cd node-multissh && npm install -g
```
###To run:
```zsh
  multissh [-u username] [-p port] tom dick harry [-c cmd]
```

###Currently supported:
  - Running shell commands remotely and printing the output server wise
  - Does NOT spawn a new SSH process for every command
  - Only key based auth
  - Assumes ssh config resides in ```~/.ssh/config``` and default key is ```~/.ssh/id_rsa```

###Not supported:
  - Password based auth
  - Interactive command line apps (that require input from stdin)
  - Command line apps that use ncurses
  - Auto-complete
  - Running commands as sudo

### Sample output
```zsh
$ multissh tom dick harry
node-multissh $ hostname
tom    : tom.example.com
dick   : dick.example.com
harry  : harry.example.com
node-multissh $ exit
ssh to tom exited with code 0
ssh to dick exited with code 0
ssh to harry exited with code 0
```
