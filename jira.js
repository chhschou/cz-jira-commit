const { O_APPEND, O_CREAT } = require('constants');
const os = require('os')
const path = require('path')
const fs = require('fs')
const { logWork } = require('./log-work')
const { getRepositoryName, getBranchName } = require('./git');

const jiraActionsFilePath = path.resolve(os.homedir(), '.cz-jira-commit.actions')

function actionCmt(cmt) {
    if (cmt.issue) {
        if (cmt.time) return logWork(cmt.issue, cmt.time);
    }

    return Promise.resolve('')
}

module.exports = {
    addCmt: function (cmt) {
        let fileContent = {}
        if (fs.existsSync(jiraActionsFilePath)) fileContent = JSON.parse(fs.readFileSync(jiraActionsFilePath, { encoding: 'utf8' }))
        const repositoryName = getRepositoryName();
        const branchName = getBranchName();
        if (!fileContent.hasOwnProperty(repositoryName)) fileContent[repositoryName] = {}
        if (fileContent[repositoryName].hasOwnProperty(branchName)) fileContent[repositoryName][branchName].push(cmt)
        else fileContent[repositoryName][branchName] = [cmt]
        fs.writeFileSync(jiraActionsFilePath, JSON.stringify(fileContent, null, 2))
        console.log(`Updated ${jiraActionsFilePath}`)
        console.log(JSON.stringify(cmt, null, 2))
    },
    onPush: function () {
        if (fs.existsSync(jiraActionsFilePath)) {
            const repositoryName = getRepositoryName();
            const branchName = getBranchName();
            const fileContent = JSON.parse(fs.readFileSync(jiraActionsFilePath, { encoding: 'utf8' }))
            if (fileContent.hasOwnProperty(repositoryName) && fileContent[repositoryName].hasOwnProperty(branchName)) {
                fileContent[repositoryName][branchName]
                    .map((cmt) => {
                        return actionCmt(cmt)
                            .then((res) => console.log('action applied', cmt))
                            .catch((err) => console.error(err))
                    })

                fileContent[repositoryName][branchName] = []
                fs.writeFileSync(jiraActionsFilePath, JSON.stringify(fileContent, null, 2))
            }
        }
    }
}
