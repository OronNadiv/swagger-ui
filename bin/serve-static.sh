#!/usr/bin/env bash

port=${PORT:-3002}

http-server dist/ -i -a 0.0.0.0 -p ${port}
