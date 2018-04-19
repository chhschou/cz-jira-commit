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


### Day to day work

Instead of `git commit -m 'Your message'`, you type: `git cz` with this adapter and it prompts you for:
- [x] commit message
- [x] Jira Issue Key
- [ ] Workflow command
- [x] Time Spent
- [ ] Comment

It generates a commit like: [<jira issue key>] <commit message>

It will also attempt to action any workflow commands, log hours, and insert comments.
