#!/bin/bash

 ls out/*.png -1 | sort | xargs -I{} bash -c "echo {} \$(identify -verbose {} | grep Signature | awk '{print \$2}')"
