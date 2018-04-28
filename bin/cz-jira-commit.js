const fs = require('fs')
const yargs = require('yargs')
const { addCmt, onPush, actionsFilePath } = require('../jira')

if (process.argv.length >= 3) {
    const cmd = process.argv[2]
    switch (cmd) {
        case 'add':
            const argv = yargs
                .string('issue')
                .string('time')
                .argv

            if (argv.issue) return addCmt({ issue: argv.issue, time: argv.time })
            break;
        case 'push':
            return onPush()
        case 'list':
            if (fs.existsSync(actionsFilePath())) {
                console.log(actionsFilePath())
                console.log(fs.readFileSync(actionsFilePath(), { encoding: 'utf8' }))
            }

            break;
        default:
            console.error(`Unknown command: ${cmd}`)
    }
}