# cz-jira-commit

A commitizen adapter for Jira issue management using Jira Rest API.

## Usage

### Global Installation

For a quick global installation of the plugin, simply run the `install.sh` script present in this repo:

```
chmod +x install.sh

./install.sh
```

### Add this adapter

Install this adapter

```
npm install cz-jira-commit
```

Reference it in your `.cz.json` of your project

```json
{
  "path": "node_modules/cz-jira-commit/"
}
```

or use commitizen to init
```
commitizen init cz-jira-commit
```

See **Jira setup** section below on working with your Jira instance

### Jira setup
This adapter interacts with Jira, hence needed to have access to your login credentials and url to the target Jira instance.
An example `${HOME}/jira.config.json` looks like:
```
{
  "username": "<your username>",
  "password": "<your password>",
  "protocol": "<http or https>",
  "host": "<your host name>",
  "port": "<your port number if required>"
}
```


### Day to day work

Instead of `git commit -m 'Your message'`, you type: `git cz` with this adapter and it prompts you for:
- [x] commit message
- [x] Jira Issue Key
- [ ] Workflow command
- [x] Time Spent
- [ ] Comment

It generates a commit like: `[<jira issue key>] <commit message>`

It will also attempt to action any workflow commands, log hours, and insert comments.

### Credit
- [cz-jira-smart-commit](https://github.com/commitizen/cz-jira-smart-commit) which this adapter is bootstraped on

- [pre-push](https://github.com/dflourusso/pre-push) for the pre-push git hook required to interact with Jira on git push