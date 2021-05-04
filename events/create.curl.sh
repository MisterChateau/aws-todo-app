#!/bin/bash
if [ -z "${gateway_url}" ]
then
	echo '"$gateway_url" env not set'
	exit 1
fi

[[ $(command -v jq) ]] || echo "jq missing";

body="$(jq -n --arg todo $1 '{ "todo": $todo, "done": false }')"

curl -X POST -d "$body" -H "Content-Type: application/json" ${gateway_url}/todos
