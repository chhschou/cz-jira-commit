var inquirer = require('inquirer');
const { addCmt } = require('./jira');

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {
  prompter: prompter,
  formatCommit: formatCommit
};

// When a user runs `git cz`, prompter will
// be executed. We pass you cz, which currently
// is just an instance of inquirer.js. Using
// this you can ask questions and get answers.
//
// The commit callback should be executed when
// you're ready to send back a commit template
// to git.
//
// By default, we'll de-indent your commit
// template and will keep empty lines.
function prompter(cz, commit) {

  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Git commit message (required):\n',
      validate: function (input) {
        if (!input) {
          return 'empty commit message';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'issue',
      message: 'Jira Issue ID (optional):\n',
      validate: function (input) {
        if (!input || (input.match(/[A-Z]+-\d+/))) {
          return true;
        } else {
          return 'invalid jira issue ID';
        }
      },
      filter: function (input) {
        if (input && input.match(/[A-Z]+-\d+/)) {
          return input.match(/[A-Z]+-\d+/)[0]
        }

        return input
      }
    },
    // {
    //   type: 'input',
    //   name: 'workflow',
    //   message: 'Workflow command (testing, closed, etc.) (optional):\n',
    //   validate: function(input) {
    //     if (input && input.indexOf(' ') !== -1) {
    //       return 'Workflows cannot have spaces in smart commits. If your workflow name has a space, use a dash (-)';
    //     } else {
    //       return true;
    //     }
    //   }
    // },
    {
      type: 'input',
      name: 'time',
      message: 'Time spent (i.e. 3h 15m) (optional):\n',
      when: function (answers) {
        return answers.issue && answers.issue.match(/[A-Za-z]+-\d+/);
      }
    },
    // {
    //   type: 'input',
    //   name: 'comment',
    //   message: 'Jira comment (optional):\n'
    // },
  ]).then((answers) => {
    const cmtMsg = formatCommit(answers);
    if (answers.issue) addCmt(answers);
    commit(cmtMsg);
  });
}

function formatCommit(answers) {
  const commitMsg = answers.issue ? `[${answers.issue}] ` : '';

  return commitMsg.concat(answers.message);
}
