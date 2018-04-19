#!/bin/bash
echo "Installing Commitizen Globally"
npm install -g commitizen
echo "Installing JIRA commits"
npm install -g cz-jira-commit
echo "Creating a global config file"
echo '{ "path": "$(npm root -g)/cz-jira-commit/" }' > ~/.czrc
