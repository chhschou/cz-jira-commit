const { O_APPEND, O_CREAT } = require('constants');
const os = require('os')
const path = require('path')
const fs = require('fs')
const { logWork } = require('./log-work')

const jiraActionsFilePath = path.resolve(os.tmpdir(), '.cz-jira-commit.actions')


function actionCmt(cmt) {
    return cmt;
}

function logActionRes(res) {
    console.log(res)
}

module.exports = {
    add: function (projName, branch, answers) {
        let fileContent = {}
        if (fs.existsSync(jiraActionsFilePath)) fileContent = JSON.parse(fs.readFileSync(jiraActionsFilePath, { encoding: 'utf8' }))
        if (!fileContent.hasOwnProperty(projName)) fileContent[projName] = {}
        if (fileContent[projName].hasOwnProperty(branch)) fileContent[projName][branch].push(answers)
        else fileContent[projName][branch] = [answers]
        fs.writeFileSync(jiraActionsFilePath, JSON.stringify(fileContent, null, 2))
        console.log(`Updated ${jiraActionsFilePath}`, answers)
    },
    onPush: function onPush(projName, branch) {
        const fileContent = fs.readFileSync(jiraActionsFilePath, { encoding: 'utf8' })
        if (fileContent.hasOwnProperty(projName) && fileContent[projName].hasOwnProperty(branch)) {
            fileContent[projName][branch]
                .map((cmt) => {
                    return actionCmt(cmt)
                })
                .forEach((res) => {
                    logActionRes(res)
                })

            fileContent[projName][branch] = []
            fs.writeFileSync(jiraActionsFilePath, fileContent, { flag: O_CREAT })
        }

    }

}
