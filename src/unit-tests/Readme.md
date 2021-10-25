# Exclude this folder to run build

by placing the following line on tsconfig.json  after "include": [] as it only works over include subset...
    "exclude": ["src/unit-tests/*.ts"] 
