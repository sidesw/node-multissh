node-multissh
============

A multi-server ssh utility similar to cap shell.

To run:
  node lib/index.js tom dick harry [ -c cmd ]


Currently supported:
  - Running shell commands remotely and printing the output server wise
  - Does not spawan new ssh everytime
  - Only key based auth
  - Assumes ssh config resides in ~/.ssh/config

Not supported:
  - Password based auth
  - Interactive command line apps (that require input from stdin)
  - Command line apps that use ncurses
  - Auto-complete
