var JiraClient = require('jira-connector');
var FileCookieStore = require('tough-cookie-filestore');
var request = require('request');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

let username = '';

const _createJiraClient = (protocol, host, port, username, password) => {
  const jarPath = path.resolve(require('os').homedir(), '.cookies.json');
  if (!fs.existsSync(jarPath)) fs.closeSync(fs.openSync(jarPath, 'w'));
  const jar = request.jar(new FileCookieStore(jarPath));

  return new JiraClient({
    protocol,
    host,
    port,
    basic_auth: {
      username: username,
      password: password
    },
    cookie_jar: jar
  });
};

const _createDefaultJiraClient = () => {
  const jiraConfigPath = path.resolve(
    require('os').homedir(),
    '.jira.config.json'
  );
  if (fs.existsSync(jiraConfigPath)) {
    const fileContent = require(jiraConfigPath);
    username = fileContent.username;

    return _createJiraClient(
      fileContent.protocol,
      fileContent.host,
      fileContent.port,
      fileContent.username,
      fileContent.password
    );
  }

  return null;
};

const jira = _createDefaultJiraClient();

const _getUser = username => {
  return jira.user.getUser({ username: 'Chris Chou' }).then(user => {
    delete user.timeZone;
    delete user.groups;
    delete user.expand;

    return user;
  });
};

const _formatMomentJira = aMoment => {
  return aMoment.format('Y-MM-DDTHH:mm:ss.SSSZZ');
};

const _getStartTime = timeSpent => {
  if (!timeSpent) return;
  const now = moment();
  if (timeSpent.match(/^\d+$/))
    return _formatMomentJira(now.subtract(+timeSpent, 'minutes'));
  // timespent format: weeks (w), days (d), hours (h) and minutes (m)
  const weeks = timeSpent.match(/(\d+)w/i);
  const days = timeSpent.match(/(\d+)d/i);
  const hours = timeSpent.match(/(\d+)h/i);
  const minutes = timeSpent.match(/(\d+)m/i);

  // mutate now
  weeks && now.subtract(weeks[1], 'weeks');
  days && now.subtract(days[1], 'days');
  hours && now.subtract(hours[1], 'hours');
  minutes && now.subtract(minutes[1], 'minutes');

  return _formatMomentJira(now);
};

const _createWorkLog = (user, timeSpent) => {
  const worklog = {
    author: user,
    timeSpent,
    started: _getStartTime(timeSpent)
  };

  return worklog;
};

const logWork = (issueKey, timeSpent) => {
  if (jira && issueKey.match(/^[A-Za-z]+-\d+$/)) {
    return _getUser(username)
      .then(user => {
        const worklog = _createWorkLog(user, timeSpent);
        return jira.issue.addWorkLog({
          issueKey,
          worklog,
          adjustEstimate: 'auto'
        });
      })
      .catch(err => console.error('err', err));
  }
};

module.exports = {
  logWork
};

// logWork('VZA-4140', '1d 2m').then((res) => console.log(res))
