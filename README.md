node-multissh
============

A multi-server ssh utility similar to cap shell.

###To install:
```zsh
  git clone https://github.com/sidesw/node-multissh.git
  cd node-multissh && npm install -g
```
###To run:
```zsh
  multissh tom dick harry [ -c cmd ]
```

###Currently supported:
  - Running shell commands remotely and printing the output server wise
  - Does not spawn new ssh everytime
  - Only key based auth
  - Assumes ssh config resides in ~/.ssh/config

###Not supported:
  - Password based auth
  - Interactive command line apps (that require input from stdin)
  - Command line apps that use ncurses
  - Auto-complete
  - Running commands as sudo
