#! /bin/bash

#literaly, state of the art function XDDD
function create_json
{
    OF=config/$1
    shift

    LEN=$#
    ITR=0
    VALUE=0

    #JSON
    echo -n "{" >> $OF    
    
    for i in $@;

    do
        ITR=$(expr $ITR + 1)

        if [ $VALUE = 0 ];

        then
            echo -n "\"$i\"" >> $OF
            echo -n ":" >> $OF
            VALUE=1
        elif [ $VALUE = 1 ];

        then
            echo -n "\"$i\"" >> $OF

            if [ $ITR != $LEN ];
            
            then
                echo -n "," >> $OF
            fi
        
            VALUE=0
        fi
    done 

    echo -n "}" >> $OF
}

function prompt_facebook_credentials 
{
    echo "Enter your facebook credentials:"    

    read -p "Email:" EMAIL
    read -p "Password:" PASSWORD
    
    create_json credentials.json email $EMAIL password $PASSWORD
}

function prompt_target 
{
    echo "Enter target address to send notifications to:"

    read -p "Address:" ADDRESS

    create_json target.json address $ADDRESS
}

function handle_config_exists 
{
    echo "A previously created config exists!"
    echo "Do you want to delete the existring one and proceed?"

    YN="Yes No"

    select opt in $YN;

    do
        if [ "$opt" = "Yes" ];

        then
            rm -rf ./config/*
            break
        elif [ "$opt" = "No" ];

        then
            exit
        fi
    done
}

function check_node_modules
{
    local NODE_MODULES=$(ls | grep node_modules)

    if [ "$NODE_MODULES" != "node_modules" ];

    then        
        npm update
    fi
}

function check_structure 
{
    for d in $(ls);

    do
        if [ "$d" = "config" ];

        then
            for dc in $(ls config);

            do 
                if [ "$dc" = "credentials.json" ];

                then 
                    return 1
                fi

                if [ "$dc" = "target.json" ];

                then
                    return 1
                fi
            done
        fi
    done
    
    mkdir ./config
    
    return 0
}

check_node_modules

check_structure

if [ $? = 1 ];

then
    handle_config_exists
fi

prompt_facebook_credentials
prompt_target

echo "Configuration finished"