#!/bin/bash
if [ -z "${gateway_url}" ]
then
	echo '"$gateway_url" env not set'
	exit 1
fi

[[ $(command -v jq) ]] || echo "jq missing";

id=$1
todo=$2
done=$3

body="$(jq -n --arg todo $2 --arg done $3 '{ "todo": $todo, "done": $2 }')"
curl -X PATCH -d "$body" -H "Content-Type: application/json" ${gateway_url}/$1
